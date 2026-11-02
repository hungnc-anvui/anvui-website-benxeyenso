"use client";

import { useBookingDraft, useStoreReady } from "@/stores/booking-store";
import { bookingLine, describeBooking } from "./booking-gate";

/** Hero lead of Figma 13: "Ghế A03 · Doanh nghiệp vận tải 01 · 08:00, 16/10/2026". */
export function CheckoutHeroLine() {
  const ready = useStoreReady();
  const booking = describeBooking(useBookingDraft());
  // Keep the line height while the client store loads (no layout shift).
  if (!ready) return <>&nbsp;</>;
  if (!booking) return <>Chọn chuyến và ghế trước khi nhập thông tin thanh toán.</>;
  return <>{bookingLine(booking)}</>;
}
