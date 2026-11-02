import { paths } from "@/lib/routes";

/** /dat-ve/chon-cho?trip=th-dn01-0800&date=2026-10-16 (date omitted → the page uses today). */
export function seatsHref(tripId: string, date?: string | null) {
  const params = new URLSearchParams({ trip: tripId });
  if (date) params.set("date", date);
  return `${paths.booking.seats}?${params.toString()}`;
}
