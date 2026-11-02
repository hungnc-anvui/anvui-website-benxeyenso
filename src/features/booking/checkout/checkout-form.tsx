"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, buttonClass } from "@/components/ui/button";
import { FieldError, TextField } from "@/components/ui/field";
import { formatVnd } from "@/lib/format";
import { paths } from "@/lib/routes";
import {
  bookingActions,
  isValidEmail,
  isValidVnPhone,
  type BookingDraft,
  type BookingPrice,
} from "@/stores/booking-store";
import type { Voucher } from "@/types/domain";
import { PaymentMethodDialog } from "../payment/method-dialog";
import { BookingEmptyState, BookingLoading, useBookingGate, type ActiveBooking } from "./booking-gate";
import { OrderSummary } from "./order-summary";
import { VoucherDialog } from "./voucher-dialog";

type FieldKey = "fullName" | "phone" | "email" | "voucher" | "terms";
type Errors = Partial<Record<FieldKey, string>>;

/** Focus order for "focus the first error". */
const FIELD_IDS: Record<FieldKey, string> = {
  fullName: "checkout-name",
  phone: "checkout-phone",
  email: "checkout-email",
  voucher: "checkout-voucher",
  terms: "checkout-terms",
};

function validate(draft: BookingDraft, price: BookingPrice): Errors {
  const errors: Errors = {};
  const { fullName, phone, email } = draft.passenger;
  if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên người liên hệ.";
  else if (fullName.trim().length < 2) errors.fullName = "Họ và tên quá ngắn, vui lòng kiểm tra lại.";
  if (!phone.trim()) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!isValidVnPhone(phone))
    errors.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.";
  if (email.trim() && !isValidEmail(email)) errors.email = "Email chưa đúng định dạng, ví dụ: ten@email.com.";
  if (draft.voucherCode && price.voucherError) errors.voucher = price.voucherError;
  if (!draft.acceptedTerms) errors.terms = "Vui lòng đồng ý với điều kiện vé và chính sách bảo mật.";
  return errors;
}

/**
 * Figma 13 · Thông tin & thanh toán (6:904 / mobile 6:2588) and 13B · Đã áp dụng
 * voucher (6:996 / 6:2674) — same route, the voucher state comes from the store.
 */
export function CheckoutForm() {
  const { status, draft, booking } = useBookingGate();
  if (status === "loading") return <BookingLoading />;
  if (status === "paid") return <BookingLoading label="Đang mở vé điện tử…" />;
  if (status === "empty" || !booking) return <BookingEmptyState />;
  return <CheckoutFields draft={draft} booking={booking} />;
}

