"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getOperator, getRoute, getTrip } from "@/data/repositories/transport";
import { formatDay } from "@/lib/format";
import { paths } from "@/lib/routes";
import { priceBooking, useBookingDraft, useStoreReady, type BookingDraft } from "@/stores/booking-store";

/** Everything the checkout / QR screens need about the trip being booked. */
export function describeBooking(draft: BookingDraft) {
  const trip = draft.tripId ? getTrip(draft.tripId) : undefined;
  if (!trip || !draft.date || draft.seats.length === 0) return null;
  const route = getRoute(trip.routeId);
  const operator = getOperator(trip.operatorId);
  if (!route || !operator) return null;
  return { trip, route, operator, date: draft.date, seats: draft.seats, price: priceBooking(draft) };
}

export type ActiveBooking = NonNullable<ReturnType<typeof describeBooking>>;

/** "Ghế A03" / "Ghế A03, A04" */
export function seatLabel(seats: string[]) {
  return `Ghế ${seats.join(", ")}`;
}

/** "Ghế A03 · Doanh nghiệp vận tải 01 · 08:00, 16/10/2026" (Figma 13 hero). */
export function bookingLine(booking: ActiveBooking) {
  return `${seatLabel(booking.seats)} · ${booking.operator.name} · ${booking.trip.departTime}, ${formatDay(booking.date)}`;
}

type GateStatus = "loading" | "empty" | "paid" | "ready";

/**
 * Shared guard for checkout + QR: waits for the client store (no flash of the
 * empty state), sends paid bookings to the e-ticket, and exposes the booking.
 */
export function useBookingGate() {
  const ready = useStoreReady();
  const draft = useBookingDraft();
  const router = useRouter();
  const booking = describeBooking(draft);
  const paid = Boolean(draft.ticketCode);

  useEffect(() => {
    if (ready && paid) router.replace(paths.booking.ticket);
  }, [ready, paid, router]);

  const status: GateStatus = !ready ? "loading" : paid ? "paid" : booking ? "ready" : "empty";
  return { status, draft, booking };
}

export function BookingLoading({ label = "Đang tải thông tin đặt vé…" }: { label?: string }) {
  return (
    <div aria-busy="true" className="min-h-120 rounded-lg bg-white/70">
      <p className="sr-only" role="status">
        {label}
      </p>
    </div>
  );
}

export function BookingEmptyState() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg bg-white p-6">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-sky text-primary">
        <Icon name="ticket" />
      </span>
      <h2 className="text-h3 font-bold text-navy">Chưa có chuyến xe nào được chọn</h2>
      <p className="text-body text-muted">
        Hãy tìm chuyến và chọn ghế trước khi thanh toán. Thông tin đặt chỗ chỉ được lưu tạm trên trình duyệt này.
      </p>
      <ButtonLink href={paths.booking.search} className="w-full lg:w-85">
        Tìm chuyến xe
      </ButtonLink>
    </div>
  );
}
