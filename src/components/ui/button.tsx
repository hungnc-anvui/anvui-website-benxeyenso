import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Figma component "YS/Button" (2:88): Primary / Secondary / Light / Ghost / Disabled. */
export type ButtonVariant = "primary" | "secondary" | "light" | "ghost";

const base =
  "inline-flex min-h-13 items-center justify-center gap-2 rounded-sm px-3 py-3 text-center text-body font-semibold transition-colors disabled:pointer-events-none disabled:bg-mist disabled:text-muted aria-disabled:pointer-events-none aria-disabled:bg-mist aria-disabled:text-muted";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-sky text-navy hover:bg-sky-hover",
  light: "bg-white text-navy hover:bg-sky",
  ghost: "bg-transparent text-navy hover:bg-sky",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
