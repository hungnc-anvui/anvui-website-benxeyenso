import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { images } from "@/data/mock/images";
import { paths } from "@/lib/routes";

/** Figma "Thư viện ảnh · Khám phá quy mô" (30:4294) — on home and news pages. */
export function GalleryTeaserSection() {
  const side = [images.architecture, images.lounge];
  return (
    <Section tone="navy" labelledBy="gallery-teaser-title">
      <SectionHeading
        id="gallery-teaser-title"
        onDark
        size="lg"
        eyebrow="BẾN XE QUA NHỮNG GÓC NHÌN"
        title={"Rộng mở không gian.\nKết nối hành trình."}
        description="Từ toàn cảnh đến sảnh chờ — khám phá bến trước khi bạn đặt chân đến."
      />
      <div className="grid gap-6 lg:grid-cols-[792fr_384fr]">
        <Link
          href={paths.gallery}
          className="group relative block h-[260px] overflow-hidden rounded-xl lg:h-[430px]"
          aria-label={`Xem thư viện ảnh: ${images.aerial.alt}`}
        >
          <Image
            src={images.aerial.src}
            alt={images.aerial.alt}
            fill
            sizes="(min-width: 1024px) 792px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="grid gap-5">
          {side.map((img) => (
            <Link
              key={img.src}
              href={paths.gallery}
              className="group relative block h-[205px] overflow-hidden rounded-lg"
              aria-label={`Xem thư viện ảnh: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 384px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </Link>
          ))}
        </div>
      </div>
      <ButtonLink href={paths.gallery} variant="light" className="w-full lg:w-[320px]">
        Khám phá thư viện ảnh
      </ButtonLink>
    </Section>
  );
}
