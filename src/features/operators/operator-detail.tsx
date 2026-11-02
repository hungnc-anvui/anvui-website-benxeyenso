import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Breadcrumb, Section, SectionHeading } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { images } from "@/data/mock/images";
import { getRoute, getTripsByOperator, ORIGIN_LABEL } from "@/data/repositories/transport";
import { SupportButton } from "@/features/support/support-provider";
import { AMENITY_LABELS } from "@/lib/amenities";
import { formatDuration, formatVnd } from "@/lib/format";
import { paths, searchHref } from "@/lib/routes";
import type { Operator, Route } from "@/types/domain";

/** Figma 05 · Chi tiết doanh nghiệp — desktop 5:374, mobile 6:1787. Every section reads the operator's own data. */
export function OperatorDetail({ operator }: { operator: Operator }) {
  const routes = operator.routeIds.map(getRoute).filter((r): r is Route => Boolean(r));
  return (
    <>
      <OperatorHero operator={operator} />
      <OperatorProfile operator={operator} mainRoute={routes[0]} />
      <OperatorRoutes operator={operator} routes={routes} />
      <OperatorConditions operator={operator} />
      <OperatorPickup operator={operator} />
    </>
  );
}

/** Placeholder while the slug resolves (only shown for slugs that were not prerendered). */
export function OperatorDetailFallback() {
  return (
    <Section tone="paper">
      <p role="status" className="text-sm text-muted">
        Đang tải hồ sơ doanh nghiệp…
      </p>
      <div aria-hidden="true" className="h-[38px] w-2/3 rounded-sm bg-mist lg:h-[60px]" />
      <div aria-hidden="true" className="h-[26px] w-full max-w-[640px] rounded-sm bg-mist" />
    </Section>
  );
}

/**
 * CTA to the operator's trips: routes with a published schedule go to search results,
 * the others open the "otherTrip" support state (same rule as /tuyen-xe).
 */
function TripsCta({ route, className, children }: { route?: Route; className: string; children: ReactNode }) {
  if (route?.hasSchedule) {
    return (
      <ButtonLink href={searchHref({ to: route.destinationId })} className={className}>
        {children}
      </ButtonLink>
    );
  }
  return (
    <SupportButton view="otherTrip" className={buttonClass("primary", className)}>
      {children}
    </SupportButton>
  );
}

/** Figma 5:388 / 6:1798 — breadcrumb keeps "Doanh nghiệp" as a link back to the list. */
function OperatorHero({ operator }: { operator: Operator }) {
  return (
    <Section tone="paper" labelledBy="operator-title">
      <Breadcrumb items={[{ label: "Doanh nghiệp", href: paths.operators }]} />
      <h1 id="operator-title" className="text-h3 font-bold text-navy lg:text-h1">
        {operator.name}
      </h1>
      <p className="text-body text-muted">Hồ sơ minh họa · Chờ bến cung cấp tên, logo và thông tin chính thức.</p>
    </Section>
  );
}

