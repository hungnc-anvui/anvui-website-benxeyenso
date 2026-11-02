import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { paths } from "@/lib/routes";
import type { Operator } from "@/types/domain";

/** Figma "YS/OperatorCard" (3:89 desktop / 3:124 mobile). */
export function OperatorCard({ operator, headingLevel: Heading = "h3" }: { operator: Operator; headingLevel?: "h2" | "h3" }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-lg bg-white p-6">
      <Tag>{operator.code}</Tag>
      <Heading className="text-title font-semibold text-navy">{operator.name}</Heading>
      <p className="text-sm text-muted">
        {operator.mainDestination} · {operator.vehicleType}
      </p>
      <p className="text-sm text-muted">{operator.summary}</p>
      <Link href={paths.operator(operator.slug)} className={buttonClass("secondary", "mt-auto w-full")}>
        Xem doanh nghiệp
        <span className="sr-only">: {operator.name}</span>
      </Link>
    </article>
  );
}
