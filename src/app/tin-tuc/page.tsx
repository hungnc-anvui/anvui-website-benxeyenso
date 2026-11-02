import type { Metadata } from "next";
import { GalleryTeaserSection } from "@/components/common/gallery-teaser";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { getArticles, getFeaturedArticle } from "@/data/repositories/content";
import { ArticleCardGrid } from "@/features/news/article-card-grid";
import { FeaturedStory } from "@/features/news/featured-story";

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Tin tức, cẩm nang hành khách và góc ảnh của Bến xe Yên Sở: hoạt động bến, hướng dẫn đặt vé, tiện ích và dịch vụ.",
};

/** Figma 06 · Tin tức — desktop 5:437, mobile 6:1844. */
export default function NewsPage() {
  return (
    <>
      <PageHero
        crumb="Tin tức"
        title="Thông tin mới từ Yên Sở."
        description="Hoạt động bến · Hướng dẫn hành khách · Tiện ích & dịch vụ"
      />
      <FeaturedStory article={getFeaturedArticle()} />
      <Section tone="paper" labelledBy="all-news-title">
        <SectionHeading
          id="all-news-title"
          size="lg"
          title="Tin tức & cẩm nang hành khách"
          note="Nội dung biên tập mẫu phục vụ thiết kế; bến duyệt trước khi đăng."
        />
        <ArticleCardGrid articles={getArticles()} />
      </Section>
      <GalleryTeaserSection />
    </>
  );
}
