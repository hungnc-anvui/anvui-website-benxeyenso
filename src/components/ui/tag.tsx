import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "sky" | "mint" | "paper" | "white";

const tones: Record<Tone, string> = {
  sky: "bg-sky text-primary",
  mint: "bg-mint text-green",
  paper: "bg-paper text-primary",
  white: "bg-white text-primary",
};

/** Pill tag — Figma "Tag · …" frames (radius 999, padding 8, 12/18 medium). */
export function Tag({ tone = "sky", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full p-2 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
