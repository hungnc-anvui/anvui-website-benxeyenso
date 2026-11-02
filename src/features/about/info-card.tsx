import type { InfoItem } from "@/data/repositories/station";
import { cn } from "@/lib/cn";

/**
 * Soft-blue info card used on Giới thiệu (5:120), Tổ chức bến (6:366) and
 * Điều kiện vé (6:452): radius 12, padding 16, gap 8, title 14/22 semibold primary,
 * text 14/22 muted. With `anchor`, the card gets the item id and highlights when it
 * is the URL :target (deep links such as /dieu-kien-ve#doi-huy-hanh-ly).
 */
export function InfoCard({
  item,
  anchor,
  as: Heading = "h3",
  className,
}: {
  item: InfoItem;
  anchor?: boolean;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <article
      id={anchor ? item.id : undefined}
      aria-labelledby={`${item.id}-title`}
      className={cn(
        "flex h-full scroll-mt-6 flex-col gap-2 rounded-md bg-sky p-4",
        anchor && "target:outline-2 target:outline-offset-2 target:outline-primary",
        className,
      )}
    >
      <Heading id={`${item.id}-title`} className="text-sm font-semibold text-primary">
        {item.title}
      </Heading>
      <p className="text-sm text-muted">{item.text}</p>
    </article>
  );
}
