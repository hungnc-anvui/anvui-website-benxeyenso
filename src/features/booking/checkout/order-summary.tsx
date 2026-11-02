import type { ReactNode } from "react";
import { formatDay, formatLunar, formatVnd } from "@/lib/format";
import type { BookingPrice } from "@/stores/booking-store";
import { seatLabel, type ActiveBooking } from "./booking-gate";

/** Figma "Tổng thanh toán" card (6:954 / 13B 6:1046): route, date + âm lịch, price breakdown, total. */
export function OrderSummary({
  booking,
  price,
  voucherCode,
  children,
}: {
  booking: ActiveBooking;
  price: BookingPrice;
  voucherCode: string | null;
  children?: ReactNode;
}) {
  const seats = price.seatCount > 1 ? ` (${price.seatCount} ghế)` : "";
  return (
    <aside
      aria-labelledby="checkout-summary-title"
      className="flex flex-col gap-5 rounded-lg bg-white p-6 lg:sticky lg:top-6"
    >
      <h2 id="checkout-summary-title" className="text-title font-semibold text-navy">
        {booking.route.name}
      </h2>
      <p className="text-body text-muted">
        {formatDay(booking.date)} · Âm lịch {formatLunar(booking.date)}
        <br />
        {booking.trip.departTime} · {seatLabel(booking.seats)}
      </p>
      <hr className="border-line" />
      <dl className="flex flex-col gap-5 text-sm text-muted">
        <SummaryRow label={`Giá niêm yết${seats}`} value={formatVnd(price.listTotal)} />
        {price.tripDiscount > 0 ? (
          <SummaryRow label="Ưu đãi chuyến" value={`−${formatVnd(price.tripDiscount)}`} />
        ) : null}
        {voucherCode && price.voucherDiscount > 0 ? (
          <SummaryRow label={`Voucher ${voucherCode}`} value={`−${formatVnd(price.voucherDiscount)}`} />
        ) : null}
      </dl>
      <div className="flex flex-col gap-5" aria-live="polite">
        <p className="text-price font-semibold text-primary">{formatVnd(price.total)}</p>
        <p className="text-sm text-muted">Tổng cần thanh toán</p>
      </div>
      {children}
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
