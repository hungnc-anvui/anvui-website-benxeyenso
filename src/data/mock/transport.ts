import type { Destination, Operator, Route, SeatDeck, Trip, Voucher } from "@/types/domain";
import { images } from "./images";

/**
 * Illustrative data from the Figma handoff (page 04 · Bàn giao):
 * operator names, schedules and prices are samples, not published station data.
 */

export const ORIGIN = "Bến xe Yên Sở";

export const destinations: Destination[] = [
  { id: "thanh-hoa", province: "Thanh Hóa", label: "Thanh Hóa" },
  { id: "nghe-an", province: "Nghệ An", label: "Vinh" },
  { id: "ha-tinh", province: "Hà Tĩnh", label: "Hà Tĩnh" },
  { id: "quang-binh", province: "Quảng Bình", label: "Quảng Bình" },
  { id: "hue", province: "Huế", label: "Huế" },
  { id: "da-nang", province: "Đà Nẵng", label: "Đà Nẵng" },
];

export const routes: Route[] = [
  {
    id: "ys-thanh-hoa",
    slug: "yen-so-thanh-hoa",
    destinationId: "thanh-hoa",
    name: "Yên Sở → Thanh Hóa",
    durationMinutes: 210,
    distanceKm: 160,
    priceFrom: 180000,
    vehicleType: "Giường nằm",
    image: images.bus,
    featured: true,
    hasSchedule: true,
  },
  {
    id: "ys-vinh",
    slug: "yen-so-vinh",
    destinationId: "nghe-an",
    name: "Yên Sở → Vinh",
    durationMinutes: 360,
    distanceKm: 300,
    priceFrom: 280000,
    vehicleType: "Giường nằm",
    image: images.road,
    featured: true,
    hasSchedule: true,
  },
  {
    id: "ys-ha-tinh",
    slug: "yen-so-ha-tinh",
    destinationId: "ha-tinh",
    name: "Yên Sở → Hà Tĩnh",
    durationMinutes: 420,
    distanceKm: 350,
    priceFrom: 320000,
    vehicleType: "Giường nằm",
    image: images.architecture,
    featured: true,
    hasSchedule: true,
  },
  {
    id: "ys-quang-binh",
    slug: "yen-so-quang-binh",
    destinationId: "quang-binh",
    name: "Yên Sở → Quảng Bình",
    durationMinutes: 600,
    distanceKm: 500,
    priceFrom: 380000,
    vehicleType: "Giường nằm",
    image: images.aerial,
    featured: false,
    hasSchedule: false,
  },
  {
    id: "ys-hue",
    slug: "yen-so-hue",
    destinationId: "hue",
    name: "Yên Sở → Huế",
    durationMinutes: 780,
    distanceKm: 660,
    priceFrom: 450000,
    vehicleType: "Giường nằm",
    image: images.facade,
    featured: false,
    hasSchedule: false,
  },
  {
    id: "ys-da-nang",
    slug: "yen-so-da-nang",
    destinationId: "da-nang",
    name: "Yên Sở → Đà Nẵng",
    durationMinutes: 900,
    distanceKm: 760,
    priceFrom: 500000,
    vehicleType: "Giường nằm",
    image: images.hero,
    featured: false,
    hasSchedule: false,
  },
];

const STANDARD_SUMMARY = "Thông tin tuyến, tiện ích và điều kiện vé rõ ràng.";

