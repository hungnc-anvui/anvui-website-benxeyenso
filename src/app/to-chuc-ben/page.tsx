import type { Metadata } from "next";
import Image from "next/image";
import { BookingStepsSection } from "@/components/common/booking-steps";
import { buttonClass } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { images } from "@/data/mock/images";
import { getServiceDepartments, getStationAreas } from "@/data/repositories/station";
import { InfoCard } from "@/features/about/info-card";
import { SupportButton } from "@/features/support/support-provider";

export const metadata: Metadata = {
  title: "Tổ chức bến",
  description: "Hướng dẫn hành khách, bộ phận phục vụ và quy trình tại bến.",
};

/** Figma 09 · Tổ chức bến — desktop 6:328, mobile 6:2050. */
export default function OrganizationPage() {
  return (
    <>
      <PageHero
        crumb="Tổ chức bến"
        title={"Dễ tìm khu vực.\nThuận tiện lên xe."}
        description="Hướng dẫn hành khách, bộ phận phục vụ và quy trình tại bến."
      />
      <StationAreas />
      <ServiceDepartments />
      <BookingStepsSection />
    </>
  );
}

/** "Khu vực chức năng" (6:346 / 6:2065). */
function StationAreas() {
  const areas = getStationAreas();
  return (
    <Section tone="white" id="khu-vuc" labelledBy="areas-title">
      <div className="relative h-[240px] overflow-hidden rounded-lg md:h-[340px] lg:h-[430px]">
        <Image
          src={images.aerial.src}
          alt={images.aerial.alt}
          fill
          preload
          sizes="(min-width: 1264px) 1200px, 100vw"
          className="object-cover"
        />
      </div>
      <SectionHeading id="areas-title" size="lg" title="Các khu vực hành khách cần biết" />
      <ul className="grid gap-6 md:grid-cols-3">
        {areas.map((area) => (
          <li key={area.id} id={area.id} className="flex scroll-mt-6 flex-col gap-4">
            <div className="relative h-[220px] overflow-hidden rounded-lg">
              <Image
                src={area.image.src}
                alt={area.image.alt}
                fill
                sizes="(min-width: 1024px) 384px, (min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="text-title font-semibold text-navy">{area.title}</h3>
            <p className="text-body text-muted">{area.text}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        Vị trí tầng, cửa và sơ đồ mặt bằng chi tiết sẽ được cập nhật theo phương án vận hành của bến.
      </p>
    </Section>
  );
}

/** "Bộ phận phục vụ" (6:363 / 6:2082). */
function ServiceDepartments() {
  const departments = getServiceDepartments();
  return (
    <Section tone="paper" id="bo-phan" labelledBy="departments-title">
      <SectionHeading
        id="departments-title"
        size="lg"
        title="Tổ chức phục vụ tại bến"
        note="Nhóm chức năng đề xuất cho website; sơ đồ tổ chức pháp lý cần bến xác nhận."
      />
      <ul className="flex flex-col gap-6">
        {departments.map((item) => (
          <li key={item.id}>
            <InfoCard item={item} />
          </li>
        ))}
      </ul>
      <SupportButton view="support" className={buttonClass("primary", "w-full lg:w-[340px]")}>
        Hỏi nhân viên hỗ trợ
      </SupportButton>
    </Section>
  );
}
