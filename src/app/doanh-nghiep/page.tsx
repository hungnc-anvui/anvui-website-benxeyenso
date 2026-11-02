import type { Metadata } from "next";
import { OperatorCard } from "@/components/common/operator-card";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { getOperators } from "@/data/repositories/transport";
import {
  OperatorEmptyState,
  OperatorGrid,
  OperatorGridItem,
  OperatorSearchField,
  OperatorSearchProvider,
  ShowAllOperatorsButton,
} from "@/features/operators/operator-search";

export const metadata: Metadata = {
  title: "Doanh nghiệp vận tải",
  description: "Tìm doanh nghiệp vận tải tại Bến xe Yên Sở, xem tuyến khai thác và thông tin phục vụ.",
};

/** Figma 04 · Danh sách doanh nghiệp — desktop 5:288, mobile 6:1707. */
export default function OperatorsPage() {
  const operators = getOperators();
  return (
    <>
      <PageHero
        crumb="Doanh nghiệp vận tải"
        title="Đồng hành cùng nhà vận tải."
        description="Tìm doanh nghiệp, xem tuyến khai thác và thông tin phục vụ."
      />
      <OperatorSearchProvider>
        <Section tone="paper" labelledBy="operator-search-title">
          <h2 id="operator-search-title" className="sr-only">
            Tra cứu doanh nghiệp
          </h2>
          <OperatorSearchField />
        </Section>
        <Section tone="white" labelledBy="operators-title">
          <SectionHeading
            id="operators-title"
            eyebrow="KẾT NỐI NHÀ VẬN TẢI"
            title="Chọn đúng nhà xe. Đi thật an tâm."
            description="Tra cứu tuyến khai thác, tiện ích và điều kiện vé của từng doanh nghiệp."
          />
          <OperatorGrid>
            {operators.map((operator, index) => (
              <OperatorGridItem key={operator.id} operatorId={operator.id} index={index}>
                <OperatorCard operator={operator} />
              </OperatorGridItem>
            ))}
          </OperatorGrid>
          <OperatorEmptyState />
          <p className="text-xs font-medium text-muted">Tên và tuyến doanh nghiệp đang dùng dữ liệu minh họa.</p>
          <ShowAllOperatorsButton />
        </Section>
      </OperatorSearchProvider>
    </>
  );
}
