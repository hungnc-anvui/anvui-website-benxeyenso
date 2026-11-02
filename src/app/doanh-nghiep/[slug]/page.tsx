import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getOperatorBySlug, getOperators } from "@/data/repositories/transport";
import { OperatorDetail, OperatorDetailFallback } from "@/features/operators/operator-detail";

export function generateStaticParams() {
  return getOperators().map((operator) => ({ slug: operator.slug }));
}

export async function generateMetadata({ params }: PageProps<"/doanh-nghiep/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const operator = getOperatorBySlug(slug);
  if (!operator) return { title: "Không tìm thấy doanh nghiệp" };
  return {
    title: operator.name,
    description: `${operator.name}: tuyến khai thác từ Bến xe Yên Sở, tiện ích, điều kiện phục vụ và điểm đón (hồ sơ minh họa).`,
  };
}

/** Figma 05 · Chi tiết doanh nghiệp — desktop 5:374, mobile 6:1787. */
export default function OperatorPage({ params }: PageProps<"/doanh-nghiep/[slug]">) {
  return (
    <Suspense fallback={<OperatorDetailFallback />}>
      <OperatorContent params={params} />
    </Suspense>
  );
}

async function OperatorContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const operator = getOperatorBySlug(slug);
  if (!operator) notFound();
  return <OperatorDetail operator={operator} />;
}
