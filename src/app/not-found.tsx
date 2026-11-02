import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { paths, searchHref } from "@/lib/routes";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <Section tone="paper" innerClassName="items-start py-10 lg:py-20">
      <p className="text-xs font-medium text-green">LỖI 404</p>
      <h1 className="text-h3 font-bold text-navy lg:text-h1">Không tìm thấy trang bạn cần.</h1>
      <p className="max-w-[600px] text-body text-muted">
        Đường dẫn có thể đã thay đổi hoặc nội dung chưa được công bố. Bạn có thể quay về trang chủ hoặc tìm chuyến xe
        ngay.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <ButtonLink href={paths.home} className="sm:w-60">
          Về trang chủ
        </ButtonLink>
        <ButtonLink href={searchHref()} variant="secondary" className="sm:w-60">
          Tìm chuyến xe
        </ButtonLink>
      </div>
    </Section>
  );
}
