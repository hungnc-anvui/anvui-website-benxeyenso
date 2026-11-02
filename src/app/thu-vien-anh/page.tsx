import type { Metadata } from "next";
import { PageHero } from "@/components/ui/section";
import { getGalleryAlbums, getGalleryPhotos } from "@/data/repositories/content";
import { GalleryLightboxProvider } from "@/features/gallery/gallery-lightbox";
import { GalleryAlbumSection, GalleryCta, GalleryHighlight } from "@/features/gallery/gallery-sections";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
  description:
    "Thư viện ảnh Bến xe Yên Sở: toàn cảnh kiến trúc, không gian hành khách, khu vực phương tiện và lễ khai trương.",
};

/** Figma 21 · Thư viện ảnh bến xe — desktop 30:3131, mobile 30:5025; lightbox "Xem ảnh · …". */
export default function GalleryPage() {
  const photos = getGalleryPhotos();
  const albums = getGalleryAlbums();
  const indexed = photos.map((photo, index) => ({ photo, index }));
  return (
    <>
      <PageHero
        crumb="Thư viện ảnh"
        title={"Cảm nhận Yên Sở.\nQua từng góc nhìn."}
        description="Toàn cảnh kiến trúc, không gian hành khách và những khoảnh khắc tại bến."
      />
      <GalleryLightboxProvider photos={photos}>
        <GalleryHighlight photos={photos} albums={albums} />
        {albums.map((album, i) => (
          <GalleryAlbumSection
            key={album.id}
            album={album}
            number={i + 1}
            photos={indexed.filter(({ photo }) => photo.album === album.id)}
          />
        ))}
      </GalleryLightboxProvider>
      <GalleryCta />
    </>
  );
}
