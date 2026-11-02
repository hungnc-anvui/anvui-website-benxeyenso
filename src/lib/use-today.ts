"use client";

import { useSyncExternalStore } from "react";
import { todayIsoVN } from "./format";

const subscribe = () => () => {};

/**
 * Today's date in Vietnam (ISO day). Returns null during prerender/hydration so
 * the server never reads the clock (Cache Components requirement).
 */
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, todayIsoVN, () => null);
}
