"use client";

import { useSearchParams } from "next/navigation";
import { getDestination, getOperator, getRoute, getTrip } from "@/data/repositories/transport";
import { isIsoDay } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import type { Destination, Operator, Route, Trip } from "@/types/domain";

type Found = { trip: Trip; route: Route; operator: Operator; destination: Destination };

export type SeatTarget =
  | { status: "invalid" }
  /** Trip known, travel day not resolved yet (today is read on the client only). */
  | ({ status: "loading" } & Found)
  | ({ status: "past"; date: string; today: string } & Found)
  | ({ status: "ready"; date: string } & Found);

/**
 * Reads `?trip=&date=` for the seat page. A missing or malformed date means today;
 * a day already gone is reported so the page can ask for another one.
 * Callers must sit inside <Suspense> (useSearchParams).
 */
export function useSeatTarget(): SeatTarget {
  const params = useSearchParams();
  const today = useToday();

  const trip = getTrip(params.get("trip") ?? "");
  const route = trip ? getRoute(trip.routeId) : undefined;
  const operator = trip ? getOperator(trip.operatorId) : undefined;
  const destination = route ? getDestination(route.destinationId) : undefined;
  if (!trip || !route || !operator || !destination) return { status: "invalid" };

  const found = { trip, route, operator, destination };
  if (!today) return { status: "loading", ...found };

  const raw = params.get("date");
  const date = isIsoDay(raw) ? raw : today;
  if (date < today) return { status: "past", date, today, ...found };
  return { status: "ready", date, ...found };
}
