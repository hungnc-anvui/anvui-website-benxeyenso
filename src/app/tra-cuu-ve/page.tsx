import type { Metadata } from "next";
import { PageHero } from "@/components/ui/section";
import { TicketLookup } from "@/features/lookup/ticket-lookup";

export const metadata: Metadata = {
  title: "Tra cứu vé",
  description: "Nhập mã vé và số điện thoại đã đặt để tra cứu vé điện tử.",
};

/** Figma 16 · Tra cứu vé (6:1281 / 6:2935) + state "otp" (6:3234 / 6:3563). */
export default function LookupPage() {
  return (
    <>
      <PageHero
        crumb="Tra cứu vé"
        title="Thông tin chuyến đi trong tầm tay."
        description="Nhập mã vé và số điện thoại đã đặt để tra cứu."
      />
      <TicketLookup />
    </>
  );
}
