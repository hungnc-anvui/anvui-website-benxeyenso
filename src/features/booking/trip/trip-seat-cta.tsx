"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { formatDateLong, formatLunar, isIsoDay } from "@/lib/format";
import { useToday } from "@/lib/use-today";
import { seatsHref } from "../seats/href";

const ctaClass = "w-full lg:w-80";

/**
 * Price summary (children) + travel day + "Chọn chỗ ngồi". The CTA keeps the day picked
 * on the results page (`?date=`); without one the seat page falls back to today.
 * Needs a <Suspense> parent (useSearchParams) — use TripSeatCtaFallback there.
 */
export function TripSeatCta({ tripId, children }: { tripId: string; children: ReactNode }) {
  const raw = useSearchParams().get("date");
  const today = useToday();
  const date = isIsoDay(raw) && (!today || raw >= today) ? raw : null;
  const shownDate = date ?? today;

  return (
    <>
      <div className="flex flex-col gap-1">
        {children}
        {shownDate ? (
          <p className="text-sm text-muted">
            Ngày đi: <span className="font-semibold text-ink">{formatDateLong(shownDate)}</span> · ÂL{" "}
            {formatLunar(shownDate)}
          </p>
        ) : null}
      </div>
      <ButtonLink href={seatsHref(tripId, date)} className={ctaClass}>
        Chọn chỗ ngồi
      </ButtonLink>
    </>
  );
}

/** Suspense fallback: same price block and button, no date (the seat page then uses today). */
export function TripSeatCtaFallback({ tripId, children }: { tripId: string; children: ReactNode }) {
  return (
    <>
      <div className="flex flex-col gap-1">{children}</div>
      <ButtonLink href={seatsHref(tripId)} className={ctaClass}>
        Chọn chỗ ngồi
      </ButtonLink>
    </>
  );
}
