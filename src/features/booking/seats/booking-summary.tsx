"use client";

import { Button } from "@/components/ui/button";
import { MAX_SEATS, type BookingPrice } from "@/stores/booking-store";
import { formatVnd } from "@/lib/format";

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Figma "Đặt chỗ" card (6:762 / 6:864 desktop, 6:2455 / 6:2551 mobile).
 * Empty: "Vui lòng chọn ghế còn trống" + unit prices, CTA disabled.
 * Selected: "Ghế A03 · 01 hành khách" + totals from priceBooking(), CTA enabled.
 */
export function BookingSummary({
  seats,
  price,
  unitListPrice,
  unitPrice,
  limitReached,
  onClear,
  onContinue,
}: {
  seats: string[];
  price: BookingPrice;
  unitListPrice: number;
  unitPrice: number;
  limitReached: boolean;
  onClear: () => void;
  onContinue: () => void;
}) {
  const count = seats.length;
  const listPrice = count ? price.listTotal : unitListPrice;
  const total = count ? price.subtotal : unitPrice;
  const discount = count ? price.tripDiscount : unitListPrice - unitPrice;

  return (
    <section
      aria-labelledby="booking-summary-title"
      className="flex flex-col gap-5 rounded-lg bg-white p-6 lg:sticky lg:top-6"
    >
      <h2 id="booking-summary-title" className="text-h3 font-bold text-navy">
        Thông tin đặt chỗ
      </h2>
      <div aria-live="polite" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-body text-muted">
            {count ? `Ghế ${seats.join(", ")} · ${pad2(count)} hành khách` : "Vui lòng chọn ghế còn trống"}
          </p>
          {count ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex min-h-6 items-center text-sm font-semibold text-primary hover:underline"
            >
              Bỏ chọn
            </button>
          ) : null}
        </div>
        <p className="text-sm text-muted">
          Giá niêm yết: {formatVnd(listPrice)}
          {count > 1 ? ` (${count} × ${formatVnd(unitListPrice)})` : null}
        </p>
        <p className="text-price font-semibold text-primary">{formatVnd(total)}</p>
        {discount > 0 ? (
          <p className="text-sm text-green">Đã giảm {formatVnd(discount)} theo ưu đãi chuyến.</p>
        ) : null}
        {limitReached ? (
          <p role="alert" className="text-sm font-medium text-danger">
            Mỗi lần đặt tối đa {MAX_SEATS} chỗ. Bỏ chọn một ghế nếu muốn đổi sang ghế khác.
          </p>
        ) : null}
      </div>
      <Button className="w-full" disabled={count === 0} onClick={onContinue}>
        Tiếp tục đặt vé
      </Button>
    </section>
  );
}
