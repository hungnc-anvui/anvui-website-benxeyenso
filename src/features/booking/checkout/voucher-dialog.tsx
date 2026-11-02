"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { checkVoucher, getVouchers } from "@/data/repositories/transport";
import { formatDay, formatVnd } from "@/lib/format";
import { bookingActions, priceBooking, useBookingDraft } from "@/stores/booking-store";
import type { Voucher } from "@/types/domain";

type VoucherDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Code typed in the checkout field, if any (pre-fills the dialog input). */
  initialCode: string;
  onApplied: (voucher: Voucher) => void;
};

/** Figma "Trạng thái · voucher" (6:3151 desktop / 6:3480 mobile). */
export function VoucherDialog({ open, onClose, initialCode, onApplied }: VoucherDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Ưu đãi cho hành trình">
      {/* Mounted only while open, so the input resets every time the dialog opens. */}
      {open ? <VoucherPicker initialCode={initialCode} onApplied={onApplied} /> : null}
    </Dialog>
  );
}

function VoucherPicker({ initialCode, onApplied }: Pick<VoucherDialogProps, "initialCode" | "onApplied">) {
  const draft = useBookingDraft();
  const vouchers = getVouchers();
  const [code, setCode] = useState(initialCode.trim() || vouchers[0]?.code || "");
  const [error, setError] = useState<string | null>(null);

  const subtotal = priceBooking({ ...draft, voucherCode: null }).subtotal;
  const preview = code.trim() ? checkVoucher(code, subtotal) : null;
  const label = preview?.ok
    ? `Áp dụng · còn ${formatVnd(subtotal - Math.min(preview.voucher.discount, subtotal))}`
    : "Áp dụng";

  const apply = () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã ưu đãi.");
      document.getElementById("voucher-dialog-code")?.focus();
      return;
    }
    const result = bookingActions.applyVoucher(code);
    if (result.ok) onApplied(result.voucher);
    else {
      setError(result.error);
      document.getElementById("voucher-dialog-code")?.focus();
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
      className="flex flex-col gap-4"
    >
      <ul className="flex flex-col gap-4" aria-label="Mã ưu đãi đang có">
        {vouchers.map((voucher) => (
          <li key={voucher.code} className="flex flex-col gap-4">
            <Tag>VOUCHER MINH HỌA</Tag>
            <p className="text-h3 font-bold text-navy">{voucher.title}</p>
            <p className="text-title font-semibold text-primary">{voucher.code}</p>
            <p className="text-body text-muted">
              {voucher.description} Hạn minh họa: {formatDay(voucher.expiresAt)}.
            </p>
          </li>
        ))}
      </ul>
      <TextField
        id="voucher-dialog-code"
        label="Nhập mã voucher"
        value={code}
        onChange={(event) => {
          setCode(event.target.value.toUpperCase());
          setError(null);
        }}
        placeholder="Ví dụ: YENSO20"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        error={error ?? undefined}
      />
      <Button type="submit" className="w-full">
        {label}
      </Button>
    </form>
  );
}
