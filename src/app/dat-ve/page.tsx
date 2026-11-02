import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { getDestination } from "@/data/repositories/transport";
import { TripResults } from "@/features/booking/results/trip-results";
import { SearchForm } from "@/features/search/search-form";
import { isIsoDay } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kết quả tìm chuyến",
  description:
    "Tìm chuyến xe khởi hành từ Bến xe Yên Sở: chọn điểm đến, ngày đi (dương lịch và âm lịch), lọc theo giờ đi, loại xe, tiện ích và đặt chỗ trực tuyến.",
};

const DEFAULT_DESTINATION = "thanh-hoa";

type SearchParams = PageProps<"/dat-ve">["searchParams"];

/** Figma 10 · Kết quả tìm chuyến — desktop 6:493, mobile 6:2203. `/dat-ve?to=&date=&return=` */
export default function SearchResultsPage({ searchParams }: PageProps<"/dat-ve">) {
  return (
    <Section tone="paper" labelledBy="results-title">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const to = first(query.to) || DEFAULT_DESTINATION;
  const rawDate = first(query.date);
  const rawReturn = first(query.return);
  const date = isIsoDay(rawDate) ? rawDate : null;
  const returnDate = isIsoDay(rawReturn) ? rawReturn : null;
  const known = Boolean(getDestination(to));

  return (
    <>
      {/* Remount on a new search so the form shows exactly what the URL says. */}
      <SearchForm
        key={`${to}|${date}|${returnDate}`}
        initial={{ to: known ? to : undefined, date: date ?? undefined, returnDate: returnDate ?? undefined }}
      />
      {/* Filters are per destination (options follow its trips), so they reset when it changes. */}
      <TripResults key={to} destinationId={to} date={date} returnDate={returnDate} />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <>
      <div aria-hidden="true" className="h-[404px] animate-pulse rounded-lg bg-white lg:h-40" />
      <p role="status" className="text-body text-muted">
        Đang tải kết quả tìm chuyến…
      </p>
      <div aria-hidden="true" className="h-[618px] animate-pulse rounded-lg bg-white lg:h-[260px]" />
    </>
  );
}
