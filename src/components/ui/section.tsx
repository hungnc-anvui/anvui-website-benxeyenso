import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "paper" | "white" | "navy" | "sky";

const tones: Record<Tone, string> = {
  paper: "bg-paper",
  white: "bg-white",
  navy: "bg-navy text-white",
  sky: "bg-sky",
};

/** Full-bleed band with the 1200px content column; vertical padding 32 (mobile) / 56 (desktop). */
export function Section({
  tone = "paper",
  className,
  innerClassName,
  children,
  id,
  labelledBy,
}: {
  tone?: Tone;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("section-y", tones[tone], className)}>
      <div className={cn("container-page flex flex-col gap-6", innerClassName)}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, onDark, className }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return (
    <p className={cn("text-xs font-medium uppercase", onDark ? "text-white" : "text-green", className)}>{children}</p>
  );
}

/**
 * Eyebrow + title + description stack used by every content section.
 * `size="lg"` keeps 36/48 on mobile (some Figma mobile sections do), default drops to 28/38.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  note,
  onDark,
  size = "md",
  id,
  as: Heading = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  note?: ReactNode;
  onDark?: boolean;
  size?: "md" | "lg";
  id?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="flex flex-col gap-6">
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <Heading
        id={id}
        className={cn(
          "font-bold whitespace-pre-line",
          size === "lg" ? "text-h2" : "text-h3 lg:text-h2",
          onDark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Heading>
      {description ? <p className={cn("text-body", onDark ? "text-white" : "text-muted")}>{description}</p> : null}
      {note ? <p className={cn("text-xs font-medium", onDark ? "text-white/80" : "text-muted")}>{note}</p> : null}
    </div>
  );
}

export type Crumb = { label: string; href?: string };

/** "Trang chủ / …" — items with `href` are links, an item without one is the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ label: "Trang chủ", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-muted">
      <ol className="flex flex-wrap gap-1">
        {crumbs.map((item, i) => (
          <li key={item.label} className="flex gap-1">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Inner-page header: breadcrumb, H1 (28/38 mobile → 48/60 desktop) and lead. */
export function PageHero({
  crumb,
  title,
  description,
  tone = "paper",
  children,
}: {
  /** Current page label, or the full trail after "Trang chủ". */
  crumb: string | Crumb[];
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <Breadcrumb items={typeof crumb === "string" ? [{ label: crumb }] : crumb} />
      <h1 className="text-h3 font-bold whitespace-pre-line text-navy lg:text-h1">{title}</h1>
      {description ? <p className="text-body text-muted">{description}</p> : null}
      {children}
    </Section>
  );
}
