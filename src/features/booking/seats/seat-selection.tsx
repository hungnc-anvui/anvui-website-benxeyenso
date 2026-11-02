"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { getSeatDecks } from "@/data/repositories/transport";
import {
  bookedSeatsFor,
  bookingActions,
  priceBooking,
  useBookingDraft,
  useStoreReady,
  useTickets,
} from "@/stores/booking-store";
import { formatDay, formatLunar } from "@/lib/format";
import { paths, searchHref } from "@/lib/routes";
import type { Trip } from "@/types/domain";
import { BookingSummary } from "./booking-summary";
import { seatsHref } from "./href";
import { SeatMap } from "./seat-map";
import { useSeatTarget } from "./use-seat-target";

/**
 * Figma 12 · Chọn chỗ / 12B · Đã chọn ghế A03 (6:701 / 6:802 desktop, 6:2397 / 6:2492 mobile)
 * and the "Trạng thái · seatPreview" dialog (6:3274 / 6:3603). Reads `?trip=&date=`,
 * so it must render inside <Suspense>.
 */
export function SeatSelection() {
  const target = useSeatTarget();
  const storeReady = useStoreReady();

  if (target.status === "invalid") {
    return (
      <Notice
        title="Chưa xác định chuyến xe"
        action={
          <ButtonLink href={searchHref()} className="w-full sm:w-60">
            Tìm chuyến xe
          </ButtonLink>
        }
      >
        Đường dẫn chọn chỗ thiếu thông tin chuyến hoặc chuyến không còn mở bán. Vui lòng tìm và chọn lại chuyến xe.
      </Notice>
    );
  }
  if (target.status === "loading" || !storeReady) return <SeatSelectionSkeleton />;
  if (target.status === "past") {
    return (
      <Notice
        title="Chuyến xe đã khởi hành"
        action={
          <>
            <ButtonLink href={seatsHref(target.trip.id, target.today)} className="w-full sm:w-72">
              Chọn chỗ chuyến hôm nay
            </ButtonLink>
            <ButtonLink
              href={searchHref({ to: target.destination.id, date: target.today })}
              variant="secondary"
              className="w-full sm:w-60"
            >
              Chọn ngày khác
            </ButtonLink>
          </>
        }
      >
        Chuyến {target.trip.departTime} ngày {formatDay(target.date)} đã qua. Vui lòng chọn ngày đi khác để đặt chỗ.
      </Notice>
    );
  }
  return <SeatBooking key={`${target.trip.id}|${target.date}`} trip={target.trip} date={target.date} />;
}

function SeatBooking({ trip, date }: { trip: Trip; date: string }) {
  const router = useRouter();
  const draft = useBookingDraft();
  const tickets = useTickets();
  const mapRef = useRef<HTMLElement>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [heldSeat, setHeldSeat] = useState<string | null>(null);

  // Point the booking draft at this trip + day (keeps the seats when it already is).
  useEffect(() => {
    bookingActions.startBooking(trip.id, date);
  }, [trip.id, date]);

  const active = draft.tripId === trip.id && draft.date === date && !draft.ticketCode;
  const seats = active ? draft.seats : [];
  const sold = new Set([...trip.soldSeats, ...bookedSeatsFor(tickets, trip.id, date)]);
  // The voucher belongs to checkout; this step shows the trip discount only (Figma 12B).
  const price = priceBooking({ tripId: trip.id, seats, voucherCode: null });

  const onSeat = (code: string) => {
    if (sold.has(code)) {
      setHeldSeat(code);
      return;
    }
    setLimitReached(!bookingActions.toggleSeat(code));
  };

  const chooseAgain = () => {
    setHeldSeat(null);
    // After the dialog hands focus back, move it to the first free seat of the visible deck.
    requestAnimationFrame(() => {
      mapRef.current?.querySelector<HTMLButtonElement>('[data-state="available"]')?.focus();
    });
  };

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-[568fr_600fr]">
        <SeatMap
          ref={mapRef}
          vehicleType={trip.vehicleType}
          decks={getSeatDecks()}
          selected={seats}
          sold={sold}
          onSeat={onSeat}
        />
        <BookingSummary
          seats={seats}
          price={price}
          unitListPrice={trip.listPrice}
          unitPrice={trip.price}
          limitReached={limitReached}
          onClear={() => {
            bookingActions.clearSeats();
            setLimitReached(false);
            // "Bỏ chọn" unmounts itself; keep keyboard users on the seat map.
            requestAnimationFrame(() => {
              mapRef.current?.querySelector<HTMLButtonElement>('[data-state="available"]')?.focus();
            });
          }}
          onContinue={() => router.push(paths.booking.checkout)}
        />
      </div>
      <Dialog
        open={heldSeat !== null}
        onClose={() => setHeldSeat(null)}
        title="Chỗ vừa có người giữ"
        description="Vui lòng chọn vị trí còn trống để tiếp tục."
      >
        <Button className="w-full" onClick={chooseAgain}>
          Chọn lại chỗ
        </Button>
      </Dialog>
    </>
  );
}

/** Hero line: "Yên Sở → Thanh Hóa · 08:00, 16/10/2026 · ÂL 07/09". Inside <Suspense>. */
export function SeatTripSummary() {
  const target = useSeatTarget();
  if (target.status === "invalid") return <>Chưa chọn chuyến xe · Vui lòng chọn chuyến trên trang kết quả tìm chuyến.</>;
  const base = `${target.route.name} · ${target.trip.departTime}`;
  if (target.status === "loading") return <>{base}</>;
  return <>{`${base}, ${formatDay(target.date)} · ÂL ${formatLunar(target.date)}`}</>;
}

export function SeatSelectionSkeleton() {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[568fr_600fr]">
      <p role="status" className="sr-only">
        Đang tải sơ đồ ghế…
      </p>
      <div aria-hidden="true" className="h-[662px] animate-pulse rounded-lg bg-white" />
      <div aria-hidden="true" className="h-[342px] animate-pulse rounded-lg bg-white" />
    </div>
  );
}

function Notice({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 rounded-lg bg-white p-6">
      <h2 className="text-title font-semibold text-navy">{title}</h2>
      <p className="text-body text-muted">{children}</p>
      <div className="flex w-full flex-col gap-3 sm:flex-row">{action}</div>
    </div>
  );
}
