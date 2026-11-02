import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getArticle, getArticles, getRelatedArticles } from "@/data/repositories/content";
import { ArticleSkeleton, ArticleView } from "@/features/news/article-view";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.image.src] },
  };
}

/** Figma 07 · Chi tiết tin (6:188 / 6:1922) + "Bài viết · …" variants for articles 2–9. */
export default function ArticlePage({ params }: PageProps<"/tin-tuc/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: Pick<PageProps<"/tin-tuc/[slug]">, "params">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <ArticleView article={article} related={getRelatedArticles(slug)} />;
}
