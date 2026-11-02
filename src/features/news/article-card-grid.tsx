import { PhotoCard } from "@/components/common/photo-card";
import { paths } from "@/lib/routes";
import type { Article } from "@/types/domain";

/** Grid of "YS/PhotoCard" news cards — 3 columns on desktop, stacked on mobile (Figma "Articles 0/3/6"). */
export function ArticleCardGrid({ articles }: { articles: Article[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <PhotoCard
            image={article.image}
            eyebrow={article.category.toUpperCase()}
            title={article.title}
            description={article.excerpt}
            cta="Đọc bài viết"
            href={paths.article(article.slug)}
          />
        </li>
      ))}
    </ul>
  );
}
