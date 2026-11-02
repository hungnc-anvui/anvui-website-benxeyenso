import { paths } from "@/lib/routes";

/** /dat-ve/chuyen/th-dn01-0800?date=2026-10-16 */
export function tripHref(tripId: string, date?: string | null) {
  const base = paths.booking.trip(tripId);
  return date ? `${base}?${new URLSearchParams({ date }).toString()}` : base;
}
