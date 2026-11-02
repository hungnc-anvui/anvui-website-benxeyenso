# Bến xe Yên Sở — Design inventory

Figma file: `BẾN XE YÊN SỞ • Vận tải công nghệ liền mạch • Website (Copy)` — read via `figma-mcp-bridge`.
Pages: `0:1` Định hướng · `2:2` Hệ thiết kế · `2:3` Desktop (1440) · `2:4` Mobile (375) · `2:5` Bàn giao & chức năng.

## Screens → routes

| Màn | Desktop | Mobile | Route |
|---|---|---|---|
| 01 Trang chủ | 3:176 | 3:418 | `/` |
| 02 Giới thiệu bến | 5:99 | 6:1530 | `/gioi-thieu` |
| 03 Danh sách tuyến | 5:166 | 6:1591 | `/tuyen-xe` |
| 04 Danh sách doanh nghiệp | 5:288 | 6:1707 | `/doanh-nghiep` |
| 05 Chi tiết doanh nghiệp | 5:374 | 6:1787 | `/doanh-nghiep/[slug]` |
| 06 Tin tức | 5:437 | 6:1844 | `/tin-tuc` |
| 07 Chi tiết tin | 6:188 | 6:1922 | `/tin-tuc/[slug]` (bài 1) |
| Bài viết · 8 biến thể | 30:3558, 30:3650, 30:3742, 30:3834, 30:3926, 30:4018, 30:4110, 30:4202 | 30:5458 … 30:6074 (+88) | `/tin-tuc/[slug]` (bài 2–9) |
| 08 Liên hệ | 6:247 | 6:1975 | `/lien-he` |
| 09 Tổ chức bến | 6:328 | 6:2050 | `/to-chuc-ben` |
| 15 Điều kiện vé & bảo mật | 6:433 | 6:2149 | `/dieu-kien-ve` |
| 21 Thư viện ảnh | 30:3131 | 30:5025 | `/thu-vien-anh` |
| Xem ảnh (lightbox ×10) | 30:3252 → 30:3351 | 30:5144 → 30:5243 | dialog on `/thu-vien-anh` |
| 10 Kết quả tìm chuyến | 6:493 | 6:2203 | `/dat-ve?to=&date=&return=` |
| 11 Chi tiết chuyến | 6:613 | 6:2315 | `/dat-ve/chuyen/[tripId]?date=` |
| 12 Chọn chỗ / 12B đã chọn A03 | 6:701 / 6:802 | 6:2397 / 6:2492 | `/dat-ve/chon-cho?trip=&date=` (state) |
| 13 Thông tin & thanh toán / 13B voucher | 6:904 / 6:996 | 6:2588 / 6:2674 | `/dat-ve/thanh-toan` (state) |
| 14 Thanh toán QR / 14B sau ưu đãi | 6:1089 / 6:1153 | 6:2761 / 6:2819 | `/dat-ve/thanh-toan-qr` (state) |
| 15 Xác nhận & vé điện tử | 6:1217 | 6:2877 | `/dat-ve/ve-dien-tu` |
| 16 Tra cứu vé | 6:1281 | 6:2935 | `/tra-cuu-ve` |

Variants that differ only by state (12B, 13B, 14B, lightbox, article variants) share one route.

## Interaction states (dialogs)

| State | Desktop | Mobile | Implemented in |
|---|---|---|---|
| calendar (dương + âm lịch) | 6:2988 | 6:3317 | `features/search/calendar-dialog.tsx` |
| location | 6:3110 | 6:3439 | `features/search/location-dialog.tsx` |
| roundtrip | 6:3123 | 6:3452 | `features/search/search-form.tsx` |
| support / call / zalo / assistant / assistantReply / directions / requestSent / otherTrip | 6:3165, 6:3176, 6:3183, 6:3190, 6:3212, 6:3253, 6:3260, 6:3267 | 6:3494 … 6:3596 | `features/support/support-provider.tsx` (`useSupport().open(view)`) |
| menu | 6:3295 | 6:3624 | `components/layout/mobile-menu.tsx` |
| filters | 6:3141 | 6:3470 | booking — search results |
| voucher | 6:3151 | 6:3480 | booking — checkout |
| otp | 6:3234 | 6:3563 | `/tra-cuu-ve` |
| operatorSearch | 6:3244 | 6:3573 | `/doanh-nghiep` |
| seatPreview | 6:3274 | 6:3603 | booking — seats (seat taken) |
| method | 6:3281 | 6:3610 | booking — checkout/QR |
| saved | 6:3288 | 6:3617 | booking — ticket |

