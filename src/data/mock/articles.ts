import type { Article } from "@/types/domain";
import { images } from "./images";

/**
 * Presentation extras for the article template (kept out of the shared domain type).
 * - `headline`: H1 on the article page when it differs from the card title (manual line break).
 * - `sourceNote`: second half of the meta line under the H1 ("HOẠT ĐỘNG BẾN · Nội dung giới thiệu mẫu").
 */
export type EditorialArticle = Article & {
  headline?: string;
  sourceNote?: string;
};

/**
 * Editorial sample content (Figma: "Nội dung biên tập mẫu phục vụ thiết kế; bến duyệt trước khi đăng").
 * Order matches the news grid on 06 · Tin tức. Bodies follow the article frames
 * "07 · Chi tiết tin" (6:188) and "Bài viết · …" (30:3558 → 30:4202): the excerpt is the lead,
 * then intro paragraph, heading, paragraph and a closing photo.
 */
export const articles: EditorialArticle[] = [
  {
    slug: "yen-so-ket-noi-nhung-hanh-trinh-moi",
    category: "Hoạt động bến",
    title: "Yên Sở — kết nối những hành trình mới",
    headline: "Yên Sở — kết nối\nnhững hành trình mới.",
    sourceNote: "Nội dung giới thiệu mẫu",
    excerpt: "Những hình ảnh tại lễ khai trương và góc nhìn về không gian phục vụ hành khách.",
    image: images.opening,
    publishedAt: "2026-10-11",
    readMinutes: 4,
    featured: true,
    body: [
      {
        type: "paragraph",
        text: "Hình ảnh lễ khai trương ghi dấu một điểm kết nối mới cho những hành trình. Từ website, hành khách có thể khám phá không gian bến, tìm hiểu nhà vận tải và chuẩn bị thông tin trước khi khởi hành.",
      },
      { type: "heading", text: "Khám phá bến trước chuyến đi" },
      {
        type: "paragraph",
        text: "Thư viện ảnh đưa bạn từ góc nhìn toàn cảnh đến quầy vé và sảnh chờ. Khi đặt vé, hãy kiểm tra đúng doanh nghiệp, điểm đón và giờ có mặt được ghi trên vé.",
      },
      { type: "image", image: images.opening2 },
    ],
  },
  {
    slug: "mot-goc-nhin-toan-canh-ben-xe-yen-so",
    category: "Không gian bến",
    title: "Một góc nhìn toàn cảnh Bến xe Yên Sở",
    excerpt: "Khám phá kiến trúc, không gian và sự kết nối của bến qua bộ ảnh toàn cảnh.",
    image: images.aerial,
    publishedAt: "2026-10-12",
    readMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Từ trên cao, các khối công trình và khu vực phương tiện hiện lên trong cùng một góc nhìn. Bộ ảnh giúp hành khách hình dung không gian trước khi đến bến.",
      },
      { type: "heading", text: "Từ tổng thể đến từng khu vực" },
      {
        type: "paragraph",
        text: "Tiếp tục xem ảnh mặt tiền, quầy vé và sảnh chờ để làm quen với không gian. Ảnh giới thiệu không thay thế sơ đồ chỉ dẫn thực tế tại bến.",
      },
      { type: "image", image: images.architecture },
    ],
  },
  {
    slug: "dat-ve-truc-tuyen-trong-4-buoc-ro-rang",
    category: "Hướng dẫn",
    title: "Đặt vé trực tuyến trong 4 bước rõ ràng",
    excerpt: "Chọn hành trình, chọn chuyến, thanh toán và nhận thông tin xác nhận.",
    image: images.counter,
    publishedAt: "2026-10-13",
    readMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Bắt đầu bằng điểm đi, điểm đến và ngày khởi hành. Bộ chọn ngày hiển thị cả dương lịch và âm lịch để bạn đối chiếu thuận tiện. Nhấn “Tìm chuyến xe” để xem lựa chọn.",
      },
      { type: "heading", text: "Kiểm tra kỹ trước khi thanh toán" },
      {
        type: "paragraph",
        text: "Chọn chuyến phù hợp, nhấn “Đặt chỗ” và điền thông tin liên hệ. Kiểm tra điểm đón, giá và điều kiện vé, sau đó chọn cổng thanh toán. Chỉ lên kế hoạch theo vé đã được xác nhận thành công.",
      },
      { type: "image", image: images.facade },
    ],
  },
  {
    slug: "ghe-tham-khong-gian-cho-truoc-gio-len-xe",
    category: "Tiện ích",
    title: "Ghé thăm không gian chờ trước giờ lên xe",
    excerpt: "Hình ảnh khu vực ghế chờ và quầy thông tin dành cho hành khách.",
    image: images.lounge,
    publishedAt: "2026-10-14",
    readMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Sảnh chờ là nơi hành khách nghỉ chân và chuẩn bị trước chuyến đi. Hãy theo dõi thông báo, giữ hành lý bên mình và kiểm tra giờ khởi hành trên vé.",
      },
      { type: "heading", text: "Chủ động để không lỡ chuyến" },
      {
        type: "paragraph",
        text: "Xác định khu vực lên xe theo hướng dẫn thực tế. Khi chưa rõ thông tin, hãy hỏi nhân viên tại quầy hoặc sử dụng các kênh hỗ trợ trên website.",
      },
      { type: "image", image: images.counter },
    ],
  },
  {
    slug: "chuan-bi-duong-den-ben-va-diem-don",
    category: "Hướng dẫn",
    title: "Chuẩn bị đường đến bến và điểm đón",
    excerpt: "Các thông tin cần kiểm tra để đến đúng bến, đúng chuyến và đúng giờ.",
    image: images.road,
    publishedAt: "2026-10-15",
    readMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "Trước khi xuất phát, kiểm tra tên bến, điểm đón và giờ có mặt trên vé. Dự trù thời gian di chuyển và thời gian tìm khu vực lên xe, đặc biệt khi mang theo nhiều hành lý.",
      },
      { type: "heading", text: "Luôn đối chiếu với thông tin trên vé" },
      {
        type: "paragraph",
        text: "Ảnh toàn cảnh giúp nhận diện công trình nhưng không thay thế hướng dẫn đường đi. Nếu chưa rõ điểm đón, hãy liên hệ kênh hỗ trợ chính thức trước khi di chuyển.",
      },
      { type: "image", image: images.hero },
    ],
  },
  {
    slug: "kiem-tra-chuyen-xe-truoc-khi-dat-cho",
    category: "Hành khách",
    title: "Kiểm tra chuyến xe trước khi đặt chỗ",
    excerpt: "Nhà vận tải, lộ trình, tiện ích và điều kiện vé là những thông tin cần biết.",
    image: images.bus,
    publishedAt: "2026-10-16",
    readMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Trên danh sách chuyến, đối chiếu tên doanh nghiệp, giờ đi, điểm trả và loại xe. Tiện ích cần được xác nhận theo đúng chuyến bạn lựa chọn.",
      },
      { type: "heading", text: "Hiểu rõ quyền lợi của mình" },
      {
        type: "paragraph",
        text: "Xem giá niêm yết, giá sau khuyến mại, điều kiện voucher và tổng tiền. Hỏi rõ quy định hành lý hoặc nhu cầu hỗ trợ đặc biệt trước khi hoàn tất thanh toán.",
      },
      { type: "image", image: images.lounge },
    ],
  },
  {
    slug: "luu-ve-dien-tu-san-sang-cho-hanh-trinh",
    category: "Vé điện tử",
    title: "Lưu vé điện tử, sẵn sàng cho hành trình",
    excerpt: "Giữ mã vé và thông tin liên hệ để thuận tiện tra cứu khi cần.",
    image: images.facade,
    publishedAt: "2026-10-17",
    readMinutes: 2,
    body: [
      {
        type: "paragraph",
        text: "Sau khi đặt vé thành công, kiểm tra tên người đi, hành trình, ngày giờ và mã vé. Lưu thông tin xác nhận để có thể mở lại khi đến bến.",
      },
      { type: "heading", text: "Bảo vệ thông tin đặt vé" },
      {
        type: "paragraph",
        text: "Không chia sẻ công khai mã QR, mã xác thực hoặc thông tin cá nhân trên vé. Nếu không tìm thấy vé, dùng chức năng tra cứu hoặc liên hệ bộ phận hỗ trợ.",
      },
      { type: "image", image: images.counter },
    ],
  },
  {
    slug: "ket-noi-doanh-nghiep-voi-hanh-khach",
    category: "Doanh nghiệp",
    title: "Kết nối doanh nghiệp với hành khách",
    excerpt: "Hồ sơ nhà vận tải giúp khách tìm tuyến và thông tin dịch vụ dễ dàng hơn.",
    image: images.architecture,
    publishedAt: "2026-10-18",
    readMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Trang thông tin doanh nghiệp tập hợp nội dung giới thiệu, tuyến khai thác, tiện ích và các kênh liên hệ. Hành khách có thể chuyển trực tiếp sang danh sách chuyến phù hợp.",
      },
      { type: "heading", text: "Thông tin rõ ràng, lựa chọn thuận tiện" },
      {
        type: "paragraph",
        text: "Doanh nghiệp phối hợp với bến cập nhật thương hiệu, điểm bán vé và điều kiện phục vụ. Chỉ công bố các tuyến, lịch và thông tin liên hệ sau khi đã được xác nhận.",
      },
      { type: "image", image: images.road },
    ],
  },
  {
    slug: "nhung-khoanh-khac-tai-le-khai-truong",
    category: "Góc ảnh",
    title: "Những khoảnh khắc tại lễ khai trương",
    excerpt: "Cùng nhìn lại sự kiện qua các hình ảnh được cung cấp từ bến.",
    image: images.opening2,
    publishedAt: "2026-10-19",
    readMinutes: 2,
    body: [
      {
        type: "paragraph",
        text: "Bộ ảnh ghi lại không khí lễ khai trương và những khoảnh khắc kết nối tại Bến xe Yên Sở. Hình ảnh được trình bày lớn để người xem theo dõi rõ hơn.",
      },
      { type: "heading", text: "Tiếp tục khám phá Yên Sở" },
      {
        type: "paragraph",
        text: "Ngoài ảnh sự kiện, thư viện còn có góc nhìn kiến trúc, không gian hành khách và khu vực xe. Chọn một chuyên mục để xem trọn bộ ảnh.",
      },
      { type: "image", image: images.opening },
    ],
  },
];
