"use client";

import { useId, useState, type Ref } from "react";
import { cn } from "@/lib/cn";
import type { SeatDeck } from "@/types/domain";
import { Seat, type SeatState } from "./seat";

/**
 * Figma "Seat map" card (6:721 desktop / 6:2414 mobile): "{loại xe} · {tầng}", legend,
 * then the coach body ("ĐẦU XE · TÀI XẾ", two seats per row either side of the aisle).
 * The sleeper has two decks; Figma draws the lower one, a small switch reaches the upper one.
 */
export function SeatMap({
  vehicleType,
  decks,
  selected,
  sold,
  onSeat,
  ref,
}: {
  vehicleType: string;
  decks: SeatDeck[];
  selected: string[];
  sold: Set<string>;
  onSeat: (code: string) => void;
  ref?: Ref<HTMLElement>;
}) {
  const [deckId, setDeckId] = useState(decks[0]?.id);
  const deck = decks.find((d) => d.id === deckId) ?? decks[0];
  const titleId = useId();

  const stateOf = (code: string): SeatState =>
    sold.has(code) ? "sold" : selected.includes(code) ? "selected" : "available";
  const selectedIn = (d: SeatDeck) => d.rows.flat().filter((code) => code && selected.includes(code)).length;

  return (
    <section ref={ref} aria-labelledby={titleId} className="flex min-w-0 flex-col gap-5 rounded-lg bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={titleId} className="text-title font-semibold text-navy">
          {vehicleType} · {deck.label}
        </h2>
        {decks.length > 1 ? (
          <div role="group" aria-label="Chọn tầng xe" className="flex gap-2">
            {decks.map((d) => {
              const active = d.id === deck.id;
              const count = selectedIn(d);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDeckId(d.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium text-primary transition-colors",
                    active ? "bg-sky" : "bg-paper hover:bg-sky",
                  )}
                >
                  <span aria-hidden="true">{active ? "●" : "○"}</span>
                  {d.label}
                  {count > 0 ? <span>· {count} ghế</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <ul aria-label="Chú thích sơ đồ ghế" className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
        <li>
          <span aria-hidden="true">□</span> Còn trống
        </li>
        <li>
          <span aria-hidden="true">✓</span> Đang chọn
        </li>
        <li>
          <span aria-hidden="true">×</span> Đã bán
        </li>
      </ul>

      <div className="flex flex-col gap-4 rounded-xl bg-paper p-6">
        <p className="text-xs font-medium text-muted">ĐẦU XE · TÀI XẾ</p>
        <div role="group" aria-label={`Sơ đồ ghế ${deck.label}`} className="flex flex-col gap-4">
          {deck.rows.map((row, i) => (
            <div key={`${deck.id}-${i}`} className="flex items-center justify-between gap-4">
              {row.map((code, j) =>
                code ? (
                  <Seat key={code} code={code} state={stateOf(code)} onClick={onSeat} />
                ) : (
                  <span key={`aisle-${j}`} aria-hidden="true" className="h-15 w-18" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
