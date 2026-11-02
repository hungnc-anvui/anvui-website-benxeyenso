"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AMENITY_LABELS } from "@/lib/amenities";
import { cn } from "@/lib/cn";
import {
  activeFilterCount,
  applyFilters,
  DEFAULT_FILTERS,
  filterOptions,
  SORT_OPTIONS,
  TIME_SLOTS,
  toggleValue,
  type TripFilters,
  type TripView,
} from "./filters";

/**
 * Figma state "Trạng thái · filters" (6:3141 desktop / 6:3470 mobile): giờ đi, loại xe,
 * tiện ích and sắp xếp rows, then "Xem chuyến phù hợp" + "Đóng". Choices are a draft
 * until applied; closing discards them.
 */
export function FiltersDialog({
  open,
  onClose,
  items,
  value,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  items: TripView[];
  value: TripFilters;
  onApply: (filters: TripFilters) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Lọc chuyến xe">
      {/* Mounted only while open, so every opening starts from the applied filters. */}
      <FiltersForm items={items} initial={value} onApply={onApply} />
    </Dialog>
  );
}

function FiltersForm({
  items,
  initial,
  onApply,
}: {
  items: TripView[];
  initial: TripFilters;
  onApply: (filters: TripFilters) => void;
}) {
  const [draft, setDraft] = useState(initial);
  const { vehicles, amenities } = filterOptions(items);
  const matches = applyFilters(items, draft).length;
  const countIn = (patch: Partial<TripFilters>) =>
    applyFilters(items, { ...DEFAULT_FILTERS, ...patch }).length;

  return (
    <>
      <ChipGroup label="Giờ đi:">
        {TIME_SLOTS.map((slot) => (
          <Chip
            key={slot.id}
            pressed={draft.times.includes(slot.id)}
            disabled={!draft.times.includes(slot.id) && countIn({ times: [slot.id] }) === 0}
            onClick={() => setDraft((d) => ({ ...d, times: toggleValue(d.times, slot.id) }))}
            hint={slot.hint}
          >
            {slot.label}
          </Chip>
        ))}
      </ChipGroup>
      <ChipGroup label="Loại xe:">
        {vehicles.map((type) => (
          <Chip
            key={type}
            pressed={draft.vehicles.includes(type)}
            onClick={() => setDraft((d) => ({ ...d, vehicles: toggleValue(d.vehicles, type) }))}
          >
            {type}
          </Chip>
        ))}
      </ChipGroup>
      <ChipGroup label="Tiện ích:">
        {amenities.map((amenity) => (
          <Chip
            key={amenity}
            pressed={draft.amenities.includes(amenity)}
            onClick={() => setDraft((d) => ({ ...d, amenities: toggleValue(d.amenities, amenity) }))}
          >
            {AMENITY_LABELS[amenity]}
          </Chip>
        ))}
      </ChipGroup>
      <ChipGroup label="Sắp xếp:">
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.id}
            pressed={draft.sort === option.id}
            onClick={() => setDraft((d) => ({ ...d, sort: option.id }))}
          >
            {option.label}
          </Chip>
        ))}
      </ChipGroup>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-muted">
          {matches > 0 ? `${matches} chuyến phù hợp` : "Chưa có chuyến phù hợp, hãy bỏ bớt điều kiện"}
        </p>
        {activeFilterCount(draft) > 0 || draft.sort !== DEFAULT_FILTERS.sort ? (
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_FILTERS)}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <Button className="w-full" onClick={() => onApply(draft)}>
        Xem chuyến phù hợp
      </Button>
    </>
  );
}

function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex flex-wrap items-center gap-2">
      <span id={id} className="mr-1 text-body text-ink">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  pressed,
  disabled,
  onClick,
  hint,
  children,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      title={hint}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        pressed ? "bg-primary text-white hover:bg-primary-hover" : "bg-paper text-primary hover:bg-sky",
      )}
    >
      {pressed ? <span aria-hidden="true">✓</span> : null}
      {children}
      {hint ? <span className="sr-only"> ({hint})</span> : null}
    </button>
  );
}
