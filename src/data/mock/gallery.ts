import type { GalleryPhoto } from "@/types/domain";
import { images } from "./images";

/** Albums of "21 · Thư viện ảnh bến xe" (30:3131) — the "Chọn chuyên mục ảnh" buttons scroll to them. */
export type GalleryAlbumId = "toan-canh-kien-truc" | "khong-gian-hanh-khach" | "khu-vuc-phuong-tien" | "su-kien-khai-truong";

export type GalleryAlbum = { id: GalleryAlbumId; title: string };

export const galleryAlbums: GalleryAlbum[] = [
  { id: "toan-canh-kien-truc", title: "Toàn cảnh & kiến trúc" },
  { id: "khong-gian-hanh-khach", title: "Không gian hành khách" },
  { id: "khu-vuc-phuong-tien", title: "Khu vực phương tiện" },
  { id: "su-kien-khai-truong", title: "Sự kiện khai trương" },
];

/** A gallery photo plus the Figma album it is shown in (the shared `category` is a finer label). */
export type GalleryEntry = GalleryPhoto & { album: GalleryAlbumId };

/** Order matches the Figma lightbox frames "Xem ảnh · …" (1/10 → 10/10) and the page sections. */
export const galleryPhotos: GalleryEntry[] = [
  {
    id: "toan-canh",
    title: "Toàn cảnh bến nhìn từ trên cao",
    caption: "Bến nằm cạnh trục Vành đai 3, thuận tiện kết nối các hướng di chuyển.",
    category: "Toàn cảnh",
    album: "toan-canh-kien-truc",
    image: images.aerial,
  },
  {
    id: "kien-truc",
    title: "Kiến trúc khối nhà trung tâm",
    caption: "Khối nhà hình tròn là điểm nhận diện của Bến xe Yên Sở.",
    category: "Kiến trúc",
    album: "toan-canh-kien-truc",
    image: images.architecture,
  },
  {
    id: "mat-tien",
    title: "Mặt tiền Bến xe Yên Sở",
    caption: "Mặt kính rộng mở đón ánh sáng tự nhiên vào sảnh chính.",
    category: "Kiến trúc",
    album: "toan-canh-kien-truc",
    image: images.hero,
  },
  {
    id: "canh-quan",
    title: "Công trình và cảnh quan bên ngoài",
    caption: "Không gian bên ngoài bến với lối tiếp cận rõ ràng cho hành khách.",
    category: "Kiến trúc",
    album: "toan-canh-kien-truc",
    image: images.facade,
  },
  {
    id: "tuyen-duong",
    title: "Không gian bến và tuyến đường kết nối",
    caption: "Bến xe nhìn từ trên cao cùng các tuyến đường kết nối xung quanh.",
    category: "Toàn cảnh",
    album: "toan-canh-kien-truc",
    image: images.road,
  },
  {
    id: "quay-ve",
    title: "Quầy bán vé và khu vực thông tin",
    caption: "Khu vực quầy vé và thông tin hỗ trợ hành khách tại sảnh.",
    category: "Dịch vụ",
    album: "khong-gian-hanh-khach",
    image: images.counter,
  },
  {
    id: "sanh-cho",
    title: "Sảnh chờ hành khách",
    caption: "Dãy ghế chờ rộng rãi, gần cửa ra xe và quầy thông tin.",
    category: "Không gian chờ",
    album: "khong-gian-hanh-khach",
    image: images.lounge,
  },
  {
    id: "xe-khach",
    title: "Xe khách tại bến",
    caption: "Khu vực xe đỗ chờ đón khách tại bến.",
    category: "Dịch vụ",
    album: "khu-vuc-phuong-tien",
    image: images.bus,
  },
  {
    id: "khai-truong",
    title: "Khoảnh khắc tại lễ khai trương",
    caption: "Hình ảnh tại lễ khai trương Bến xe Yên Sở.",
    category: "Sự kiện",
    album: "su-kien-khai-truong",
    image: images.opening,
  },
  {
    id: "khong-khi-khai-truong",
    title: "Không khí lễ khai trương bến",
    caption: "Không khí ngày đầu bến đi vào hoạt động.",
    category: "Sự kiện",
    album: "su-kien-khai-truong",
    image: images.opening2,
  },
];
