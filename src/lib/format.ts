import { lunarYearName, toLunar } from "./lunar";

/** 180000 → "180.000đ" */
export function formatVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Dates are passed around as ISO day strings ("2026-10-16") to stay timezone-free. */
export function parseIsoDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function toIsoDay(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function isIsoDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addDays(iso: string, days: number) {
  const { y, m, d } = parseIsoDay(iso);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return toIsoDay(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/** Today in Vietnam (UTC+7). Call from client code only — it reads the clock. */
export function todayIsoVN() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts;
}

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

/** Monday-first index: 0 = T2 … 6 = CN */
export function weekdayIndexMon(iso: string) {
  const { y, m, d } = parseIsoDay(iso);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

export function weekdayName(iso: string) {
  const { y, m, d } = parseIsoDay(iso);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** "16/10/2026" */
export function formatDay(iso: string) {
  const { y, m, d } = parseIsoDay(iso);
  return `${pad(d)}/${pad(m)}/${y}`;
}

/** "16/10" */
export function formatDayShort(iso: string) {
  const { m, d } = parseIsoDay(iso);
  return `${pad(d)}/${pad(m)}`;
}

export function lunarOf(iso: string) {
  const { y, m, d } = parseIsoDay(iso);
  return toLunar(d, m, y);
}

/** "07/09" */
export function formatLunar(iso: string) {
  const l = lunarOf(iso);
  return `${pad(l.day)}/${pad(l.month)}${l.leap ? " (nhuận)" : ""}`;
}

/** "07/09 năm Bính Ngọ" */
export function formatLunarLong(iso: string) {
  const l = lunarOf(iso);
  return `${formatLunar(iso)} năm ${lunarYearName(l.year)}`;
}

/** Field value: "16/10/2026 · ÂL 07/09" */
export function formatDateField(iso: string) {
  return `${formatDay(iso)} · ÂL ${formatLunar(iso)}`;
}

/** "Thứ Sáu, 16/10/2026" */
export function formatDateLong(iso: string) {
  return `${weekdayName(iso)}, ${formatDay(iso)}`;
}

/** 210 → "3 giờ 30 phút" */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!m) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

/** "08:00" + 210 → "11:30" (wraps past midnight) */
export function addMinutesToTime(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** "0912345688" → "09•• ••• •88" */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  return `${digits.slice(0, 2)}•• ••• •${digits.slice(-2)}`;
}
