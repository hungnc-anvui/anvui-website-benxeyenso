"use client";

import { useSyncExternalStore } from "react";
import { checkVoucher, getTrip, type VoucherCheck } from "@/data/repositories/transport";
import type { Passenger, PaymentMethod, Ticket } from "@/types/domain";

/**
 * Demo booking state. The in-progress draft lives in sessionStorage (survives
 * reloads within the tab); issued tickets live in localStorage so "Tra cứu vé"
 * can find them later. No backend, no real payment.
 */

export const MAX_SEATS = 5;

export type BookingDraft = {
  tripId: string | null;
  date: string | null;
  returnDate: string | null;
  seats: string[];
  passenger: Passenger;
  voucherCode: string | null;
  paymentMethod: PaymentMethod;
  acceptedTerms: boolean;
  /** Set once the simulated payment succeeds. */
  ticketCode: string | null;
};

const DRAFT_KEY = "ys-booking-draft";
const TICKETS_KEY = "ys-tickets";

const EMPTY_DRAFT: BookingDraft = {
  tripId: null,
  date: null,
  returnDate: null,
  seats: [],
  passenger: { fullName: "", phone: "", email: "" },
  voucherCode: null,
  paymentMethod: "qr",
  acceptedTerms: false,
  ticketCode: null,
};

const EMPTY_TICKETS: Ticket[] = [];

let draft: BookingDraft | null = null;
let tickets: Ticket[] | null = null;
const listeners = new Set<() => void>();

