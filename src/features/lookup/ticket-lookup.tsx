"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import { TicketCard } from "@/features/booking/ticket/ticket-card";
import { useSupport } from "@/features/support/support-provider";
import { maskPhone } from "@/lib/format";
import { findTicket, isValidVnPhone, useTickets } from "@/stores/booking-store";
import { scrollBehavior } from "@/lib/motion";

type Errors = Partial<Record<"code" | "phone", string>>;
type OtpRequest = { demoCode: string; ticketCode: string; phone: string };

const normalizeCode = (value: string) => value.replace(/\s/g, "").toUpperCase();

function validate(code: string, phone: string): Errors {
  const errors: Errors = {};
  const normalized = normalizeCode(code);
  if (!normalized) errors.code = "Vui lòng nhập mã vé.";
  else if (!/^YS\d{9}$/.test(normalized)) errors.code = "Mã vé gồm chữ YS và 9 chữ số, ví dụ: YS123456789.";
  if (!phone.trim()) errors.phone = "Vui lòng nhập số điện thoại đã dùng khi đặt vé.";
  else if (!isValidVnPhone(phone)) errors.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.";
  return errors;
}

/**
 * Figma 16 · Tra cứu vé (6:1281 / mobile 6:2935) + state "otp" (6:3234 / 6:3563).
 * Ticket code + booking phone → verification code (demo: shown on screen) → ticket.
 */
export function TicketLookup() {
  const tickets = useTickets();
  const { open: openSupport } = useSupport();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  // Only fields that failed on the last submit re-validate live (no errors appearing mid-typing).
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [otp, setOtp] = useState<OtpRequest | null>(null);
  const [foundCode, setFoundCode] = useState<string | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const liveErrors = errorKeys.length ? validate(code, phone) : {};
  const errors = Object.fromEntries(
    Object.entries(liveErrors).filter(([key]) => errorKeys.includes(key)),
  ) as typeof liveErrors;
  const found = foundCode ? tickets.find((t) => t.code === foundCode) : undefined;

  useEffect(() => {
    if (!foundCode) return;
    resultRef.current?.focus({ preventScroll: true });
    resultRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }, [foundCode]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(code, phone);
    setErrorKeys(Object.keys(next).filter((key) => next[key as keyof typeof next]));
    if (next.code || next.phone) {
      document.getElementById(next.code ? "lookup-code" : "lookup-phone")?.focus();
      return;
    }
    setFoundCode(null);
    const ticket = findTicket(normalizeCode(code), phone);
    if (!ticket) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    // Demo verification code; a real system would send it by SMS to the booking phone.
    const demoCode = String(Math.floor(100000 + Math.random() * 900000));
    setOtp({ demoCode, ticketCode: ticket.code, phone: ticket.passenger.phone });
  };

  return (
    <>
      <Section tone="white" labelledBy="lookup-form-title">
        <h2 id="lookup-form-title" className="sr-only">
          Tra cứu bằng mã vé
        </h2>
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6 lg:max-w-200">
          <TextField
            id="lookup-code"
            label="Mã vé"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setNotFound(false);
            }}
            placeholder="Ví dụ: YS123456789"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            required
            error={errors.code}
          />
          <TextField
            id="lookup-phone"
            label="Số điện thoại"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setNotFound(false);
            }}
            placeholder="Số điện thoại đã dùng khi đặt vé"
            autoComplete="tel"
            required
            error={errors.phone}
          />
          <Button type="submit" className="w-full lg:w-85">
            Tra cứu vé
          </Button>
        </form>
        {notFound ? (
          <div role="alert" className="flex flex-col gap-2 rounded-lg border border-danger bg-white p-4 lg:max-w-200">
            <p className="text-body font-semibold text-danger">Không tìm thấy vé với mã và số điện thoại này.</p>
            <p className="text-sm text-muted">
              Kiểm tra lại mã vé (YS và 9 chữ số) và số điện thoại đã dùng khi đặt. Vé đặt trong bản demo chỉ được lưu
              trên trình duyệt này.
            </p>
            <button
              type="button"
              onClick={() => openSupport("support")}
              className="w-fit text-sm font-semibold text-primary hover:underline"
            >
              Liên hệ hỗ trợ <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </Section>

      {found ? (
        <Section tone="paper" labelledBy="lookup-ticket-title">
          <div className="rounded-lg bg-white p-4 lg:p-6">
            <TicketCard ticket={found} titleId="lookup-ticket-title" titleRef={resultRef} />
          </div>
        </Section>
      ) : null}

      <Dialog
        open={otp !== null}
        onClose={() => setOtp(null)}
        title="Xác thực để xem vé"
        description="Nhập mã được gửi đến số điện thoại của người đặt."
      >
        {otp ? (
          <OtpForm
            key={otp.demoCode}
            request={otp}
            onVerified={() => {
              setFoundCode(otp.ticketCode);
              setOtp(null);
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}

function OtpForm({ request, onVerified }: { request: OtpRequest; onVerified: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = value.replace(/\D/g, "");
    let message: string | null = null;
    if (!digits) message = "Vui lòng nhập mã xác thực.";
    else if (digits.length !== 6) message = "Mã xác thực gồm 6 chữ số.";
    else if (digits !== request.demoCode) message = "Mã xác thực chưa đúng, vui lòng kiểm tra lại.";
    setError(message);
    if (message) {
      document.getElementById("lookup-otp")?.focus();
      return;
    }
    onVerified();
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextField
        id="lookup-otp"
        label="Mã xác thực"
        value={value}
        onChange={(event) => {
          setValue(event.target.value.replace(/[^\d\s]/g, ""));
          setError(null);
        }}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={11}
        placeholder="Nhập 6 chữ số"
        className={value ? "tracking-[0.2em]" : undefined}
        error={error ?? undefined}
      />
      <p className="rounded-sm bg-sky p-3 text-sm text-navy">
        Bản demo không gửi SMS đến {maskPhone(request.phone)}. Mã xác thực của bạn:{" "}
        <strong className="font-semibold tracking-[0.2em]">{request.demoCode}</strong>
      </p>
      <Button type="submit" className="w-full">
        Xác nhận & xem vé
      </Button>
    </form>
  );
}
