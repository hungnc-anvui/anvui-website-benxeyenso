"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { mobileNav } from "@/lib/routes";

/** Figma state "Trạng thái · menu" — opened from the header menu icon. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // Read on open (event handler) — usePathname here would need a Suspense boundary in the root layout.
  const [current, setCurrent] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCurrent(window.location.pathname);
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Mở menu"
        className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-primary hover:bg-sky"
      >
        <Icon name="menu" />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Bến xe Yên Sở">
        <nav aria-label="Menu chính" className="flex flex-col gap-4">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === current ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={buttonClass("secondary", "w-full")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Dialog>
    </>
  );
}
