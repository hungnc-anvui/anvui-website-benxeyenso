import { AMENITY_LABELS } from "@/lib/amenities";
import type { Amenity, Trip, VehicleType } from "@/types/domain";

/** A trip as listed on the results page, with availability for the searched day. */
export type TripView = { trip: Trip; seatsLeft: number };

export type TimeSlot = "morning" | "afternoon" | "evening";
export type SortKey = "earliest" | "latest" | "cheapest" | "mostSeats";

export type TripFilters = {
  times: TimeSlot[];
  vehicles: VehicleType[];
  amenities: Amenity[];
  sort: SortKey;
};

export const DEFAULT_FILTERS: TripFilters = { times: [], vehicles: [], amenities: [], sort: "earliest" };

/** Departure windows (minutes from midnight, end exclusive). */
export const TIME_SLOTS: Array<{ id: TimeSlot; label: string; hint: string; from: number; to: number }> = [
  { id: "morning", label: "Buổi sáng", hint: "trước 12:00", from: 0, to: 12 * 60 },
  { id: "afternoon", label: "Buổi chiều", hint: "12:00 – 18:00", from: 12 * 60, to: 18 * 60 },
  { id: "evening", label: "Buổi tối", hint: "từ 18:00", from: 18 * 60, to: 24 * 60 },
];

export const SORT_OPTIONS: Array<{ id: SortKey; label: string }> = [
  { id: "earliest", label: "Giờ đi sớm nhất" },
  { id: "latest", label: "Giờ đi muộn nhất" },
  { id: "cheapest", label: "Giá thấp nhất" },
  { id: "mostSeats", label: "Còn nhiều chỗ nhất" },
];

export function sortLabel(sort: SortKey) {
  return SORT_OPTIONS.find((o) => o.id === sort)?.label ?? SORT_OPTIONS[0].label;
}

const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export function timeSlotOf(trip: Trip): TimeSlot {
  const minutes = minutesOf(trip.departTime);
  return (TIME_SLOTS.find((s) => minutes >= s.from && minutes < s.to) ?? TIME_SLOTS[0]).id;
}

/** Vehicle types and amenities offered by the listed trips (filter options follow the data). */
export function filterOptions(items: TripView[]) {
  const vehicles = [...new Set(items.map((i) => i.trip.vehicleType))];
  const offered = new Set(items.flatMap((i) => i.trip.amenities));
  const amenities = (Object.keys(AMENITY_LABELS) as Amenity[]).filter((a) => offered.has(a));
  return { vehicles, amenities };
}

/** Time slots and vehicle types match any selected value; amenities must all be present. */
export function matchesFilters({ trip }: TripView, f: TripFilters) {
  if (f.times.length && !f.times.includes(timeSlotOf(trip))) return false;
  if (f.vehicles.length && !f.vehicles.includes(trip.vehicleType)) return false;
  return f.amenities.every((a) => trip.amenities.includes(a));
}

const byDeparture = (a: TripView, b: TripView) => a.trip.departTime.localeCompare(b.trip.departTime);

const comparators: Record<SortKey, (a: TripView, b: TripView) => number> = {
  earliest: byDeparture,
  latest: (a, b) => -byDeparture(a, b),
  cheapest: (a, b) => a.trip.price - b.trip.price || byDeparture(a, b),
  mostSeats: (a, b) => b.seatsLeft - a.seatsLeft || byDeparture(a, b),
};

export function applyFilters(items: TripView[], f: TripFilters) {
  return items.filter((i) => matchesFilters(i, f)).sort(comparators[f.sort]);
}

export function activeFilterCount(f: TripFilters) {
  return f.times.length + f.vehicles.length + f.amenities.length;
}

/** "Buổi sáng · Wi-Fi · Cổng sạc" */
export function describeFilters(f: TripFilters) {
  return [
    ...f.times.map((t) => TIME_SLOTS.find((s) => s.id === t)?.label ?? t),
    ...f.vehicles,
    ...f.amenities.map((a) => AMENITY_LABELS[a]),
  ].join(" · ");
}

export function toggleValue<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
