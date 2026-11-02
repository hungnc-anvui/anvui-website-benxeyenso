import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SupportDock } from "@/components/layout/support-dock";
import { SupportProvider } from "@/features/support/support-provider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the production domain once it is known.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Bến xe Yên Sở · Kết nối hành trình Việt",
    template: "%s · Bến xe Yên Sở",
  },
  description:
    "Website Bến xe Yên Sở: tìm tuyến xe, chọn nhà vận tải, đặt vé trực tuyến và tra cứu vé điện tử. Dữ liệu trong bản demo chỉ để minh họa.",
};

export const viewport: Viewport = {
  themeColor: "#103b68",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex min-h-dvh flex-col">
        <SupportProvider>
          <a
            href="#main"
            className="sr-only z-50 rounded-sm bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            Bỏ qua đến nội dung chính
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <SupportDock />
        </SupportProvider>
      </body>
    </html>
  );
}
