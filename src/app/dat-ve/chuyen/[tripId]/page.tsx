import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getOperator, getRoute, getTrip, getTrips } from "@/data/repositories/transport";
import { TripOverview, TripOverviewSkeleton } from "@/features/booking/trip/trip-overview";

export function generateStaticParams() {
  return getTrips().map((trip) => ({ tripId: trip.id }));
}

function lookup(tripId: string) {
  const trip = getTrip(tripId);
  const route = trip ? getRoute(trip.routeId) : undefined;
  const operator = trip ? getOperator(trip.operatorId) : undefined;
  return trip && route && operator ? { trip, route, operator } : null;
}

export async function generateMetadata({ params }: PageProps<"/dat-ve/chuyen/[tripId]">): Promise<Metadata> {
  const { tripId } = await params;
  const found = lookup(tripId);
  if (!found) return { title: "Không tìm thấy chuyến xe" };
  const { trip, route, operator } = found;
  return {
    title: `Chuyến ${trip.departTime} · ${route.name}`,
    description: `${operator.name} · ${route.name}, khởi hành ${trip.departTime} hằng ngày từ Bến xe Yên Sở: tiện ích, lộ trình dự kiến và điều kiện vé.`,
  };
}

/** Figma 11 · Chi tiết chuyến — desktop 6:613, mobile 6:2315. `/dat-ve/chuyen/[tripId]?date=` */
export default function TripDetailPage({ params }: PageProps<"/dat-ve/chuyen/[tripId]">) {
  return (
    <Suspense fallback={<TripOverviewSkeleton />}>
      <TripDetail params={params} />
    </Suspense>
  );
}

async function TripDetail({ params }: Pick<PageProps<"/dat-ve/chuyen/[tripId]">, "params">) {
  const { tripId } = await params;
  const found = lookup(tripId);
  if (!found) notFound();
  return <TripOverview {...found} />;
}
