# Bến xe Yên Sở — Progress tracker

- **Current phase:** All phases completed (1 Foundation + Home · 2 Public pages · 3 Booking flow · 4 QA)
- **Model:** Claude Opus 5.5 (`claude-opus-5-5`) — lead agent + 5 parallel sub-agents (+1 review sub-agent)
- **Stack:** Next.js 16.4.4 (App Router, `cacheComponents`, `partialPrefetching`), React 19.3, Tailwind v4, TypeScript. No new dependencies.
- **Work split (disjoint file ownership):** A `/gioi-thieu` `/to-chuc-ben` `/lien-he` `/dieu-kien-ve` · B `/tuyen-xe` `/doanh-nghiep` `/doanh-nghiep/[slug]` · C `/tin-tuc` `/tin-tuc/[slug]` `/thu-vien-anh` · D `/dat-ve` `/dat-ve/chuyen/[tripId]` `/dat-ve/chon-cho` · E `/dat-ve/thanh-toan` `/dat-ve/thanh-toan-qr` `/dat-ve/ve-dien-tu` `/tra-cuu-ve`. Lead: foundation, homepage, store, integration, QA.
- **Figma working files (session scratchpad, regenerate if gone):** outlines `C:/Users/Admin/AppData/Local/Temp/claude/d--Projects-anvui-website-benxeyenso/371d088f-5106-4e5a-a078-7d2765e0def8/scratchpad/figma/{desktop,mobile,ds}/*.txt` (generator `scratchpad/outline.js` over `get_document` / `get_node` JSON); screenshots `node_modules/.cache/figma-shots/`; QA tools `node_modules/.cache/{cdp.mjs,crop.js,cmp.js,make-e2e.mjs}` (git-ignored).

## Screens

| Màn | Route | Status |
|---|---|---|
| Foundation (tokens, font, header, footer, support dock, dialogs, 404, error) | — | COMPLETED |
| 01 Trang chủ | `/` | COMPLETED |
| 02 Giới thiệu | `/gioi-thieu` | COMPLETED |
| 03 Danh sách tuyến | `/tuyen-xe` | COMPLETED |
| 04 Danh sách doanh nghiệp (+ operatorSearch) | `/doanh-nghiep` | COMPLETED |
| 05 Chi tiết doanh nghiệp (6 operators) | `/doanh-nghiep/[slug]` | COMPLETED |
| 06 Tin tức | `/tin-tuc` | COMPLETED |
| 07 Chi tiết tin + 8 bài biến thể | `/tin-tuc/[slug]` | COMPLETED |
| 08 Liên hệ (form) | `/lien-he` | COMPLETED |
| 09 Tổ chức bến | `/to-chuc-ben` | COMPLETED |
| 15 Điều kiện vé & bảo mật | `/dieu-kien-ve` | COMPLETED |
| 21 Thư viện ảnh + lightbox ×10 | `/thu-vien-anh` | COMPLETED |
| 10 Kết quả tìm chuyến (+ filters) | `/dat-ve` | COMPLETED |
| 11 Chi tiết chuyến | `/dat-ve/chuyen/[tripId]` | COMPLETED |
| 12 / 12B Chọn chỗ (+ seatPreview) | `/dat-ve/chon-cho` | COMPLETED |
| 13 / 13B Thông tin & thanh toán (+ voucher, method) | `/dat-ve/thanh-toan` | COMPLETED |
| 14 / 14B Thanh toán QR | `/dat-ve/thanh-toan-qr` | COMPLETED |
| 15 Vé điện tử (+ saved) | `/dat-ve/ve-dien-tu` | COMPLETED |
| 16 Tra cứu vé (+ otp) | `/tra-cuu-ve` | COMPLETED |

## Implemented features

- Design tokens from Figma page 2:2 in `globals.css` (`@theme`), Be Vietnam Pro via `next/font`; real assets exported from Figma (logo + 10 photos + QR + 16 icons).
- Header (desktop nav with active state ≥1280px, menu dialog below), footer, floating support dock (Gọi/Zalo/AI desktop, phone button mobile), skip link, Vietnamese 404 + error boundary.
- Support dialogs: support, call, zalo, scripted AI assistant (suggested questions + keyword answers + free text), directions, requestSent, otherTrip. No unverified hotline/Zalo numbers.
- Search: một chiều / khứ hồi, destination picker with search, dương + âm lịch calendar (past days disabled, UTC+7, Can Chi year), validation → `/dat-ve?to=&date=&return=`.
- Routes page filter by destination; routes without schedule open "otherTrip". Operators live search (diacritic-insensitive) + empty state + operatorSearch dialog; 6 operator profiles with their routes/prices.
- News: featured story, 9 articles with full Figma copy, related articles; gallery with 4 albums + lightbox (prev/next wrap, arrow keys, Esc, focus return).
- Contact form with Vietnamese validation → requestSent dialog.
- Booking: results with filters (giờ đi, loại xe, tiện ích) + sort, seats left including demo tickets issued in this browser; trip detail with timeline; seat map (2 decks, available/selected/sold/focus states, max 5 seats, sold seat → "Chỗ vừa có người giữ"); checkout with validation, voucher YENSO20 (list dialog + manual code + remove), payment method (QR; card/wallet explained), terms; QR page with 10-minute seat hold countdown and simulated status check; e-ticket (QR, code, totals, "Lưu vé"); lookup by code + phone → OTP (demo code shown) → ticket.
- Booking state: `src/stores/booking-store.ts` — draft in sessionStorage (survives reloads), tickets in localStorage; the reservation code on the QR page becomes the ticket code (Figma uses one YS code for both).

