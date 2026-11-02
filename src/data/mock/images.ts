import type { ImageAsset } from "@/types/domain";

/** Customer-supplied photos exported from Figma "Asset/*" (page 01 · Hệ thiết kế). */
export const images = {
  logo: { src: "/images/logo.png", alt: "Logo Bến xe Yên Sở", width: 480, height: 480 },
  hero: {
    src: "/images/hero.jpg",
    alt: "Mặt tiền Bến xe Yên Sở với khối nhà kính hình vòng cung",
    width: 1900,
    height: 1423,
  },
  aerial: {
    src: "/images/aerial.jpg",
    alt: "Toàn cảnh Bến xe Yên Sở nhìn từ trên cao bên đường Vành đai 3",
    width: 1900,
    height: 1063,
  },
  architecture: {
    src: "/images/architecture.jpg",
    alt: "Khối nhà trung tâm hình tròn của Bến xe Yên Sở",
    width: 1520,
    height: 1140,
  },
  facade: {
    src: "/images/facade.jpg",
    alt: "Công trình và cảnh quan bên ngoài Bến xe Yên Sở",
    width: 1900,
    height: 1068,
  },
  road: {
    src: "/images/road.jpg",
    alt: "Bến xe Yên Sở và tuyến đường kết nối",
    width: 1900,
    height: 1075,
  },
  lounge: {
    src: "/images/lounge.jpg",
    alt: "Sảnh chờ hành khách với dãy ghế chờ",
    width: 1520,
    height: 1138,
  },
  counter: {
    src: "/images/counter.jpg",
    alt: "Quầy bán vé và khu vực thông tin tại bến",
    width: 1140,
    height: 1520,
  },
  bus: {
    src: "/images/bus.jpg",
    alt: "Xe khách xếp hàng tại khu vực đỗ xe của bến",
    width: 1520,
    height: 1140,
  },
  opening: {
    src: "/images/opening.jpg",
    alt: "Khoảnh khắc tại lễ khai trương Bến xe Yên Sở",
    width: 1520,
    height: 1014,
  },
  opening2: {
    src: "/images/opening2.jpg",
    alt: "Không khí lễ khai trương Bến xe Yên Sở",
    width: 1520,
    height: 1140,
  },
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof images;
