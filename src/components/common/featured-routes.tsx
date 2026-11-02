import { PhotoCard } from "@/components/common/photo-card";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { getFeaturedRoutes } from "@/data/repositories/transport";
import { formatDuration, formatVnd } from "@/lib/format";
import { paths, searchHref } from "@/lib/routes";

/** Figma "Tuyến xe nổi bật" (3:245 home, 5:209 routes page). */
export function FeaturedRoutesSection({ showListLink = true }: { showListLink?: boolean }) {
  const featured = getFeaturedRoutes();
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
        {featured.map((route) => (
          <li key={route.id}>
            <PhotoCard
              image={route.image}
              eyebrow="TUYẾN XE NỔI BẬT"
              title={route.name}
              description={`Thời gian dự kiến · ${formatDuration(route.durationMinutes)}`}
              price={`Từ ${formatVnd(route.priceFrom)}`}
              cta="Xem chuyến xe"
              href={searchHref({ to: route.destinationId })}
            />
          </li>
        ))}
      </ul>
      {showListLink ? (
        <ButtonLink href={paths.routes} className="w-full lg:w-[280px]">
          Xem danh sách tuyến
        </ButtonLink>
      ) : null}
    </Section>
  );
}
