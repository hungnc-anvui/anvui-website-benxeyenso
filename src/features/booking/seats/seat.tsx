import { cn } from "@/lib/cn";

export type SeatState = "available" | "selected" | "sold";

const STATE_LABEL: Record<SeatState, string> = {
  available: "còn trống",
  selected: "đang chọn",
  sold: "đã bán",
};

const STATE_CLASS: Record<SeatState, string> = {
  // "State=Focus" (2:113) = available with a primary border → hover / keyboard focus.
  available: "border-line bg-white text-muted hover:border-primary focus-visible:border-primary",
  selected: "border-primary bg-primary text-white hover:bg-primary-hover",
  sold: "border-line bg-mist text-muted",
};

/**
 * Figma component "YS/Seat" (2:114): 72×60, radius 8, code 14/22 semibold,
 * mark 12/18 (✓ selected, × sold). Sold seats stay focusable so the
 * "Chỗ vừa có người giữ" state can explain why they cannot be picked.
 */
export function Seat({ code, state, onClick }: { code: string; state: SeatState; onClick: (code: string) => void }) {
  return (
    <button
      type="button"
      data-seat={code}
      data-state={state}
      aria-pressed={state === "selected"}
      aria-disabled={state === "sold" ? true : undefined}
      aria-label={`Ghế ${code}, ${STATE_LABEL[state]}`}
      onClick={() => onClick(code)}
      className={cn(
        "flex h-15 w-18 shrink-0 flex-col items-center justify-center rounded-sm border text-sm font-semibold transition-colors",
        STATE_CLASS[state],
      )}
    >
      <span aria-hidden="true">{code}</span>
      {state !== "available" ? (
        <span aria-hidden="true" className="text-xs font-medium">
          {state === "selected" ? "✓" : "×"}
        </span>
      ) : null}
    </button>
  );
}
