import { articles } from "@/data/mock/articles";
import { galleryAlbums, galleryPhotos } from "@/data/mock/gallery";

export function getArticles() {
  return articles;
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticle() {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getRelatedArticles(slug: string, count = 3) {
  return articles.filter((a) => a.slug !== slug).slice(0, count);
}

export function getGalleryPhotos() {
  return galleryPhotos;
}

/** Albums of the gallery page, in display order ("01 / Toàn cảnh & kiến trúc" …). */
export function getGalleryAlbums() {
  return galleryAlbums;
}
