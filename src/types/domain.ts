export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Amenity = "wifi" | "water" | "usb" | "aircon" | "blanket" | "toilet";

export type VehicleType = "Giường nằm" | "Limousine" | "Ghế ngồi";

export type Destination = {
  id: string;
  /** Province / city shown in pickers: "Thanh Hóa" */
  province: string;
  /** Short label used in route names: "Vinh" */
  label: string;
};

export type Route = {
  id: string;
  slug: string;
  destinationId: string;
  /** "Yên Sở → Thanh Hóa" */
  name: string;
  durationMinutes: number;
  distanceKm: number;
  priceFrom: number;
  vehicleType: VehicleType;
  image: ImageAsset;
  featured: boolean;
  /** Routes the station has not published a schedule for yet show "Xem lịch & giá" */
  hasSchedule: boolean;
};

export type Operator = {
  id: string;
  slug: string;
  /** "DN 01" */
  code: string;
  name: string;
  /** Main destination shown on card: "Thanh Hóa" */
  mainDestination: string;
  vehicleType: VehicleType;
  summary: string;
  routeIds: string[];
  amenities: Amenity[];
  fleetSize: number;
  yearsOperating: number;
  hotlineNote: string;
};

export type Trip = {
  id: string;
  routeId: string;
  operatorId: string;
  departTime: string;
  durationMinutes: number;
  listPrice: number;
  price: number;
  vehicleType: VehicleType;
  amenities: Amenity[];
  /** Seat codes already sold — the rest of the layout is available */
  soldSeats: string[];
  /** Time passengers should check in, "07:30" */
  checkInTime: string;
  pickupPoint: string;
  dropoffPoint: string;
};

export type SeatDeck = {
  id: string;
  label: string;
  /** Rows of seat codes; null renders an aisle gap */
  rows: Array<Array<string | null>>;
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; image: ImageAsset; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type ArticleCategory =
  | "Hoạt động bến"
  | "Không gian bến"
  | "Hướng dẫn"
  | "Tiện ích"
  | "Hành khách"
  | "Vé điện tử"
  | "Doanh nghiệp"
  | "Góc ảnh";

export type Article = {
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  image: ImageAsset;
  publishedAt: string;
  readMinutes: number;
  featured?: boolean;
  body: ArticleBlock[];
};

export type GalleryCategory = "Toàn cảnh" | "Kiến trúc" | "Không gian chờ" | "Dịch vụ" | "Sự kiện";

export type GalleryPhoto = {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  image: ImageAsset;
};

export type Voucher = {
  code: string;
  title: string;
  discount: number;
  minOrder: number;
  expiresAt: string;
  description: string;
};

export type PaymentMethod = "qr" | "card";

export type Passenger = {
  fullName: string;
  phone: string;
  email: string;
};

export type Ticket = {
  code: string;
  tripId: string;
  date: string;
  seats: string[];
  passenger: Passenger;
  voucherCode: string | null;
  paymentMethod: PaymentMethod;
  listTotal: number;
  tripDiscount: number;
  voucherDiscount: number;
  total: number;
  createdAt: string;
};
