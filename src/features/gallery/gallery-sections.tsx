import Image from "next/image";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { GalleryAlbum, GalleryEntry } from "@/data/mock/gallery";
import { cn } from "@/lib/cn";
import { paths } from "@/lib/routes";
import { OpenPhotoButton } from "./gallery-lightbox";

/** Figma "Toàn cảnh nổi bật" (30:3149 / 30:5040): lead photo, summary and album shortcuts. */
export function GalleryHighlight({ photos, albums }: { photos: GalleryEntry[]; albums: GalleryAlbum[] }) {
  const lead = photos[0];
  return (
    <Section tone="white" labelledBy="gallery-highlight-title">
      <OpenPhotoButton
        index={0}
        aria-label={`Xem ảnh lớn: ${lead.title}`}
        className="group relative block h-[300px] w-full overflow-hidden rounded-xl lg:h-[580px]"
      >
        <Image
          src={lead.image.src}
          alt={lead.image.alt}
          fill
          preload
          sizes="(min-width: 1264px) 1200px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </OpenPhotoButton>
      <h2 id="gallery-highlight-title" className="text-title font-semibold text-navy">
        Bến xe trong một góc nhìn toàn cảnh
      </h2>
      <p className="text-sm text-muted">
        {photos.length} ảnh thực tế · {albums.length} chuyên mục · Nhấn vào ảnh để xem lớn
      </p>
      <nav aria-label="Chọn chuyên mục ảnh">
        <ul className="grid gap-3 lg:grid-cols-4">
          {albums.map((album) => (
            <li key={album.id}>
              <a href={`#${album.id}`} className={buttonClass("secondary", "w-full")}>
                {album.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Section>
  );
}

/**
 * Album section "0n / …" (30:3162, 30:3187, 30:3198, 30:3205): two photos per row on desktop
 * (588×360); the odd one out spans the full width (1200×480). Tones alternate paper / white.
 */
export function GalleryAlbumSection({
  album,
  number,
  photos,
}: {
  album: GalleryAlbum;
  number: number;
  photos: Array<{ photo: GalleryEntry; index: number }>;
}) {
  const titleId = `${album.id}-title`;
  const lastIsWide = photos.length % 2 === 1;
  return (
    <Section id={album.id} tone={number % 2 === 0 ? "white" : "paper"} labelledBy={titleId}>
      <SectionHeading id={titleId} size="lg" title={`${String(number).padStart(2, "0")} / ${album.title}`} />
      <ul className="grid gap-6 lg:grid-cols-2">
        {photos.map(({ photo, index }, i) => {
          const wide = lastIsWide && i === photos.length - 1;
          return (
            <li key={photo.id} className={cn("group relative flex flex-col gap-3", wide && "lg:col-span-2")}>
              <div className={cn("relative h-[250px] overflow-hidden rounded-lg", wide ? "lg:h-[480px]" : "lg:h-[360px]")}>
                <Image
                  src={photo.image.src}
                  alt={photo.image.alt}
                  fill
                  sizes={wide ? "(min-width: 1264px) 1200px, 100vw" : "(min-width: 1264px) 588px, (min-width: 1024px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="text-title font-semibold text-navy">{photo.title}</h3>
              {/* The ::after layer stretches the button over the whole tile (photo + title). */}
              <OpenPhotoButton
                index={index}
                className="w-fit text-sm font-semibold text-primary after:absolute after:inset-0 after:rounded-lg hover:underline"
              >
                Xem ảnh lớn <span aria-hidden="true">↗</span>
                <span className="sr-only">: {photo.title}</span>
              </OpenPhotoButton>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** Figma "Kết nối từ hình ảnh" (30:3216 / 30:5111). */
export function GalleryCta() {
  return (
    <Section tone="sky" labelledBy="gallery-cta-title">
      <SectionHeading id="gallery-cta-title" size="lg" title="Sẵn sàng khám phá bến?" />
      <ButtonLink href={paths.organization} className="w-full lg:w-[360px]">
        Hướng dẫn & tổ chức bến
      </ButtonLink>
    </Section>
  );
}
