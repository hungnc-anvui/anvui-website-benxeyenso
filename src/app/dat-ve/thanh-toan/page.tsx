import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/section";
import { CheckoutForm } from "@/features/booking/checkout/checkout-form";
import { CheckoutHeroLine } from "@/features/booking/checkout/checkout-hero-line";

export const metadata: Metadata = {
  title: "Thông tin & thanh toán",
  description: "Nhập thông tin người liên hệ, áp dụng mã ưu đãi và chọn cổng thanh toán.",
};

/** Figma 13 · Thông tin & thanh toán (6:904 / 6:2588) + 13B · Đã áp dụng voucher (6:996 / 6:2674). */
export default function CheckoutPage() {
  return (
    <>
      <PageHero crumb="Thanh toán" title="Một bước nữa để sẵn sàng lên xe." description={<CheckoutHeroLine />} />
      <Section tone="paper">
        <CheckoutForm />
      </Section>
    </>
  );
}
