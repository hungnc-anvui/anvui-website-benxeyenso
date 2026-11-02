import { Suspense } from "react";
import { Brand } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, NavLinksFallback } from "./nav-links";

/** Figma "Header" — 96px desktop (padding 20/120), 88px mobile (padding 16). */
export function SiteHeader() {
  return (
    <header className="relative z-40 bg-white">
      <div className="container-page flex items-center gap-5 py-4 lg:py-5">
        <Brand className="xl:w-[330px] xl:shrink-0" />
        <nav aria-label="Điều hướng chính" className="ml-auto hidden xl:ml-0 xl:block">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto xl:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
