"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import {
  addDays,
  formatDateLong,
  formatDayShort,
  formatLunarLong,
  lunarOf,
  parseIsoDay,
  toIsoDay,
  weekdayIndexMon,
} from "@/lib/format";
import { lunarYearName } from "@/lib/lunar";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function daysInMonth(y: number, m: number) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Lunar month span of a solar month: "tháng 8 – tháng 9, năm Bính Ngọ" */
function lunarMonthSpan(y: number, m: number) {
  const first = lunarOf(toIsoDay(y, m, 1));
  const last = lunarOf(toIsoDay(y, m, daysInMonth(y, m)));
  const months = first.month === last.month ? `tháng ${first.month}` : `tháng ${first.month} – tháng ${last.month}`;
  const years =
    first.year === last.year
      ? lunarYearName(first.year)
      : `${lunarYearName(first.year)} – ${lunarYearName(last.year)}`;
  return `${months}, năm ${years}`;
}

/**
 * Figma state "Trạng thái · calendar" (6:2988): solar day as the main number,
 * lunar day as the secondary one; past days disabled; today outlined in green.
 */
export function CalendarDialog({
  open,
  onClose,
  value,
  min,
  today,
  title = "Chọn ngày khởi hành",
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  value: string | null;
  /** Earliest selectable day. */
  min: string | null;
  /** Day outlined as today; defaults to `min`. */
  today?: string | null;
  title?: string;
  onConfirm: (iso: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm">
      {open ? (
        <CalendarBody key={`${value}-${min}`} value={value} min={min} today={today ?? min} onConfirm={onConfirm} />
      ) : null}
    </Dialog>
  );
}

function CalendarBody({
  value,
  min,
  today,
  onConfirm,
}: {
  value: string | null;
  min: string | null;
  today: string | null;
  onConfirm: (iso: string) => void;
}) {
  const start = value ?? min ?? "2026-10-16";
  const [selected, setSelected] = useState<string | null>(value);
  const [view, setView] = useState(() => {
    const { y, m } = parseIsoDay(start);
    return { y, m };
  });
  // Roving tabindex: one day is tabbable, arrow keys move it (APG date-picker grid pattern).
  const [focusDay, setFocusDay] = useState(() => (min && start < min ? min : start));
  const gridRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // On open, focus the selected (or first selectable) day once showModal() has run.
  useEffect(() => {
    const id = requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay, view]);

  const moveFocus = (next: string) => {
    if (min && next < min) return;
    const { y, m } = parseIsoDay(next);
    moved.current = true;
    setFocusDay(next);
    setView({ y, m });
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const base = visibleFocus ?? focusDay;
    const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in deltas) moveFocus(addDays(base, deltas[event.key]));
    else if (event.key === "PageUp" || event.key === "PageDown") {
      const { y, m, d } = parseIsoDay(base);
      const nm = event.key === "PageUp" ? m - 1 : m + 1;
      const ny = nm < 1 ? y - 1 : nm > 12 ? y + 1 : y;
      const mm = nm < 1 ? 12 : nm > 12 ? 1 : nm;
      moveFocus(toIsoDay(ny, mm, Math.min(d, daysInMonth(ny, mm))));
    } else return;
    event.preventDefault();
  };

  const total = daysInMonth(view.y, view.m);
  const offset = weekdayIndexMon(toIsoDay(view.y, view.m, 1));
  const cells: Array<string | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => toIsoDay(view.y, view.m, i + 1)),
  ];

  // The tabbable day must be in the visible month (month buttons can move the view away from it).
  const firstSelectable = cells.find((iso) => iso && !(min && iso < min)) ?? null;
  const visibleFocus = focusDay && cells.includes(focusDay) && !(min && focusDay < min) ? focusDay : firstSelectable;

  const minMonth = min ? parseIsoDay(min) : null;
  const canGoBack = !minMonth || view.y > minMonth.y || (view.y === minMonth.y && view.m > minMonth.m);

  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const next = m + delta;
      if (next < 1) return { y: y - 1, m: 12 };
      if (next > 12) return { y: y + 1, m: 1 };
      return { y, m: next };
    });

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-title font-semibold" aria-live="polite">
          Tháng {view.m}, {view.y}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => canGoBack && shift(-1)}
            // aria-disabled (not disabled) so focus is not dropped when the first month is reached.
            aria-disabled={!canGoBack}
            aria-label="Tháng trước"
            className="inline-flex size-11 items-center justify-center rounded-sm text-primary hover:bg-sky aria-disabled:cursor-default aria-disabled:text-mist aria-disabled:hover:bg-transparent"
          >
            <Icon name="chevron-left" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Tháng sau"
            className="inline-flex size-11 items-center justify-center rounded-sm text-primary hover:bg-sky"
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
      <p className="-mt-2 text-sm text-muted">Âm lịch: {lunarMonthSpan(view.y, view.m)}</p>
      <p className="text-xs font-medium text-green">Số lớn: dương lịch · Số nhỏ: âm lịch</p>

      <div ref={gridRef} onKeyDown={onGridKeyDown} className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} aria-hidden="true" className="text-center text-xs font-medium text-muted">
            {d}
          </div>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <div key={`empty-${i}`} aria-hidden="true" />;
          const { d } = parseIsoDay(iso);
          const lunar = lunarOf(iso);
          const lunarLabel = lunar.day === 1 || d === 1 ? `${lunar.day}/${lunar.month}` : String(lunar.day);
          const disabled = Boolean(min && iso < min);
          const isToday = iso === today;
          const isSelected = iso === selected;
          return (
            <button
              key={iso}
              type="button"
              data-day={iso}
              tabIndex={iso === visibleFocus ? 0 : -1}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`${formatDateLong(iso)}, âm lịch ${lunar.day} tháng ${lunar.month}${isToday ? ", hôm nay" : ""}`}
              onClick={() => {
                setSelected(iso);
                setFocusDay(iso);
              }}
              className={cn(
                "flex h-[58px] flex-col items-center justify-center rounded-sm border border-transparent p-1 transition-colors",
                disabled && "opacity-50",
                !disabled && !isSelected && "hover:bg-sky",
                isToday && !isSelected && "border-leaf",
                isSelected && "bg-primary text-white",
              )}
            >
              <span className={cn("text-body font-semibold", !isSelected && (disabled ? "text-muted" : "text-navy"))}>
                {d}
              </span>
              <span className={cn("text-xs font-medium", isSelected ? "text-white" : "text-muted")}>{lunarLabel}</span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="flex flex-col gap-2 rounded-md bg-sky p-4">
          <p className="text-sm font-semibold text-primary">✓ {formatDateLong(selected)}</p>
          <p className="text-sm text-muted">Âm lịch: {formatLunarLong(selected)}</p>
        </div>
      ) : null}

      <Button className="w-full" disabled={!selected} onClick={() => selected && onConfirm(selected)}>
        {selected ? `Xác nhận ngày ${formatDayShort(selected)}` : "Chọn một ngày"}
      </Button>
    </>
  );
}
