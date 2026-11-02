import Image from "next/image";
import Link from "next/link";
import { images } from "@/data/mock/images";
import { cn } from "@/lib/cn";

/** Figma "Brand · Bến xe Yên Sở": original logo (kept at its own ratio) + wordmark. */
export function Brand({ onDark, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-3", className)} aria-label="Bến xe Yên Sở — Trang chủ">
      <Image src={images.logo.src} alt="" width={56} height={56} className="size-14 shrink-0 object-contain" />
      <span translate="no" className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("text-title font-semibold whitespace-nowrap", onDark ? "text-white" : "text-navy")}>
          BẾN XE YÊN SỞ
        </span>
        <span className={cn("text-xs font-medium whitespace-nowrap", onDark ? "text-white" : "text-muted")}>
          KẾT NỐI HÀNH TRÌNH VIỆT
        </span>
      </span>
    </Link>
  );
}