function read<T>(storage: () => Storage, key: string, fallback: T): T {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(storage: () => Storage, key: string, value: unknown) {
  try {
    storage().setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / quota — state still works in memory.
  }
}

function getDraft(): BookingDraft {
  if (!draft) draft = { ...EMPTY_DRAFT, ...read(() => sessionStorage, DRAFT_KEY, EMPTY_DRAFT) };
  return draft;
}

function getTicketsSnapshot(): Ticket[] {
  if (!tickets) tickets = read(() => localStorage, TICKETS_KEY, EMPTY_TICKETS);
  return tickets;
}

function emit() {
  listeners.forEach((l) => l());
}

function setDraft(update: Partial<BookingDraft>) {
  draft = { ...getDraft(), ...update };
  write(() => sessionStorage, DRAFT_KEY, draft);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === TICKETS_KEY) {
      tickets = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current draft. Returns the empty draft during SSR/hydration, then the stored one. */
export function useBookingDraft(): BookingDraft {
  return useSyncExternalStore(subscribe, getDraft, () => EMPTY_DRAFT);
}

/** True once the client snapshot is in use (lets pages avoid flashing "empty" states). */
export function useStoreReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useTickets(): Ticket[] {
  return useSyncExternalStore(subscribe, getTicketsSnapshot, () => EMPTY_TICKETS);
}

// ---------------------------------------------------------------- pricing

export type BookingPrice = {
  seatCount: number;
  unitListPrice: number;
  unitPrice: number;
  listTotal: number;
  tripDiscount: number;
  subtotal: number;
  voucherDiscount: number;
  total: number;
  voucherError: string | null;
};

/**
 * Handoff rule (note 04): list 200.000đ − trip discount 20.000đ = 180.000đ;
 * voucher YENSO20 −20.000đ → 160.000đ. Voucher is re-validated against the subtotal.
 */
export function priceBooking(d: Pick<BookingDraft, "tripId" | "seats" | "voucherCode">): BookingPrice {
  const trip = d.tripId ? getTrip(d.tripId) : undefined;
  const seatCount = d.seats.length;
  const unitListPrice = trip?.listPrice ?? 0;
  const unitPrice = trip?.price ?? 0;
  const listTotal = unitListPrice * seatCount;
  const subtotal = unitPrice * seatCount;
  const tripDiscount = listTotal - subtotal;
  let voucherDiscount = 0;
  let voucherError: string | null = null;
  if (d.voucherCode) {
    const check = checkVoucher(d.voucherCode, subtotal);
    if (check.ok) voucherDiscount = Math.min(check.voucher.discount, subtotal);
    else voucherError = check.error;
  }
  return {
    seatCount,
    unitListPrice,
    unitPrice,
    listTotal,
    tripDiscount,
    subtotal,
    voucherDiscount,
    total: subtotal - voucherDiscount,
    voucherError,
  };
}

// ---------------------------------------------------------------- actions

export const bookingActions = {
  /** Select a trip + date. Keeps seats/passenger when it is the same trip and day. */
  startBooking(tripId: string, date: string, returnDate: string | null = null) {
    const current = getDraft();
    if (current.tripId === tripId && current.date === date && !current.ticketCode) {
      if (returnDate !== current.returnDate) setDraft({ returnDate });
      return;
    }
    setDraft({
      ...EMPTY_DRAFT,
      passenger: current.passenger,
      tripId,
      date,
      returnDate,
    });
  },

  /** Toggle a seat; returns false when the seat limit is reached. */
  toggleSeat(code: string): boolean {
    const { seats } = getDraft();
    if (seats.includes(code)) {
      setDraft({ seats: seats.filter((s) => s !== code) });
      return true;
    }
    if (seats.length >= MAX_SEATS) return false;
    setDraft({ seats: [...seats, code].sort() });
    return true;
  },

  clearSeats() {
    setDraft({ seats: [] });
  },

  setPassenger(passenger: Partial<Passenger>) {
    setDraft({ passenger: { ...getDraft().passenger, ...passenger } });
  },

  applyVoucher(code: string): VoucherCheck {
    const d = getDraft();
    const check = checkVoucher(code, priceBooking({ ...d, voucherCode: null }).subtotal);
    if (check.ok) setDraft({ voucherCode: check.voucher.code });
    return check;
  },

  removeVoucher() {
    setDraft({ voucherCode: null });
  },

  setPaymentMethod(paymentMethod: PaymentMethod) {
    setDraft({ paymentMethod });
  },

  setAcceptedTerms(acceptedTerms: boolean) {
    setDraft({ acceptedTerms });
  },

  /** Simulated payment success: issues a demo ticket and stores it for lookup. */
  completePayment(reservedCode?: string): Ticket | null {
    const d = getDraft();
    if (!d.tripId || !d.date || d.seats.length === 0) return null;
    if (d.ticketCode) return findTicketByCode(d.ticketCode) ?? null;
    const price = priceBooking(d);
    // The reservation code shown on the QR page becomes the ticket code (Figma 14 → 15).
    const code =
      reservedCode && /^YS\d{9}$/.test(reservedCode) && !findTicketByCode(reservedCode)
        ? reservedCode
        : generateTicketCode();
    const ticket: Ticket = {
      code,
      tripId: d.tripId,
      date: d.date,
      seats: d.seats,
      passenger: d.passenger,
      voucherCode: price.voucherDiscount > 0 ? d.voucherCode : null,
      paymentMethod: d.paymentMethod,
      listTotal: price.listTotal,
      tripDiscount: price.tripDiscount,
      voucherDiscount: price.voucherDiscount,
      total: price.total,
      createdAt: new Date().toISOString(),
    };
    tickets = [ticket, ...getTicketsSnapshot()];
    write(() => localStorage, TICKETS_KEY, tickets);
    setDraft({ ticketCode: ticket.code });
    return ticket;
  },

  /** Start over after a ticket was issued (keeps the passenger's contact details). */
  reset() {
    setDraft({ ...EMPTY_DRAFT, passenger: getDraft().passenger });
  },
};

// ---------------------------------------------------------------- tickets

/** "YS" + 9 digits, e.g. YS123456789 (Figma 16 · Tra cứu vé). */
function generateTicketCode() {
  let code = "";
  for (let i = 0; i < 9; i++) code += Math.floor(Math.random() * 10);
  return `YS${code}`;
}

export function findTicketByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return getTicketsSnapshot().find((t) => t.code === normalized);
}

/** Digits only, with an international "+84 9xx…" (common from autofill) folded to "09xx…". */
const digits = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d.length === 11 && d.startsWith("84") ? `0${d.slice(2)}` : d;
};

/** Lookup requires both the ticket code and the booking phone number. */
export function findTicket(code: string, phone: string) {
  const ticket = findTicketByCode(code);
  if (!ticket) return undefined;
  return digits(ticket.passenger.phone) === digits(phone) ? ticket : undefined;
}

/** Seats taken by demo tickets issued in this browser for a trip + day. */
export function bookedSeatsFor(allTickets: Ticket[], tripId: string, date: string) {
  return allTickets.filter((t) => t.tripId === tripId && t.date === date).flatMap((t) => t.seats);
}

/** Vietnamese mobile number: 10 digits starting with 0 (03/05/07/08/09). */
export function isValidVnPhone(phone: string) {
  return /^0(3|5|7|8|9)\d{8}$/.test(digits(phone));
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
