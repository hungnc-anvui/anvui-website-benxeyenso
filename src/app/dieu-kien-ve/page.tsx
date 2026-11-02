import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/section";
import { getPolicySections } from "@/data/repositories/station";
import { InfoCard } from "@/features/about/info-card";

export const metadata: Metadata = {
  title: "Điều kiện vé & bảo mật",
  description: "Quyền lợi, điều kiện sử dụng và bảo vệ thông tin.",
};

/**
 * Figma 15 · Điều kiện vé & bảo mật — desktop 6:433, mobile 6:2149.
 * Each card is addressable (#xac-nhan-dat-cho, #doi-huy-hanh-ly, #thong-tin-ca-nhan)
 * so booking screens can link straight to the relevant condition.
 */
export default function PolicyPage() {
  const sections = getPolicySections();
  return (
    <>
      <PageHero
        crumb="Chính sách"
        title="Biết rõ trước khi đặt vé."
        description="Quyền lợi, điều kiện sử dụng và bảo vệ thông tin."
      />
      <Section tone="paper" labelledBy="policy-title">
        <h2 id="policy-title" className="sr-only">
          Nội dung chính sách
        </h2>
        <ul className="flex flex-col gap-6">
          {sections.map((item) => (
            <li key={item.id}>
              <InfoCard item={item} anchor />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