## Design tokens (page 2:2) → `src/app/globals.css`

| Figma | Hex | Token |
|---|---|---|
| jade | #103b68 | `navy` (headings, brand, dark bands) |
| primary | #0768b5 | `primary` |
| paper | #f3f7fb | `paper` (page bg) |
| sand | #e9f5f2 | `mint` (tag bg, disabled field) |
| brick | #217340 | `green` (eyebrows, availability) |
| gold | #50a541 | `leaf` (today marker) |
| — | #617488 | `muted` |
| — | #182b40 | `ink` |
| — | #d7e2ed | `line` (borders) |
| — | #e8f2fe | `sky` (secondary button) |
| — | #dfe7ee | `mist` (disabled / sold seat) |
| — | #b83d44 | `danger` |

Typography: Be Vietnam Pro 400/500/600/700 (`next/font/google`, subsets latin + vietnamese).
Scale (size/line-height): display 64/76 · h1 48/60 · h2 36/48 · h3 28/38 · price 26/34 · title 20/30 · body 16/26 · sm 14/22 · xs 12/18.
Radius: 8 (button/field/seat) · 12 · 16 (cards, dialogs) · 24 (photos) · 999 (tags). Dock shadow `0 8 28 #142e26`.
Layout: content 1200 px; section padding 56 (desktop) / 32 + 16 gutters (mobile); section gap 24.
Breakpoints: mobile-first; `lg` (1024) switches to desktop layouts; desktop nav at `xl` (1280), menu dialog below.

## Shared components

| Figma | Code |
|---|---|
| YS/Button (Primary/Secondary/Light/Ghost/Disabled) | `components/ui/button.tsx` (`Button`, `ButtonLink`, `buttonClass`) |
| YS/Field (Default/Empty/Focus/Error/Disabled) | `components/ui/field.tsx` (`FieldButton`, `TextField`, `TextAreaField`) |
| YS/Seat | booking feature (seat map) |
| YS/Icon/* (16 icons) | `components/ui/icon.tsx` (inline SVG, `currentColor`) |
| Tag · … | `components/ui/tag.tsx` |
| Trạng thái · … | `components/ui/dialog.tsx` (native `<dialog>`) |
| Section bands / headings / breadcrumb hero | `components/ui/section.tsx` (`Section`, `SectionHeading`, `Eyebrow`, `PageHero`) |
| YS/PhotoCard | `components/common/photo-card.tsx` |
| YS/OperatorCard | `components/common/operator-card.tsx` |
| YS/TripCard | `components/common/trip-card.tsx` |
| Header / Footer / Hỗ trợ dock | `components/layout/*` |
| Search form | `features/search/search-form.tsx` |
| Tuyến xe nổi bật · Thư viện ảnh teaser · Bốn bước | `components/common/featured-routes.tsx`, `gallery-teaser.tsx`, `booking-steps.tsx` |

## Assets (exported from Figma `Asset/*`, page 2:2)

`public/images/`: logo.png (3:60), hero.jpg (3:61), opening.jpg (3:62), opening2.jpg (3:63), aerial.jpg (3:64), bus.jpg (3:65), architecture.jpg (3:66), facade.jpg (3:67), road.jpg (3:68), lounge.jpg (3:69), counter.jpg (3:70), qr-demo.svg (4:100 "YS/QR minh họa").
`public/icons/*.svg`: originals of YS/Icon/* (the app uses the inline `Icon` component).
`src/app/icon.png`: favicon from the logo. Metadata in `src/data/mock/images.ts`.

## Handoff rules (page 2:5)

- Sample flow: Yên Sở → Thanh Hóa · 08:00 · ghế A03 · voucher YENSO20 · QR · xác nhận; ticket lookup needs verification (OTP).
- Every transport date picker shows dương lịch (main) + âm lịch (secondary), UTC+7, past days disabled → `src/lib/lunar.ts`.
- Price: 200.000đ − 20.000đ (ưu đãi chuyến) = 180.000đ; voucher −20.000đ → 160.000đ.
- Hotline / Zalo OA not verified → dialogs collect a request instead of showing numbers.
- Logo keeps its ratio; operator names are samples ("Doanh nghiệp vận tải 0X").
