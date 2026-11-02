import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { ImageAsset } from "@/types/domain";

/** Figma "YS/PhotoCard" (3:80 desktop / 3:115 mobile): 218px photo + body (padding 20, gap 12). */
export function PhotoCard({
  image,
  eyebrow,
  title,
  description,
  price,
  cta,
  href,
  action,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw",
}: {
  image: ImageAsset;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  price?: ReactNode;
  cta: string;
  href?: string;
  /** Custom action (e.g. a client button) instead of a link */
  action?: ReactNode;
  headingLevel?: "h2" | "h3";
  sizes?: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-white">
      <div className="relative h-[218px] w-full shrink-0">
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading className="text-title font-semibold text-navy">{title}</Heading>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
        {price ? <p className="text-price font-semibold text-primary">{price}</p> : null}
        <div className="mt-auto pt-1">
          {action ??
            (href ? (
              <Link href={href} className={buttonClass("secondary", "w-full")}>
                {cta}
                <span className="sr-only">: {title}</span>
              </Link>
            ) : null)}
        </div>
      </div>
    </article>
  );
}
