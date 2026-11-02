import Image from "next/image";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHero, Section } from "@/components/ui/section";
import { AMENITY_ICONS, AMENITY_LABELS } from "@/lib/amenities";
import { addMinutesToTime, formatVnd } from "@/lib/format";
import { paths } from "@/lib/routes";
import type { Operator, Route, Trip } from "@/types/domain";
import { TripSeatCta, TripSeatCtaFallback } from "./trip-seat-cta";

/**
 * Figma 11 · Chi tiết chuyến (6:613 desktop / 6:2315 mobile): hero, photo + caption,
 * amenities, "Lộ trình dự kiến", then "Chọn chỗ ngồi" / "Điều kiện vé".
 */
export function TripOverview({ trip, route, operator }: { trip: Trip; route: Route; operator: Operator }) {
  const arrive = addMinutesToTime(trip.departTime, trip.durationMinutes);
  const stops = [
    {
      title: `${trip.checkInTime} · Có mặt tại ${trip.pickupPoint}`,
      text: "Kiểm tra vé điện tử và cửa ra xe theo thông tin xác nhận.",
    },
    {
      title: `${trip.departTime} → ${arrive} · ${trip.dropoffPoint}`,
      text: "Giờ đến dự kiến. Điểm trả cụ thể được xác nhận trên vé.",
    },
  ];
  // Not drawn on Figma 11; mirrors the seat page's price lines so the fare is known before choosing seats.
  const priceSummary = (
    <>
      <p className="text-sm text-muted">
        Giá niêm yết: <s>{formatVnd(trip.listPrice)}</s>
      </p>
      <p className="text-price font-semibold text-primary">
        {formatVnd(trip.price)}
        <span className="text-sm font-normal text-muted"> / chỗ</span>
      </p>
      <p className="text-sm text-green">Đã giảm {formatVnd(trip.listPrice - trip.price)} theo ưu đãi chuyến.</p>
    </>
  );

  return (
    <>
      <PageHero
        crumb="Chi tiết chuyến"
        title="Hiểu rõ chuyến xe trước khi đặt."
        description={`${operator.name} · ${route.name} · Dữ liệu minh họa`}
      />
      <Section tone="white" labelledBy="trip-route-title">
        <figure className="flex flex-col gap-6">
          <div className="relative h-60 overflow-hidden rounded-lg lg:h-105">
            <Image
              src={route.image.src}
              alt={route.image.alt}
              fill
              preload
              sizes="(min-width: 1232px) 1200px, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
          <figcaption className="text-xs font-medium text-muted">
            Ảnh khu vực xe tại bến do khách hàng cung cấp, không đại diện cho phương tiện của chuyến mẫu.
          </figcaption>
        </figure>

        <h2 className="sr-only">Tiện ích chuyến</h2>
        <ul className="grid gap-6 lg:grid-cols-4">
          {trip.amenities.map((amenity) => (
            <li key={amenity} className="flex items-center gap-3 text-body font-semibold text-navy">
              <Icon name={AMENITY_ICONS[amenity]} className="shrink-0 text-primary" />
              {AMENITY_LABELS[amenity]}
            </li>
          ))}
        </ul>

        <h2 id="trip-route-title" className="text-h3 font-bold text-navy">
          Lộ trình dự kiến
        </h2>
        <ol className="flex flex-col gap-6">
          {stops.map((stop) => (
            <li key={stop.title} className="flex flex-col gap-2 rounded-md bg-sky p-4">
              <p className="text-sm font-semibold text-primary">{stop.title}</p>
              <p className="text-sm text-muted">{stop.text}</p>
            </li>
          ))}
        </ol>

        <Suspense fallback={<TripSeatCtaFallback tripId={trip.id}>{priceSummary}</TripSeatCtaFallback>}>
          <TripSeatCta tripId={trip.id}>{priceSummary}</TripSeatCta>
        </Suspense>
        <ButtonLink href={paths.policy} variant="secondary" className="w-full lg:w-80">
          Điều kiện vé
        </ButtonLink>
      </Section>
    </>
  );
}

export function TripOverviewSkeleton() {
  return (
    <Section tone="paper">
      <div aria-hidden="true" className="h-4.5 w-40 animate-pulse rounded-sm bg-white" />
      <p aria-hidden="true" className="text-h3 font-bold text-navy lg:text-h1">
        Hiểu rõ chuyến xe trước khi đặt.
      </p>
      <p role="status" className="text-body text-muted">
        Đang tải thông tin chuyến…
      </p>
      <div aria-hidden="true" className="h-60 animate-pulse rounded-lg bg-white lg:h-105" />
    </Section>
  );
}