function CheckoutFields({ draft, booking }: { draft: BookingDraft; booking: ActiveBooking }) {
  const router = useRouter();
  const { trip, price } = booking;
  // Fields that failed on the last submit: they re-validate live (and clear once fixed);
  // new problems in other fields wait for the next submit instead of appearing mid-typing.
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherInputError, setVoucherInputError] = useState<string | null>(null);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const liveErrors = errorKeys.length ? validate(draft, price) : {};
  const errors = Object.fromEntries(
    Object.entries(liveErrors).filter(([key]) => errorKeys.includes(key)),
  ) as typeof liveErrors;
  const hasErrors = Object.keys(errors).length > 0;
  const appliedVoucher = draft.voucherCode;

  const onApplied = (voucher: Voucher) => {
    setVoucherOpen(false);
    setVoucherInput("");
    setVoucherInputError(null);
    setAnnouncement(`Đã áp dụng mã ${voucher.code}, giảm ${formatVnd(voucher.discount)}.`);
  };

  const applyTypedVoucher = () => {
    const code = voucherInput.trim();
    if (!code) {
      setVoucherInputError("Vui lòng nhập mã ưu đãi hoặc chọn mã có sẵn.");
      return;
    }
    const result = bookingActions.applyVoucher(code);
    if (result.ok) onApplied(result.voucher);
    else setVoucherInputError(result.error);
  };

  const removeVoucher = () => {
    bookingActions.removeVoucher();
    setAnnouncement("Đã bỏ mã ưu đãi.");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(draft, price);
    setErrorKeys(Object.keys(next));
    const first = (Object.keys(FIELD_IDS) as FieldKey[]).find((key) => next[key]);
    if (first) {
      document.getElementById(FIELD_IDS[first])?.focus();
      return;
    }
    const { fullName, phone, email } = draft.passenger;
    bookingActions.setPassenger({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });
    bookingActions.setPaymentMethod("qr");
    router.push(paths.booking.payment);
  };

  const voucherError = errors.voucher ?? (appliedVoucher ? null : voucherInputError) ?? undefined;

  return (
    <>
      <form
        noValidate
        onSubmit={onSubmit}
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,768fr)_minmax(0,408fr)]"
      >
        <div className="flex min-w-0 flex-col gap-5 rounded-lg bg-white p-6">
          <h2 className="text-h3 font-bold text-navy">Người liên hệ</h2>
          <TextField
            id={FIELD_IDS.fullName}
            label="Họ và tên"
            value={draft.passenger.fullName}
            onChange={(event) => bookingActions.setPassenger({ fullName: event.target.value })}
            placeholder="Nhập họ và tên người đi"
            name="name"
            autoComplete="name"
            required
            error={errors.fullName}
          />
          <TextField
            id={FIELD_IDS.phone}
            label="Số điện thoại"
            type="tel"
            inputMode="tel"
            value={draft.passenger.phone}
            onChange={(event) => bookingActions.setPassenger({ phone: event.target.value })}
            placeholder="Nhập số điện thoại nhận vé"
            name="tel"
            autoComplete="tel"
            required
            error={errors.phone}
          />
          <TextField
            id={FIELD_IDS.email}
            label="Email nhận vé"
            type="email"
            inputMode="email"
            value={draft.passenger.email}
            onChange={(event) => bookingActions.setPassenger({ email: event.target.value })}
            placeholder="Nhập email (không bắt buộc)"
            name="email"
            autoComplete="email"
            spellCheck={false}
            autoCapitalize="none"
            error={errors.email}
          />
          <dl className="flex flex-col gap-5">
            <InfoField label="Điểm đón" value={`${trip.pickupPoint} · Có mặt ${trip.checkInTime}`} />
            <InfoField label="Điểm trả" value={`${trip.dropoffPoint} · Xác nhận theo chuyến`} />
          </dl>

          <h3 className="text-title font-semibold text-navy">Mã ưu đãi</h3>
          <TextField
            id={FIELD_IDS.voucher}
            label="Voucher"
            value={appliedVoucher ?? voucherInput}
            readOnly={Boolean(appliedVoucher)}
            onChange={(event) => {
              setVoucherInput(event.target.value.toUpperCase());
              setVoucherInputError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !appliedVoucher) {
                event.preventDefault();
                applyTypedVoucher();
              }
            }}
            placeholder="Nhập hoặc chọn mã ưu đãi"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="done"
            error={voucherError}
          />
          {appliedVoucher ? (
            <Button variant="secondary" className="w-full" onClick={removeVoucher}>
              Bỏ mã ưu đãi
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" aria-haspopup="dialog" onClick={() => setVoucherOpen(true)}>
              Chọn mã ưu đãi
            </Button>
          )}
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>

          <h3 id="checkout-method-title" className="text-title font-semibold text-navy">
            Chọn cổng thanh toán
          </h3>
          <div role="group" aria-labelledby="checkout-method-title" className="flex flex-col gap-5">
            <button
              type="button"
              aria-pressed={draft.paymentMethod === "qr"}
              onClick={() => bookingActions.setPaymentMethod("qr")}
              className={buttonClass("secondary", "w-full")}
            >
              <span aria-hidden="true" className="size-3 rounded-full bg-navy" />
              QR ngân hàng
            </button>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setMethodOpen(true)}
              className={buttonClass("ghost", "w-full")}
            >
              <span aria-hidden="true" className="size-3 rounded-full border border-navy" />
              Thẻ / ví điện tử
            </button>
          </div>

          <div>
            <label htmlFor={FIELD_IDS.terms} className="flex cursor-pointer items-start gap-2 text-sm text-muted">
              <input
                id={FIELD_IDS.terms}
                type="checkbox"
                checked={draft.acceptedTerms}
                onChange={(event) => bookingActions.setAcceptedTerms(event.target.checked)}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? `${FIELD_IDS.terms}-error` : undefined}
                className="mt-0.75 size-4 shrink-0 accent-primary"
              />
              Đồng ý với điều kiện vé và chính sách bảo mật.
            </label>
            <FieldError id={`${FIELD_IDS.terms}-error`}>{errors.terms}</FieldError>
          </div>
          <Link href={paths.policy} className="w-fit text-sm font-semibold text-primary hover:underline">
            Xem điều kiện vé <span aria-hidden="true">→</span>
          </Link>
        </div>

        <OrderSummary booking={booking} price={price} voucherCode={appliedVoucher}>
          <Button type="submit" className="w-full">
            Thanh toán
          </Button>
          {hasErrors ? (
            <p className="text-xs font-medium text-danger">Vui lòng kiểm tra lại các thông tin được đánh dấu.</p>
          ) : null}
        </OrderSummary>
      </form>

      {/* Dialogs live outside the <form>: the voucher dialog has its own form. */}
      <VoucherDialog
        open={voucherOpen}
        onClose={() => setVoucherOpen(false)}
        initialCode={voucherInput}
        onApplied={onApplied}
      />
      <PaymentMethodDialog
        open={methodOpen}
        onClose={() => {
          bookingActions.setPaymentMethod("qr");
          setMethodOpen(false);
        }}
      />
    </>
  );
}

/** Read-only value styled like a Figma field (ĐIỂM ĐÓN / ĐIỂM TRẢ come from the trip). */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-19.5 w-full flex-col justify-center gap-1 rounded-sm border border-line bg-white px-4 py-3.5">
      <dt className="text-xs font-medium uppercase text-muted">{label}</dt>
      <dd className="text-body font-semibold text-navy">{value}</dd>
    </div>
  );
}
