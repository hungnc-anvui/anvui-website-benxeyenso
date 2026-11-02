import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section } from "@/components/ui/section";
import { images } from "@/data/mock/images";
import { getAboutHighlights } from "@/data/repositories/station";
import { InfoCard } from "@/features/about/info-card";
import { paths } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Giới thiệu bến",
  description: "Một không gian phục vụ hành khách, doanh nghiệp và những hành trình liên tỉnh.",
};

/** Figma 02 · Giới thiệu bến — desktop 5:99, mobile 6:1530. */
export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="Giới thiệu"
        title={"Bến xe Yên Sở.\nKết nối từ một điểm đến."}
        description="Một không gian phục vụ hành khách, doanh nghiệp và những hành trình liên tỉnh."
      />
      <StationSpace />
    </>
  );
}

/** "Không gian bến" (5:117 / 6:1545). */
function StationSpace() {
  const highlights = getAboutHighlights();
  const gallery = [
    { image: images.lounge, className: "h-[220px] lg:h-[360px]" },
    { image: images.counter, className: "h-[300px] lg:h-[360px]" },
  ];

  return (
    <Section tone="white" labelledBy="station-space-title">
      <h2 id="station-space-title" className="sr-only">
        Không gian bến
      </h2>
      <div className="relative h-[260px] overflow-hidden rounded-xl md:h-[400px] lg:h-[510px]">
        <Image
          src={images.architecture.src}
          alt={images.architecture.alt}
          fill
          preload
          sizes="(min-width: 1264px) 1200px, 100vw"
          className="object-cover"
        />
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <li key={item.id}>
            <InfoCard item={item} />
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        {gallery.map(({ image, className }) => (
          <div key={image.src} className={`relative overflow-hidden rounded-lg ${className}`}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 588px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <ButtonLink href={paths.organization} className="w-full lg:w-[380px]">
        Tổ chức và hướng dẫn tại bến
      </ButtonLink>
    </Section>
  );
}
