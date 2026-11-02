import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { paths } from "@/lib/routes";
import type { Article } from "@/types/domain";

/** Figma "Tin nổi bật" (30:3408 desktop / 30:5300 mobile): photo 688×430 + copy column 480. */
export function FeaturedStory({ article }: { article: Article }) {
  const href = paths.article(article.slug);
  return (
    <Section tone="white" labelledBy="featured-story-title">
      <div className="grid gap-8 lg:grid-cols-[688fr_480fr]">
        {/* Duplicate of the CTA link for pointer users; kept out of the tab order and the a11y tree. */}
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="group relative block h-[250px] overflow-hidden rounded-xl lg:h-[430px]"
        >
          <Image
            src={article.image.src}
            alt=""
            fill
            preload
            sizes="(min-width: 1024px) 688px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex flex-col items-start gap-5">
          <Tag>TIÊU ĐIỂM · {article.category.toUpperCase()}</Tag>
          <h2 id="featured-story-title" className="text-h3 font-bold text-navy lg:text-h2">
            {article.title}
          </h2>
          <p className="text-body text-muted">{article.excerpt}</p>
          <ButtonLink href={href} className="w-full lg:w-[280px]">
            Đọc câu chuyện
            <span className="sr-only">: {article.title}</span>
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