export const operators: Operator[] = [
  {
    id: "dn-01",
    slug: "doanh-nghiep-van-tai-01",
    code: "DN 01",
    name: "Doanh nghiệp vận tải 01",
    mainDestination: "Thanh Hóa",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-thanh-hoa", "ys-vinh", "ys-ha-tinh"],
    amenities: ["wifi", "water", "usb", "aircon"],
    fleetSize: 24,
    yearsOperating: 12,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
  {
    id: "dn-02",
    slug: "doanh-nghiep-van-tai-02",
    code: "DN 02",
    name: "Doanh nghiệp vận tải 02",
    mainDestination: "Vinh",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-vinh", "ys-thanh-hoa", "ys-ha-tinh"],
    amenities: ["wifi", "water", "usb", "aircon"],
    fleetSize: 18,
    yearsOperating: 9,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
  {
    id: "dn-03",
    slug: "doanh-nghiep-van-tai-03",
    code: "DN 03",
    name: "Doanh nghiệp vận tải 03",
    mainDestination: "Hà Tĩnh",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-ha-tinh", "ys-thanh-hoa", "ys-vinh"],
    amenities: ["wifi", "water", "aircon", "blanket"],
    fleetSize: 15,
    yearsOperating: 7,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
  {
    id: "dn-04",
    slug: "doanh-nghiep-van-tai-04",
    code: "DN 04",
    name: "Doanh nghiệp vận tải 04",
    mainDestination: "Quảng Bình",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-quang-binh"],
    amenities: ["wifi", "water", "aircon", "blanket"],
    fleetSize: 10,
    yearsOperating: 6,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
  {
    id: "dn-05",
    slug: "doanh-nghiep-van-tai-05",
    code: "DN 05",
    name: "Doanh nghiệp vận tải 05",
    mainDestination: "Huế",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-hue"],
    amenities: ["wifi", "water", "usb", "aircon", "toilet"],
    fleetSize: 12,
    yearsOperating: 10,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
  {
    id: "dn-06",
    slug: "doanh-nghiep-van-tai-06",
    code: "DN 06",
    name: "Doanh nghiệp vận tải 06",
    mainDestination: "Đà Nẵng",
    vehicleType: "Giường nằm",
    summary: STANDARD_SUMMARY,
    routeIds: ["ys-da-nang"],
    amenities: ["wifi", "water", "usb", "aircon", "toilet"],
    fleetSize: 14,
    yearsOperating: 8,
    hotlineNote: "Số điện thoại chính thức sẽ được bến cập nhật.",
  },
];

/** Sleeper coach: two decks, two columns (left/right of the aisle). */
export const seatDecks: SeatDeck[] = [
  {
    id: "lower",
    label: "Tầng dưới",
    rows: [
      ["A01", "A02"],
      ["A03", "A04"],
      ["A05", "A06"],
      ["A07", "A08"],
      ["A09", "A10"],
      ["A11", "A12"],
    ],
  },
  {
    id: "upper",
    label: "Tầng trên",
    rows: [
      ["B01", "B02"],
      ["B03", "B04"],
      ["B05", "B06"],
      ["B07", "B08"],
      ["B09", "B10"],
      ["B11", "B12"],
    ],
  },
];

export const TOTAL_SEATS = seatDecks.reduce((n, deck) => n + deck.rows.flat().filter(Boolean).length, 0);

const LOWER_EVEN = ["A02", "A04", "A06", "A08", "A10", "A12"];
const upper = (count: number) => seatDecks[1].rows.flat().slice(0, count) as string[];

const STANDARD_AMENITIES: Trip["amenities"] = ["wifi", "water", "usb", "aircon"];

function trip(
  id: string,
  routeId: string,
  operatorId: string,
  departTime: string,
  listPrice: number,
  soldSeats: string[],
  overrides: Partial<Trip> = {},
): Trip {
  const route = routes.find((r) => r.id === routeId)!;
  const [h, m] = departTime.split(":").map(Number);
  const checkIn = h * 60 + m - 30;
  const destination = destinations.find((d) => d.id === route.destinationId)!;
  return {
    id,
    routeId,
    operatorId,
    departTime,
    durationMinutes: route.durationMinutes,
    listPrice,
    price: listPrice - 20000,
    vehicleType: route.vehicleType,
    amenities: STANDARD_AMENITIES,
    soldSeats,
    checkInTime: `${String(Math.floor(checkIn / 60)).padStart(2, "0")}:${String(checkIn % 60).padStart(2, "0")}`,
    pickupPoint: ORIGIN,
    dropoffPoint: destination.label,
    ...overrides,
  };
}

/** Daily schedules — every trip runs every day. */
export const trips: Trip[] = [
  // Yên Sở → Thanh Hóa · 3 chuyến minh họa (Figma 10 · Kết quả tìm chuyến)
  trip("th-dn01-0800", "ys-thanh-hoa", "dn-01", "08:00", 200000, [...LOWER_EVEN, ...upper(10)]),
  trip("th-dn02-1000", "ys-thanh-hoa", "dn-02", "10:00", 200000, [...LOWER_EVEN, ...upper(12)]),
  trip("th-dn03-1400", "ys-thanh-hoa", "dn-03", "14:00", 200000, [...LOWER_EVEN, "A01", "A05", ...upper(12)]),
  // Yên Sở → Vinh
  trip("vinh-dn02-0700", "ys-vinh", "dn-02", "07:00", 300000, ["A02", "A04", "B01", "B02", "B03"]),
  trip("vinh-dn01-1300", "ys-vinh", "dn-01", "13:00", 300000, ["A01", "A02", "A07", "B05", "B06", "B11"]),
  trip("vinh-dn03-2100", "ys-vinh", "dn-03", "21:00", 300000, [...LOWER_EVEN, ...upper(8)], {
    amenities: ["wifi", "water", "aircon", "blanket"],
  }),
  // Yên Sở → Hà Tĩnh
  trip("ht-dn03-0630", "ys-ha-tinh", "dn-03", "06:30", 340000, ["A03", "A04", "B07"], {
    amenities: ["wifi", "water", "aircon", "blanket"],
  }),
  trip("ht-dn02-1200", "ys-ha-tinh", "dn-02", "12:00", 340000, ["A01", "A02", "A03", "B01", "B02"]),
  trip("ht-dn01-2000", "ys-ha-tinh", "dn-01", "20:00", 340000, [...LOWER_EVEN, "B02", "B04", "B06"]),
];

export const vouchers: Voucher[] = [
  {
    code: "YENSO20",
    title: "Giảm thêm 20.000đ",
    discount: 20000,
    minOrder: 180000,
    expiresAt: "2026-12-31",
    description: "Áp dụng cho đơn từ 180.000đ. Mỗi đơn dùng một mã.",
  },
];
