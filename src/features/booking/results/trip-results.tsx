"use client";

import { useState, type ReactNode } from "react";
import { TripCard } from "@/components/common/trip-card";
import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import {
  getDestination,
  getOperator,
  getRouteByDestination,
  getTripsForDestination,
  seatsLeft,
} from "@/data/repositories/transport";
import { SupportButton } from "@/features/support/support-provider";
import { bookedSeatsFor, useTickets } from "@/stores/booking-store";
import { formatDateLong, formatDay, formatLunar } from "@/lib/format";
import { paths, searchHref } from "@/lib/routes";
import { useToday } from "@/lib/use-today";
import { seatsHref } from "../seats/href";
import { tripHref } from "../trip/href";
import {
  activeFilterCount,
  applyFilters,
  DEFAULT_FILTERS,
  describeFilters,
  sortLabel,
  type TripFilters,
  type TripView,
} from "./filters";
import { FiltersDialog } from "./filters-dialog";

/**
 * Figma 10 · Kết quả tìm chuyến (6:493 desktop / 6:2203 mobile), below the search form:
 * eyebrow, route title, date line, "Lọc giờ đi & loại xe" / "Sắp xếp" and the trip cards.
 * Renders flat children so the parent Section keeps Figma's 24px rhythm.
 */
export function TripResults({
  destinationId,
  date: dateParam,
  returnDate,
}: {
  destinationId: string;
  date: string | null;
  returnDate: string | null;
}) {
  const today = useToday();
  const tickets = useTickets();
  const [filters, setFilters] = useState<TripFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const destination = getDestination(destinationId);
  const route = getRouteByDestination(destinationId);
  // No date in the URL → today (known only on the client).
  const date = dateParam ?? today;
  const isPast = Boolean(date && today && date < today);

  const items: TripView[] = getTripsForDestination(destinationId).map((trip) => ({
    trip,
    seatsLeft: seatsLeft(trip, date ? bookedSeatsFor(tickets, trip.id, date) : []),
  }));
  const visible = applyFilters(items, filters);
  const filterCount = activeFilterCount(filters);

  const title = destination ? `Yên Sở → ${destination.label}` : "Chưa xác định điểm đến";
  const countText =
    filterCount > 0 ? `${visible.length}/${items.length} chuyến minh họa` : `${items.length} chuyến minh họa`;
  const meta = [date ? `${formatDateLong(date)} · Âm lịch ${formatLunar(date)}` : null, items.length ? countText : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Eyebrow>KẾT QUẢ TÌM CHUYẾN</Eyebrow>
      <h1 id="results-title" className="text-h3 font-bold text-navy lg:text-h2">
        {title}
      </h1>
      <p aria-live="polite" className="min-h-6.5 text-body text-muted">
        {meta}
      </p>

      {returnDate && destination && date && returnDate >= date ? (
        <p className="rounded-md bg-sky p-4 text-sm text-ink">
          <span className="font-semibold text-primary">Khứ hồi · Ngày về {formatDateLong(returnDate)}</span> · ÂL{" "}
          {formatLunar(returnDate)}. Website hiện đặt vé chiều đi từ Bến xe Yên Sở; vé chiều về {destination.label} → Yên
          Sở vui lòng mua tại bến hoặc liên hệ nhà xe.
        </p>
      ) : null}

      {!destination ? (
        <Notice
          title="Không tìm thấy điểm đến"
          action={
            <ButtonLink href={paths.routes} variant="secondary" className="w-full sm:w-60">
              Xem danh sách tuyến
            </ButtonLink>
          }
        >
          Vui lòng chọn điểm đến trong ô “Điểm đến” phía trên rồi ấn “Tìm chuyến xe”.
        </Notice>
      ) : isPast && date && today ? (
        <Notice
          title="Ngày đi đã qua"
          action={
            <ButtonLink href={searchHref({ to: destinationId, date: today })} className="w-full sm:w-60">
              Xem chuyến hôm nay
            </ButtonLink>
          }
        >
          Ngày {formatDay(date)} đã qua. Vui lòng chọn ngày khởi hành khác ở ô “Ngày đi” phía trên.
        </Notice>
      ) : items.length === 0 ? (
        <Notice
          title="Chưa có chuyến đặt trực tuyến"
          action={
            <>
              <ButtonLink href={paths.routes} variant="secondary" className="w-full sm:w-60">
                Xem danh sách tuyến
              </ButtonLink>
              <SupportButton view="otherTrip" className={buttonClass("ghost", "w-full sm:w-60")}>
                Hỏi thông tin chuyến
              </SupportButton>
            </>
          }
        >
          Tuyến {route?.name ?? title} chưa mở bán vé trên website. Liên hệ doanh nghiệp vận tải để xác nhận lịch chạy và
          chỗ còn trống.
        </Notice>
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:flex-row">
            <Button
              variant="secondary"
              aria-haspopup="dialog"
              className="w-full lg:w-70"
              onClick={() => setFiltersOpen(true)}
            >
              Lọc giờ đi & loại xe
              {filterCount > 0 ? (
                <span className="rounded-full bg-primary px-2 text-xs leading-5 text-white">
                  {filterCount}
                  <span className="sr-only"> bộ lọc đang bật</span>
                </span>
              ) : null}
            </Button>
            <Button
              variant="ghost"
              aria-haspopup="dialog"
              className="w-full lg:w-80"
              onClick={() => setFiltersOpen(true)}
            >
              Sắp xếp: {sortLabel(filters.sort)}
            </Button>
          </div>

          {filterCount > 0 ? (
            <p className="text-sm text-muted">
              Đang lọc: <span className="font-semibold text-ink">{describeFilters(filters)}</span>
              <span aria-hidden="true"> · </span>
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))}
                className="font-semibold text-primary hover:underline"
              >
                Xóa bộ lọc
              </button>
            </p>
          ) : null}

          {visible.length > 0 ? (
            <ul aria-label={`Chuyến xe ${title}`} className="flex flex-col gap-6">
              {visible.map(({ trip, seatsLeft: left }, index) => (
                <li key={trip.id}>
                  <TripCard
                    trip={trip}
                    operatorName={getOperator(trip.operatorId)?.name ?? "Doanh nghiệp vận tải"}
                    destinationLabel={destination.label}
                    image={route!.image}
                    seatsLeft={left}
                    detailsHref={tripHref(trip.id, date)}
                    bookHref={seatsHref(trip.id, date)}
                    preload={index === 0}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Notice
              title="Không có chuyến phù hợp bộ lọc"
              action={
                <Button
                  variant="secondary"
                  className="w-full sm:w-60"
                  onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))}
                >
                  Xóa bộ lọc
                </Button>
              }
            >
              Thử bỏ bớt điều kiện giờ đi, loại xe hoặc tiện ích để xem thêm chuyến.
            </Notice>
          )}

          <FiltersDialog
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            items={items}
            value={filters}
            onApply={(next) => {
              setFilters(next);
              setFiltersOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}

function Notice({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 rounded-lg bg-white p-6">
      <h2 className="text-title font-semibold text-navy">{title}</h2>
      <p className="text-body text-muted">{children}</p>
      {action ? <div className="flex w-full flex-col gap-3 sm:flex-row">{action}</div> : null}
    </div>
  );
}
