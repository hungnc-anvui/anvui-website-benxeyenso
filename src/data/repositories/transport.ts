import { destinations, operators, ORIGIN, routes, seatDecks, TOTAL_SEATS, trips, vouchers } from "@/data/mock/transport";
import type { Trip, Voucher } from "@/types/domain";

/**
 * Mock data access. Functions are synchronous so they work in both Server and
 * Client Components; swap the bodies for API calls when a backend exists.
 */

export const ORIGIN_LABEL = ORIGIN;

export function getDestinations() {
  return destinations;
}

/** Destinations that have bookable schedules (shown in the location picker). */
export function getBookableDestinations() {
  const ids = new Set(routes.filter((r) => r.hasSchedule).map((r) => r.destinationId));
  return destinations.filter((d) => ids.has(d.id));
}

export function getDestination(id: string) {
  return destinations.find((d) => d.id === id);
}

export function getRoutes() {
  return routes;
}

export function getFeaturedRoutes() {
  return routes.filter((r) => r.featured);
}

export function getRoute(id: string) {
  return routes.find((r) => r.id === id);
}

export function getRouteByDestination(destinationId: string) {
  return routes.find((r) => r.destinationId === destinationId);
}

export function getOperators() {
  return operators;
}

export function getOperator(id: string) {
  return operators.find((o) => o.id === id);
}

export function getOperatorBySlug(slug: string) {
  return operators.find((o) => o.slug === slug);
}

/** Case/diacritic-insensitive search over operator name, code and destinations. */
export function searchOperators(query: string) {
  const q = normalize(query);
  if (!q) return operators;
  return operators.filter((o) => {
    const haystack = [
      o.name,
      o.code,
      o.mainDestination,
      ...o.routeIds.map((id) => getRoute(id)?.name ?? ""),
    ]
      .map(normalize)
      .join(" ");
    return haystack.includes(q);
  });
}

export function getTrips() {
  return trips;
}

export function getTrip(id: string) {
  return trips.find((t) => t.id === id);
}

export function getTripsByRoute(routeId: string) {
  return trips
    .filter((t) => t.routeId === routeId)
    .sort((a, b) => a.departTime.localeCompare(b.departTime));
}

export function getTripsByOperator(operatorId: string) {
  return trips.filter((t) => t.operatorId === operatorId);
}

export function getTripsForDestination(destinationId: string) {
  const route = getRouteByDestination(destinationId);
  return route ? getTripsByRoute(route.id) : [];
}

export function getSeatDecks() {
  return seatDecks;
}

export function seatsLeft(trip: Trip, extraSold: string[] = []) {
  const sold = new Set([...trip.soldSeats, ...extraSold]);
  return TOTAL_SEATS - sold.size;
}

export function getVouchers() {
  return vouchers;
}

export type VoucherCheck =
  | { ok: true; voucher: Voucher }
  | { ok: false; error: string };

export function checkVoucher(code: string, orderAmount: number): VoucherCheck {
  const voucher = vouchers.find((v) => v.code === code.trim().toUpperCase());
  if (!voucher) return { ok: false, error: "Mã ưu đãi không tồn tại hoặc đã hết hạn." };
  if (orderAmount < voucher.minOrder) {
    return { ok: false, error: `Mã chỉ áp dụng cho đơn từ ${voucher.minOrder.toLocaleString("vi-VN")}đ.` };
  }
  return { ok: true, voucher };
}

export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
