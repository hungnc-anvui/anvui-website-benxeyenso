import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumb, Section, SectionHeading } from "@/components/ui/section";
import type { EditorialArticle } from "@/data/mock/articles";
import { paths, searchHref } from "@/lib/routes";
import type { Article, ArticleBlock } from "@/types/domain";
import { ArticleCardGrid } from "./article-card-grid";


/**
 * Article template — Figma "07 · Chi tiết tin" (6:188 / 6:1922) and the eight "Bài viết · …"
 * variants (30:3558 → 30:4202 / 30:5458 → 30:6074): hero, cover + body + CTAs, related cards.
 */
export function ArticleView({ article, related }: { article: EditorialArticle; related: Article[] }) {
  return (
    <>
      <article aria-labelledby="article-title">
        <Section tone="paper">
          <Breadcrumb items={[{ label: "Tin tức", href: paths.news }]} />
          <h1 id="article-title" className="text-h3 font-bold whitespace-pre-line text-navy lg:text-h1">
            {article.headline ?? article.title}
          </h1>
          <p className="text-body text-muted">
            {article.category.toUpperCase()} · {article.sourceNote ?? "Nội dung biên tập mẫu"}
          </p>
        </Section>

        <Section tone="white">
          <div className="relative h-[260px] overflow-hidden rounded-xl lg:h-[520px]">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              preload
              sizes="(min-width: 1264px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="text-title font-semibold text-navy">{article.excerpt}</p>
          <ArticleBody blocks={article.body} />
          <div className="flex flex-col gap-4 lg:flex-row">
            <ButtonLink href={paths.gallery} variant="secondary" className="w-full lg:w-[300px]">
              Xem thư viện ảnh
            </ButtonLink>
            <ButtonLink href={searchHref()} className="w-full lg:w-[300px]">
              Tìm chuyến xe
            </ButtonLink>
          </div>
        </Section>
      </article>

      {related.length ? (
        <Section tone="paper" labelledBy="related-articles-title">
          <SectionHeading id="related-articles-title" size="lg" title="Có thể bạn quan tâm" />
          <ArticleCardGrid articles={related} />
        </Section>
      ) : null}
    </>
  );
}

/**
 * Renders the editorial blocks. Figma sets the intro copy in ink (#182b40) and the copy that
 * follows a heading in muted (#617488); every block sits on the section's 24px rhythm.
 */
function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  const firstHeading = blocks.findIndex((block) => block.type === "heading");
  return blocks.map((block, i) => {
    const intro = firstHeading === -1 || i < firstHeading;
    const key = `${block.type}-${i}`;
    switch (block.type) {
      case "paragraph":
        return (
          <p key={key} className={intro ? "text-body text-ink" : "text-body text-muted"}>
            {block.text}
          </p>
        );
      case "heading":
        return (
          <h2 key={key} className="text-h2 font-bold text-navy">
            {block.text}
          </h2>
        );
      case "image":
        return (
          <figure key={key} className="flex flex-col gap-3">
            <div className="relative h-[250px] overflow-hidden rounded-lg lg:h-[460px]">
              <Image
                src={block.image.src}
                alt={block.image.alt}
                fill
                sizes="(min-width: 1264px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
            {block.caption ? <figcaption className="text-sm text-muted">{block.caption}</figcaption> : null}
          </figure>
        );
      case "list":
        return (
          <ul key={key} className="flex list-disc flex-col gap-2 pl-6 text-body text-muted">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      case "quote":
        return (
          <blockquote key={key} className="border-l-4 border-primary pl-4 text-title font-semibold text-navy">
            {block.text}
          </blockquote>
        );
    }
  });
}

/** Suspense fallback while the slug resolves — mirrors the hero + cover proportions. */
export function ArticleSkeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải bài viết">
      <Section tone="paper">
        <div className="h-[18px] w-40 animate-pulse rounded-sm bg-mist" />
        <div className="h-[76px] w-full max-w-[720px] animate-pulse rounded-sm bg-mist lg:h-[120px]" />
        <div className="h-[26px] w-64 animate-pulse rounded-sm bg-mist" />
      </Section>
      <Section tone="white">
        <div className="h-[260px] animate-pulse rounded-xl bg-mist lg:h-[520px]" />
      </Section>
    </div>
  );
}
