import type { Metadata } from "next";
import { PageHero } from "@/components/ui/section";
import { PaymentHeroLine, PaymentPanel } from "@/features/booking/payment/payment-panel";

export const metadata: Metadata = {
  title: "Thanh toán QR",
  description: "Quét mã QR ngân hàng để hoàn tất đặt vé. QR trong bản demo chỉ để minh họa.",
};

/** Figma 14 · Thanh toán QR (6:1089 / 6:2761) + 14B · QR sau ưu đãi (6:1153 / 6:2819). */
export default function PaymentPage() {
  return (
    <>
      <PageHero crumb="Thanh toán" title="Quét mã, hoàn tất đặt vé." description={<PaymentHeroLine />} />
      <PaymentPanel />
    </>
  );
}
