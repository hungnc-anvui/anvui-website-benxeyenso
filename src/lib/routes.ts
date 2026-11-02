/** Central route map — Figma frame → URL. */
export const paths = {
  home: "/",
  about: "/gioi-thieu",
  routes: "/tuyen-xe",
  operators: "/doanh-nghiep",
  operator: (slug: string) => `/doanh-nghiep/${slug}`,
  news: "/tin-tuc",
  article: (slug: string) => `/tin-tuc/${slug}`,
  contact: "/lien-he",
  organization: "/to-chuc-ben",
  policy: "/dieu-kien-ve",
  gallery: "/thu-vien-anh",
  lookup: "/tra-cuu-ve",
  booking: {
    search: "/dat-ve",
    trip: (tripId: string) => `/dat-ve/chuyen/${tripId}`,
    seats: "/dat-ve/chon-cho",
    checkout: "/dat-ve/thanh-toan",
    payment: "/dat-ve/thanh-toan-qr",
    ticket: "/dat-ve/ve-dien-tu",
  },
} as const;

export type SearchQuery = {
  to?: string;
  date?: string;
  returnDate?: string;
};

/** /dat-ve?to=thanh-hoa&date=2026-10-16 */
export function searchHref({ to, date, returnDate }: SearchQuery = {}) {
  const params = new URLSearchParams();
  if (to) params.set("to", to);
  if (date) params.set("date", date);
  if (returnDate) params.set("return", returnDate);
  const qs = params.toString();
  return qs ? `${paths.booking.search}?${qs}` : paths.booking.search;
}

export const mainNav = [
  { label: "Giới thiệu", href: paths.about },
  { label: "Tuyến xe", href: paths.routes },
  { label: "Doanh nghiệp", href: paths.operators },
  { label: "Tin tức", href: paths.news },
  { label: "Tổ chức bến", href: paths.organization },
  { label: "Liên hệ", href: paths.contact },
  { label: "Thư viện ảnh", href: paths.gallery },
] as const;

/** Mobile menu (Figma state "Trạng thái · menu") */
export const mobileNav = [
  { label: "Trang chủ", href: paths.home },
  { label: "Giới thiệu", href: paths.about },
  { label: "Tìm & đặt vé", href: paths.booking.search },
  { label: "Danh sách tuyến", href: paths.routes },
  { label: "Doanh nghiệp vận tải", href: paths.operators },
  { label: "Tin tức", href: paths.news },
  { label: "Tổ chức bến", href: paths.organization },
  { label: "Liên hệ", href: paths.contact },
  { label: "Tra cứu vé", href: paths.lookup },
  { label: "Thư viện ảnh", href: paths.gallery },
] as const;
