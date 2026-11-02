# Bến xe Yên Sở — Implementation conventions

Read with `yen-so-design-inventory.md` (screens, tokens, components) and `yen-so-progress.md` (status).

## Next.js 16.4 rules that matter here (`cacheComponents: true`, `partialPrefetching: true`)

- `params` / `searchParams` are Promises. Reading them (or `cookies()`/`headers()`) must happen **inside `<Suspense>`**:
  keep `page.tsx` non-async and pass the promise to an async child wrapped in `<Suspense>`, or read in a Client Component.
- `useSearchParams()` always needs a `<Suspense>` boundary. `usePathname()` too under dynamic routes.
- Never call `new Date()`, `Date.now()`, `Math.random()` in Server Components (prerender error). Use `useToday()` (`src/lib/use-today.ts`) or client event handlers.
- Dynamic routes: export `generateStaticParams` (must return ≥ 1 item), call `notFound()` for unknown slugs, await `params` inside Suspense.
- Do **not** export `dynamic`, `revalidate`, `dynamicParams`, `runtime` (they error with Cache Components).
- `next/image`: `priority` is deprecated → use `preload` on the LCP image; always pass `sizes` with `fill`; don't set `quality` (only 75 allowed).
- Client state survives navigation (React `<Activity>`): close menus/dialogs on navigation.
- `error.tsx` props are `{ error, retry }`.
- Page metadata: `export const metadata = { title: "…" }` (root template appends " · Bến xe Yên Sở").
- Page props types are global: `PageProps<"/tin-tuc/[slug]">`, `LayoutProps<"/">`.

## Code conventions

- Server Components by default; `"use client"` only for interactive leaves (forms, dialogs, filters, store readers).
- Tokens only — use Tailwind theme classes (`text-navy`, `bg-sky`, `text-h2`, `rounded-lg`, `container-page`, `section-y`…), not raw hex.
- Mobile-first; `lg:` switches to the 1440 layout. Mobile content width 343 (16px gutters).
- Reuse: `Section`, `SectionHeading`, `PageHero`, `Eyebrow` (`components/ui/section.tsx`), `Button`/`ButtonLink`/`buttonClass`, `FieldButton`/`TextField`/`TextAreaField`, `Dialog`, `Tag`, `Icon`, `PhotoCard`, `OperatorCard`, `TripCard`.
- Support dialogs from anywhere: `const { open } = useSupport(); open("call" | "zalo" | "assistant" | "support" | "directions" | "requestSent" | "otherTrip")`, or `<SupportButton view="…">` in Server Components.
- Links: use `paths` / `searchHref()` from `src/lib/routes.ts`.
- Data: only through `src/data/repositories/*` (mock, synchronous). Formatting: `src/lib/format.ts` (`formatVnd`, `formatDateField`, `formatDateLong`, `formatLunar`…).
- Booking state: `src/stores/booking-store.ts` (`useBookingDraft`, `bookingActions`, `priceBooking`, `useTickets`, `findTicket`…).
- Vietnamese copy from Figma verbatim. Mock data in Vietnamese. No lorem ipsum, no placeholders left in completed screens.
- Accessibility: real `<button>`/`<a>`, labels on inputs, `aria-live` for async results, visible focus (global `:focus-visible`), alt text.

## Verifying against Figma

- Compact outlines of every frame (generated from the bridge): scratchpad `figma/desktop/*.txt`, `figma/mobile/*.txt`, `figma/ds/*.txt`
  (absolute path in the progress doc of the session; regenerate with `get_node` if missing).
  Line format: `id Type "name" WxH@x,y bg=fill bd=stroke r=radius AL:direction gGap pad=t/r/b/l T[size/lineHeight wWeight] "text"`.
- Figma screenshots (1440 / 375): `node_modules/.cache/figma-shots/{d|m}-*.png`, states `s-*.png`.
- Crop tall images: `node node_modules/.cache/crop.js <in.png> <outPrefix> <chunkHeight> [top] [bottom]`.
- Render the app (dev server on :3000) with device emulation:
  `node node_modules/.cache/cdp.mjs plan.json` where plan = `{"width":375,"steps":[{"goto":"/tuyen-xe"},{"shot":"routes-m"}]}`.
  Steps: `goto`, `eval` (JS, e.g. click), `wait`, `check` (returns value), `shot` (full page, reports horizontal overflow). Output in `node_modules/.cache/shots/`.
- Quality gates: `npx tsc --noEmit -p .`, `npx eslint src`, and finally `npx next build`.
