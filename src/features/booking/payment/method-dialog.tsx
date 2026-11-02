"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

/** Figma "Trạng thái · method" (6:3281 desktop / 6:3610 mobile). The demo only supports bank QR. */
export function PaymentMethodDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Phương thức thanh toán"
      description="Thanh toán bằng QR ngân hàng. Kiểm tra số tiền và thông tin đơn trước khi xác nhận."
    >
      <p className="text-sm text-muted">
        Thẻ / ví điện tử chưa được hỗ trợ trong bản demo, đơn của bạn sẽ được thanh toán bằng QR ngân hàng.
      </p>
      <Button className="w-full" onClick={onClose}>
        Quay lại đơn đặt vé
      </Button>
    </Dialog>
  );
}
