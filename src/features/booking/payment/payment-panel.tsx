"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { useSupport } from "@/features/support/support-provider";
import { cn } from "@/lib/cn";
import { formatDay, formatVnd } from "@/lib/format";
import { bookingActions, useBookingDraft, useStoreReady } from "@/stores/booking-store";
import {
  BookingEmptyState,
  BookingLoading,
  describeBooking,
  seatLabel,
  useBookingGate,
  type ActiveBooking,
} from "../checkout/booking-gate";
import {
  formatCountdown,
  HOLD_SECONDS,
  reservationCode,
  startHold,
  useNowSeconds,
  usePaymentHold,
} from "./payment-hold";

/** Hero lead of Figma 14: "Mã đặt chỗ … · Ghế A03". */
export function PaymentHeroLine() {
  const ready = useStoreReady();
  const draft = useBookingDraft();
  const booking = describeBooking(draft);
  if (!ready) return <>&nbsp;</>;
  if (!booking) return <>Chưa có đơn đặt vé cần thanh toán.</>;
  return (
    <>
      Mã đặt chỗ {reservationCode(draft)} · {seatLabel(booking.seats)}
    </>
  );
}

/**
 * Figma 14 · Thanh toán QR (6:1089 / mobile 6:2761) and 14B · QR sau ưu đãi
 * (6:1153 / 6:2819): the amount reflects the voucher held in the store.
 * The QR is an illustration only — "Kiểm tra trạng thái" simulates a successful transfer.
 */
export function PaymentPanel() {
  const { status, draft, booking } = useBookingGate();
  return (
    <Section tone="white" labelledBy={status === "ready" ? "payment-title" : undefined}>
      {status === "loading" ? <BookingLoading /> : null}
      {status === "paid" ? <BookingLoading label="Thanh toán thành công. Đang mở vé điện tử…" /> : null}
      {status === "empty" ? <BookingEmptyState /> : null}
      {status === "ready" && booking ? <QrPayment booking={booking} code={reservationCode(draft)} /> : null}
    </Section>
  );
}

function QrPayment({ booking, code }: { booking: ActiveBooking; code: string }) {
  const { open: openSupport } = useSupport();
  const hold = usePaymentHold();
  const now = useNowSeconds();
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Start (or continue) the seat hold for this reservation.
  const holdMatches = hold?.code === code;
  useEffect(() => {
    if (!holdMatches) startHold(code);
  }, [holdMatches, code]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const remaining =
    holdMatches && hold && now !== null
      ? Math.max(0, HOLD_SECONDS - (now - Math.floor(hold.startedAt / 1000)))
      : HOLD_SECONDS;
  const expired = remaining === 0;
  const { price, route, trip } = booking;

  const checkStatus = () => {
    setChecking(true);
    setFailed(false);
    // Simulated bank callback; on success the gate redirects to the e-ticket.
    timer.current = window.setTimeout(() => {
      const ticket = bookingActions.completePayment(code);
      if (!ticket) {
        setChecking(false);
        setFailed(true);
      }
    }, 800);
  };

  return (
    <>
      <h2 id="payment-title" className="sr-only">
        Thanh toán bằng QR ngân hàng
      </h2>
      <span className="inline-flex w-fit items-center rounded-full bg-warning-soft p-2 text-xs font-medium text-warning">
        CHỜ THANH TOÁN
      </span>
      <p className="text-h1 font-bold text-primary">
        <span className="sr-only">Số tiền cần thanh toán: </span>
        {formatVnd(price.total)}
      </p>
      {expired ? (
        <p role="alert" className="text-body font-semibold text-danger">
          Đã hết thời gian giữ chỗ. Tạo mã QR mới để tiếp tục thanh toán.
        </p>
      ) : (
        <p role="timer" aria-atomic="true" className="text-body font-semibold text-warning">
          Thời gian giữ chỗ còn {formatCountdown(remaining)}
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <Image
          src="/images/qr-demo.svg"
          alt={expired ? "Mã QR minh họa đã hết hạn" : "Mã QR thanh toán minh họa"}
          width={180}
          height={180}
          loading="eager"
          className={cn("size-45 shrink-0 transition-opacity", expired && "opacity-20")}
        />
        {/* Transfer details for manual entry (demo account — nothing is charged). */}
        <dl className="flex w-full max-w-140 flex-col gap-3 rounded-lg bg-paper p-4 lg:p-6">
          <PaymentRow label="Đơn vị nhận" value="Bến xe Yên Sở · tài khoản minh họa" />
          <PaymentRow label="Nội dung chuyển khoản" value={code} />
          <PaymentRow
            label="Chuyến"
            value={`${route.name} · ${trip.departTime}, ${formatDay(booking.date)} · ${seatLabel(booking.seats)}`}
          />
        </dl>
      </div>

      <p className="text-xs font-medium text-muted uppercase">QR MINH HỌA · KHÔNG CHUYỂN TIỀN</p>
      <p className="text-body text-muted">
        Mở ứng dụng ngân hàng, quét QR và kiểm tra số tiền trước khi xác nhận. Không thanh toán lại nếu trạng thái đang
        được cập nhật.
      </p>

      <div className="flex flex-col gap-6">
        {expired ? (
          <Button className="w-full lg:w-85" onClick={() => startHold(code)}>
            Tạo mã QR mới
          </Button>
        ) : (
          <Button className="w-full lg:w-85" onClick={checkStatus} disabled={checking}>
            {checking ? "Đang kiểm tra…" : "Kiểm tra trạng thái"}
          </Button>
        )}
        <Button variant="secondary" className="w-full lg:w-85" onClick={() => openSupport("support")}>
          Tôi cần hỗ trợ
        </Button>
      </div>
      <p role="status" className={cn("text-sm", failed ? "text-danger" : "sr-only")}>
        {checking ? "Đang kiểm tra trạng thái thanh toán…" : null}
        {failed ? "Chưa ghi nhận được thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ." : null}
      </p>
    </>
  );
}

function PaymentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-muted uppercase">{label}</dt>
      <dd className="text-sm font-semibold wrap-break-word text-navy">{value}</dd>
    </div>
  );
}
