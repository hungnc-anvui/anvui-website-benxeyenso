import type { Metadata } from "next";
import { PhotoCard } from "@/components/common/photo-card";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { getRoutes } from "@/data/repositories/transport";
import { RouteFilterForm, RouteFilterGroup, RouteFilterItem, RouteFilterProvider } from "@/features/routes/route-filter";
import { SearchForm } from "@/features/search/search-form";
import { SupportButton } from "@/features/support/support-provider";
import { formatDuration, formatVnd } from "@/lib/format";
import { searchHref } from "@/lib/routes";
import type { Route } from "@/types/domain";

export const metadata: Metadata = {
  title: "Danh sách tuyến",
  description: "Tìm tuyến xe từ Bến xe Yên Sở theo điểm đến và xem các chuyến phù hợp.",
};

/** Figma 03 · Danh sách tuyến — desktop 5:166, mobile 6:1591. */
export default function RoutesPage() {
  const routes = getRoutes();
  const featured = routes.filter((r) => r.featured);
  const others = routes.filter((r) => !r.featured);

  return (
    <>
      <PageHero
        crumb="Tuyến xe"
        title="Từ Yên Sở, bạn muốn đi đâu?"
        description="Tìm tuyến theo điểm đến và xem các chuyến phù hợp."
      />
      <RouteFilterProvider>
        <Section tone="paper" labelledBy="route-filter-title">
          <h2 id="route-filter-title" className="sr-only">
            Tìm chuyến và lọc tuyến xe
          </h2>
          <SearchForm />
          <RouteFilterForm />
        </Section>
        <RouteFilterGroup destinationIds={featured.map((r) => r.destinationId)}>
          <FeaturedRoutes routes={featured} />
        </RouteFilterGroup>
        <RouteFilterGroup destinationIds={others.map((r) => r.destinationId)}>
          <OtherRoutes routes={others} />
        </RouteFilterGroup>
      </RouteFilterProvider>
    </>
  );
}

/** Figma "Tuyến xe nổi bật" (5:209 / 6:1631) — same content as the home section, items filterable. */
function FeaturedRoutes({ routes }: { routes: Route[] }) {
  return (
    <Section tone="paper" labelledBy="featured-routes-title">
      <SectionHeading
        id="featured-routes-title"
        eyebrow="KẾT NỐI TỪ YÊN SỞ"
        title="Tuyến xe nổi bật"
        description="Chọn điểm đến, xem nhà xe và tìm chuyến phù hợp."
        note="Tuyến, thời gian và giá dưới đây là dữ liệu minh họa cho bản thiết kế."
      />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <RouteFilterItem key={route.id} destinationId={route.destinationId}>
            <PhotoCard
              image={route.image}
              eyebrow="TUYẾN XE NỔI BẬT"
              title={route.name}
              description={`Thời gian dự kiến · ${formatDuration(route.durationMinutes)}`}
              price={`Từ ${formatVnd(route.priceFrom)}`}
              cta="Xem chuyến xe"
              href={searchHref({ to: route.destinationId })}
            />
          </RouteFilterItem>
        ))}
      </ul>
    </Section>
  );
}

/** Figma "Thông tin tuyến khác" (5:242 / 6:1664). Routes without a published schedule open "otherTrip". */
function OtherRoutes({ routes }: { routes: Route[] }) {
  const cta = "w-full lg:w-[260px] lg:shrink-0";
  return (
    <Section tone="white" labelledBy="other-routes-title">
      <h2 id="other-routes-title" className="sr-only">
        Thông tin tuyến khác
      </h2>
      <ul className="flex flex-col gap-6">
        {routes.map((route) => (
          <RouteFilterItem
            key={route.id}
            destinationId={route.destinationId}
            className="flex flex-col gap-5 rounded-md bg-paper p-6 lg:flex-row lg:items-start"
          >
            <h3 className="text-title font-semibold text-navy lg:w-[650px]">{route.name}</h3>
            {route.hasSchedule ? (
              <ButtonLink href={searchHref({ to: route.destinationId })} variant="secondary" className={cta}>
                Xem lịch & giá
                <span className="sr-only">: {route.name}</span>
              </ButtonLink>
            ) : (
              <SupportButton view="otherTrip" className={buttonClass("secondary", cta)}>
                Xem lịch & giá
                <span className="sr-only">: {route.name}</span>
              </SupportButton>
            )}
          </RouteFilterItem>
        ))}
      </ul>
      <p className="text-sm text-muted">Danh sách minh họa; tuyến thực tế cần bến xác nhận trước khi công bố.</p>
    </Section>
  );
}
