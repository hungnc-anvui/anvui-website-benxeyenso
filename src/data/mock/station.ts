import { images } from "@/data/mock/images";
import type { ImageAsset } from "@/types/domain";

/**
 * Station content for the public pages 02 Giới thiệu (5:99 / 6:1530),
 * 09 Tổ chức bến (6:328 / 6:2050), 08 Liên hệ (6:247 / 6:1975) and
 * 15 Điều kiện vé & bảo mật (6:433 / 6:2149). Copy is verbatim from Figma.
 */

export type InfoItem = {
  /** Anchor id (used for deep links, e.g. /dieu-kien-ve#doi-huy-hanh-ly) */
  id: string;
  title: string;
  text: string;
};

export type StationArea = InfoItem & { image: ImageAsset };

/** "Không gian bến" highlight cards (5:119). */
export const aboutHighlights: InfoItem[] = [
  {
    id: "khong-gian-ro-rang",
    title: "Không gian rõ ràng",
    text: "Sảnh chờ, quầy vé và khu vực dịch vụ được tổ chức theo chức năng.",
  },
  {
    id: "cong-nghe-dong-hanh",
    title: "Công nghệ đồng hành",
    text: "Thông tin điện tử, vé điện tử và các kênh hỗ trợ giúp hành khách chủ động hơn.",
  },
  {
    id: "ket-noi-thuan-tien",
    title: "Kết nối thuận tiện",
    text: "Tra cứu điểm đến và doanh nghiệp vận tải tại một website.",
  },
];

/** "Các khu vực hành khách cần biết" (6:349). */
export const stationAreas: StationArea[] = [
  {
    id: "quay-ve",
    title: "Quầy vé & thông tin",
    text: "Hỗ trợ tra cứu vé, xác nhận chuyến và giải đáp thắc mắc.",
    image: images.counter,
  },
  {
    id: "sanh-cho",
    title: "Sảnh chờ hành khách",
    text: "Theo dõi thông tin chuyến và chuẩn bị trước giờ lên xe.",
    image: images.lounge,
  },
  {
    id: "khu-vuc-len-xe",
    title: "Khu vực lên xe",
    text: "Đối chiếu chuyến, cửa ra xe và chỉ dẫn từ nhân viên bến.",
    image: images.bus,
  },
];

/** "Tổ chức phục vụ tại bến" (6:363). */
export const serviceDepartments: InfoItem[] = [
  {
    id: "ban-quan-ly",
    title: "Ban quản lý bến",
    text: "Tiếp nhận thông tin chung và phối hợp các bộ phận.",
  },
  {
    id: "dieu-hanh-van-tai",
    title: "Điều hành vận tải",
    text: "Thông tin chuyến, vị trí xe và hỗ trợ doanh nghiệp.",
  },
  {
    id: "dich-vu-hanh-khach",
    title: "Dịch vụ hành khách",
    text: "Tư vấn, quầy vé, đồ thất lạc và hỗ trợ người cần trợ giúp.",
  },
  {
    id: "an-ninh-ha-tang",
    title: "An ninh & hạ tầng",
    text: "Hướng dẫn trật tự, an toàn và tiện ích tại bến.",
  },
];

/** "Nội dung chính sách" (6:451). */
export const policySections: InfoItem[] = [
  {
    id: "xac-nhan-dat-cho",
    title: "Xác nhận đặt chỗ",
    text: "Kiểm tra đúng tuyến, ngày đi và người liên hệ. Chỗ được xác nhận khi thanh toán thành công.",
  },
  {
    id: "doi-huy-hanh-ly",
    title: "Đổi, hủy và hành lý",
    text: "Điều kiện phụ thuộc chuyến và nhà vận tải. Xem thông tin cụ thể hoặc liên hệ trước khi xác nhận.",
  },
  {
    id: "thong-tin-ca-nhan",
    title: "Thông tin cá nhân",
    text: "Chỉ cung cấp thông tin cần thiết để đặt vé và nhận hỗ trợ. Không chia sẻ mã OTP.",
  },
];

/** "Kênh hỗ trợ" (6:267). Hotline / Zalo OA are unverified (handoff) — never list numbers here. */
export const stationContact = {
  name: "Bến xe Yên Sở · Hà Nội",
  address: "Khu vực đường Đỗ Mười / Vành đai 3, Hà Nội.",
  channelsNote: "Thông tin số điện thoại và tài khoản Zalo chính thức sẽ được bến cập nhật.",
  photo: images.road,
  photoCaption: "Ảnh thực tế khu vực bến · Không phải bản đồ chỉ đường.",
};