/** Figma "Hồ sơ doanh nghiệp · Tổng quan" (30:3362 / 30:5254). */
function OperatorProfile({ operator, mainRoute }: { operator: Operator; mainRoute?: Route }) {
  const facts: Array<[string, string]> = [
    ["Tên thương mại", operator.name],
    ["Tên pháp nhân, mã số thuế", "Chờ xác nhận"],
    ["Quầy vé, hotline, Zalo", "Chờ cập nhật"],
    [
      "Đội xe minh họa",
      `${operator.fleetSize} xe ${operator.vehicleType.toLowerCase()} · ${operator.yearsOperating} năm khai thác`,
    ],
  ];
  return (
    <Section tone="white" labelledBy="operator-profile-title">
      <div className="grid items-start gap-8 lg:grid-cols-[576fr_592fr]">
        <div className="flex flex-col gap-5">
          <Tag>HỒ SƠ DOANH NGHIỆP</Tag>
          <h2 id="operator-profile-title" className="text-h2 font-bold whitespace-pre-line text-navy">
            {"Thông tin rõ ràng.\nAn tâm lựa chọn."}
          </h2>
          <p className="text-body text-muted">
            Tìm hiểu tuyến khai thác, loại xe và điều kiện phục vụ trước khi chọn chuyến.
          </p>
          <ul className="text-body text-ink">
            {facts.map(([label, value]) => (
              <li key={label}>
                {label}: {value}
              </li>
            ))}
          </ul>
          <TripsCta route={mainRoute} className="w-full lg:w-[360px]">
            Xem chuyến của doanh nghiệp
          </TripsCta>
        </div>
        <figure className="flex flex-col gap-3">
          <div className="relative h-[250px] overflow-hidden rounded-lg lg:h-[390px]">
            <Image
              src={images.bus.src}
              alt={images.bus.alt}
              fill
              preload
              sizes="(min-width: 1024px) 592px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-xs font-medium text-muted">
            Ảnh khu vực xe tại bến; không đại diện cho doanh nghiệp minh họa.
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}

/** Figma "Tuyến khai thác & dịch vụ" (30:3375 / 30:5267) — one card per route in operator.routeIds. */
function OperatorRoutes({ operator, routes }: { operator: Operator; routes: Route[] }) {
  const trips = getTripsByOperator(operator.id);
  return (
    <Section tone="paper" labelledBy="operator-routes-title">
      <SectionHeading
        id="operator-routes-title"
        size="lg"
        title="Tuyến xe của doanh nghiệp"
        note="Lịch tuyến và giá dưới đây dùng để minh họa hồ sơ."
      />
      <ul className="flex flex-col gap-6">
        {routes.map((route) => {
          const routeTrips = trips.filter((t) => t.routeId === route.id);
          const priceFrom = routeTrips.length ? Math.min(...routeTrips.map((t) => t.price)) : route.priceFrom;
          return (
            <li key={route.id} className="flex flex-col gap-6 rounded-lg bg-white p-6 lg:flex-row lg:items-start">
              <div className="flex flex-col gap-3 lg:w-[800px]">
                <h3 className="text-h3 font-bold text-navy">{route.name}</h3>
                <p className="text-body text-muted">
                  {route.vehicleType} · Khoảng {formatDuration(route.durationMinutes)}
                </p>
                <p className="text-price font-semibold text-primary">Từ {formatVnd(priceFrom)} / hành khách</p>
              </div>
              <TripsCta route={route} className="w-full lg:w-[300px] lg:shrink-0">
                Xem lịch chuyến
                <span className="sr-only">: {route.name}</span>
              </TripsCta>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** "Wi-Fi, nước uống, cổng sạc và điều hòa" */
function amenityList(operator: Operator) {
  const labels = operator.amenities.map((a, i) => {
    const label = AMENITY_LABELS[a];
    return i === 0 || label === "Wi-Fi" ? label : label.toLowerCase();
  });
  if (labels.length < 2) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} và ${labels.at(-1)}`;
}

/** Figma "Tiện ích & điều kiện phục vụ" (30:3385 / 30:5277). */
function OperatorConditions({ operator }: { operator: Operator }) {
  const blocks = [
    {
      title: "Tiện ích theo chuyến",
      text: `${amenityList(operator)} được hiển thị theo thông tin doanh nghiệp xác nhận cho từng chuyến.`,
    },
    {
      title: "Hành lý & hỗ trợ",
      text: "Kiểm tra quy định hành lý, nhu cầu hỗ trợ người cao tuổi, trẻ em và yêu cầu đặc biệt trước khi đặt vé.",
    },
    {
      title: "Đổi, hủy & hoàn vé",
      text: "Điều kiện và thời hạn áp dụng được cung cấp trước khi thanh toán. Liên hệ nhà vận tải khi cần thay đổi.",
    },
  ];
  return (
    <Section tone="white" labelledBy="operator-conditions-title">
      <SectionHeading id="operator-conditions-title" size="lg" title="Biết rõ trước khi khởi hành" />
      <ul className="grid gap-6 lg:grid-cols-3">
        {blocks.map((block) => (
          <li key={block.title} className="flex flex-col gap-2 rounded-md bg-sky p-4">
            <h3 className="text-sm font-semibold text-primary">{block.title}</h3>
            <p className="text-sm text-muted">{block.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Figma "Điểm đón & liên hệ doanh nghiệp" (30:3397 / 30:5289). */
function OperatorPickup({ operator }: { operator: Operator }) {
  return (
    <Section tone="sky" labelledBy="operator-pickup-title">
      <SectionHeading id="operator-pickup-title" size="lg" title="Đến đúng điểm. Gặp đúng nhà xe." />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="relative h-[280px] overflow-hidden rounded-lg lg:h-[350px]">
          <Image
            src={images.counter.src}
            alt={images.counter.alt}
            fill
            sizes="(min-width: 1024px) 588px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-title font-semibold text-navy">Điểm đón: {ORIGIN_LABEL}</h3>
          <p className="text-body whitespace-pre-line text-muted">
            {
              "Quầy vé / cửa lên xe: xác nhận trên vé và bảng thông tin tại bến.\nThời gian có mặt: theo hướng dẫn của chuyến đã đặt."
            }
          </p>
          <SupportButton view="support" className={buttonClass("primary", "w-full lg:w-[360px]")}>
            Liên hệ doanh nghiệp
            <span className="sr-only">: {operator.name}</span>
          </SupportButton>
          <ButtonLink href={paths.organization} variant="secondary" className="w-full lg:w-[360px]">
            Xem tổ chức bến
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
