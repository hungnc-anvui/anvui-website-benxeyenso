import Link from "next/link";
import { SupportButton } from "@/features/support/support-provider";
import { paths, searchHref } from "@/lib/routes";
import { Brand } from "./brand";

const linkClass = "text-sm text-white hover:underline";

const columns = [
  {
    title: "HÀNH KHÁCH",
    links: [
      { label: "Tìm kiếm đặt vé", href: searchHref() },
      { label: "Tra cứu vé", href: paths.lookup },
      { label: "Hướng dẫn tại bến", href: paths.organization },
    ],
  },
  {
    title: "VỀ BẾN XE",
    links: [
      { label: "Giới thiệu", href: paths.about },
      { label: "Doanh nghiệp vận tải", href: paths.operators },
      { label: "Tin tức", href: paths.news },
    ],
  },
] as const;

/** Figma "Footer" (3:386). */
export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      {/* pb-24 below 1360px keeps the floating support button clear of the last line. */}
      <div className="container-page flex flex-col gap-6 pt-8 pb-24 lg:pt-12 min-[1360px]:pb-12">
        <Brand onDark className="w-fit" />
        <p className="text-title font-semibold">Vận tải công nghệ. Hành trình liền mạch.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
              <p className="text-xs font-medium">{col.title}</p>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="KẾT NỐI" className="flex flex-col gap-3">
            <p className="text-xs font-medium">KẾT NỐI</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href={paths.contact} className={linkClass}>
                  Liên hệ & chỉ đường
                </Link>
              </li>
              <li>
                <SupportButton view="support" className={`${linkClass} text-left`}>
                  Zalo · Gọi điện · AI
                </SupportButton>
              </li>
              <li>
                <Link href={paths.policy} className={linkClass}>
                  Điều kiện vé & bảo mật
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <hr className="border-muted" />
        <p className="text-xs font-medium">
          © Bến xe Yên Sở · Bản thiết kế website · Lịch và giá trong bản mẫu chỉ để minh họa.
        </p>
        <Link
          href={paths.gallery}
          className="w-fit text-sm font-semibold hover:underline"
        >
          Thư viện ảnh Bến xe Yên Sở <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </footer>
  );
}
