import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, Section } from "@/components/ui/section";
import { SeatSelection, SeatSelectionSkeleton, SeatTripSummary } from "@/features/booking/seats/seat-selection";

export const metadata: Metadata = {
  title: "Chọn chỗ",
  description: "Chọn giường còn trống trên sơ đồ xe, xem giá ưu đãi chuyến và tiếp tục đặt vé tại Bến xe Yên Sở.",
};

/**
 * Figma 12 · Chọn chỗ / 12B · Đã chọn ghế A03 — desktop 6:701 / 6:802, mobile 6:2397 / 6:2492.
 * `/dat-ve/chon-cho?trip=&date=`; trip and day are read on the client (inside Suspense).
 */
export default function SeatsPage() {
  return (
    <>
      <PageHero
        crumb="Chọn chỗ"
        title="Chọn chỗ cho hành trình của bạn."
        description={
          <Suspense fallback="Đang tải thông tin chuyến…">
            <SeatTripSummary />
          </Suspense>
        }
      />
      <Section tone="paper">
        <Suspense fallback={<SeatSelectionSkeleton />}>
          <SeatSelection />
        </Suspense>
      </Section>
    </>
  );
}
