"use client";

import { useSyncExternalStore } from "react";
import type { BookingDraft } from "@/stores/booking-store";

/**
 * Seat hold while the QR is displayed (Figma 14: "Thời gian giữ chỗ còn 09:42").
 * The start time lives in sessionStorage so a reload keeps counting down.
 */
export const HOLD_SECONDS = 10 * 60;

const KEY = "ys-payment-hold";

type Hold = { code: string; startedAt: number };

let hold: Hold | null | undefined;
const listeners = new Set<() => void>();

function readHold(): Hold | null {
  if (hold === undefined) {
    try {
      const raw = sessionStorage.getItem(KEY);
      hold = raw ? (JSON.parse(raw) as Hold) : null;
    } catch {
      hold = null;
    }
  }
  return hold;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** (Re)start the hold for a reservation — call from effects / event handlers only. */
export function startHold(code: string) {
  hold = { code, startedAt: Date.now() };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(hold));
  } catch {
    // Private mode — the countdown still works in memory.
  }
  listeners.forEach((listener) => listener());
}

export function usePaymentHold(): Hold | null {
  return useSyncExternalStore(subscribe, readHold, () => null);
}

// ------------------------------------------------------------------ clock

// Cached so getSnapshot stays stable between ticks (React compares snapshots).
let clock: number | null = null;
let clockSubscribers = 0;
const nowSeconds = () => Math.floor(Date.now() / 1000);

function subscribeClock(listener: () => void) {
  clockSubscribers++;
  clock = nowSeconds(); // React re-reads the snapshot right after subscribing.
  const id = window.setInterval(() => {
    clock = nowSeconds();
    listener();
  }, 1000);
  return () => {
    window.clearInterval(id);
    if (--clockSubscribers === 0) clock = null;
  };
}

function getClock() {
  if (clock === null) clock = nowSeconds();
  return clock;
}

/** Current time in whole seconds (null during prerender/hydration). */
export function useNowSeconds(): number | null {
  return useSyncExternalStore(subscribeClock, getClock, () => null);
}

/** "09:42" */
export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ------------------------------------------------------------------ reservation code

/**
 * Stable reservation code for the current draft ("Mã đặt chỗ"), derived from
 * trip + day + seats (FNV-1a) so it survives reloads without touching the store.
 * The store issues the ticket ("Mã vé") under this same code when payment completes.
 */
export function reservationCode(draft: Pick<BookingDraft, "tripId" | "date" | "seats">) {
  const input = `${draft.tripId}|${draft.date}|${draft.seats.join(",")}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `YS${String(hash % 1_000_000_000).padStart(9, "0")}`;
}
