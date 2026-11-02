"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/routes";
import { cn } from "@/lib/cn";

const linkClass =
  "relative rounded-sm py-2 text-sm font-semibold text-navy transition-colors hover:text-primary";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop navigation with active state (needs <Suspense> because it reads the pathname). */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-5">
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                linkClass,
                active &&
                  "text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Static fallback rendered in the prerendered shell. */
export function NavLinksFallback() {
  return (
    <ul className="flex items-center gap-5">
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={linkClass}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