## Decisions / deviations

- `app/` moved to `src/app`; tsconfig alias `@/*` → `./src/*` (required for the `src/` layout).
- Sample date 16/10/2026 is in the past (today 02/11/2026) and past days must be disabled, so schedules run daily and search defaults to today (computed client-side).
- Voucher YENSO20 expiry 31/12/2026 in mock data so the demo stays usable (Figma: "Hạn minh họa: 31/10/2026").
- Sleeper coach modelled with two decks (A01–A12, B01–B12) so "Còn 8 chỗ" and the Figma lower-deck pattern both hold; a small deck switch was added.
- "Điểm đi" opens a dialog explaining departures are from Bến xe Yên Sở (Figma links it to the location overlay).
- Dialogs add a dimmed backdrop (Figma overlays use none).
- Operator detail lists every route of the operator (Figma shows one); trip detail adds a price/date block; QR page adds a bank-info box; ticket adds totals.
- Filters dialog uses toggle chips (Figma shows a static summary); "Sắp xếp" opens the same dialog (as in the prototype).
- Lookup shows the ticket on `/tra-cuu-ve` after OTP (prototype jumps to the ticket page).
- Round-trip: the return date is captured and shown; booking the return leg is out of scope (noted in UI).
- Unknown dynamic slugs render the 404 page with `noindex` but HTTP 200 (params are read inside Suspense under Cache Components / Partial Prefetching).

## Test results (Phase 4)

- `npx tsc --noEmit -p .`: pass · `npx eslint src`: pass · `npx next build`: pass (45 pages; static + partial prerender; no warnings).
- All 21 routes at 1440 / 390 / 375 (CDP device emulation): no horizontal overflow, exactly one `<h1>`, correct titles, no console errors.
- Desktop page heights vs Figma: identical for about, contact, organization, policy, gallery, search, seats, lookup, checkout; home +12px, routes +4px, news +12px; operator detail / trip / QR / ticket taller by design (extra content listed above). Mobile home 12,273 vs 12,237px.
- Side-by-side screenshots vs Figma reviewed for home, checkout (13B), QR (14B), operator detail, trip detail, results (mobile), seats (mobile).
- Scripted E2E through the UI at 1440 and 375 (`node_modules/.cache/make-e2e.mjs`): home search (calendar → 16/12/2026, ÂL 08/11) → results "3 chuyến minh họa" → trip detail → seats (empty state, A03 → "Ghế A03 · 01 hành khách", "Đã giảm 20.000đ", sold A02 → dialog) → checkout empty submit (3 Vietnamese errors) → fill → voucher YENSO20 → QR "160.000đ", "Mã đặt chỗ YS…" → status check → ticket with the same YS code → "Lưu vé" dialog → lookup: wrong phone → "Không tìm thấy vé…", wrong OTP → error, correct OTP → ticket + passenger. All steps pass, no overflow, no console errors.
- Keyboard: skip link → brand → nav order; Một chiều/Khứ hồi is one tab stop with arrow keys; Enter on a field opens its dialog; the calendar focuses the selected day (arrows ±1/±7 days, PageUp/PageDown months); focus is trapped in dialogs; Esc closes and returns focus to the opener.
- Web Interface Guidelines review (sub-agent, Vercel guidelines) — fixed: white focus ring on navy surfaces, `prefers-reduced-motion` (CSS + JS scrolling), `scrollbar-gutter: stable` for dialog scroll-lock, visible focus ring on fields in every state, inline errors no longer `role=alert` storms, live re-validation only for fields that failed the last submit (checkout, lookup), first invalid field focused on search submit, backdrop close only when the press starts on the backdrop, persistent `role=status` in the location dialog, calendar roving tabindex + 44px month buttons, focus kept after "Bỏ chọn", payment option semantics (`aria-pressed` / `aria-haspopup`), `+84` phone normalisation, support dock only ≥1360px (FAB below, no content overlap) with footer bottom padding, `aria-current` in the mobile menu, `translate="no"` on the wordmark, decorative glyphs (→ ↗ □ ✓ ×) hidden from screen readers, call/Zalo requests routed to the real contact form (`/lien-he#loi-nhan`) instead of a fake confirmation.
- Kept by design: footer/breadcrumb link sizes follow Figma (meet WCAG 2.2 target-size via spacing).

## Blockers

- None. Hotline / Zalo OA numbers are intentionally not filled (unverified per handoff).

## Notes for next session

- Dev-only: the Tailwind turbopack loader occasionally misses new `@theme` tokens; a content edit to `globals.css` refreshes it (production build is unaffected).
- If `tsc` reports `PageProps` errors for new routes, run `npx next typegen` (stale `.next/types/routes.d.ts`).

## Next actions

1. Replace mock data with station-confirmed data (routes, operators, schedules, prices, hotline, Zalo OA) and connect real APIs / payment gateway behind `src/data/repositories` and `bookingActions`.
2. Set `NEXT_PUBLIC_SITE_URL` (metadataBase) for the production domain.
3. Optional polish: move `features/about/info-card.tsx` to `components/common/`; issue ticket codes server-side (demo codes are derived from trip + day + seats).
