"use client";

import { createContext, use, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FieldButton, TextField } from "@/components/ui/field";
import { getDestinations, getRoutes, normalize } from "@/data/repositories/transport";

/**
 * Destination filter of "03 · Danh sách tuyến" (Figma "Filter routes" 5:203 / 6:1625).
 * The cards are server-rendered; these client wrappers only toggle their visibility.
 */
type RouteFilterValue = { applied: string | null; apply: (destinationId: string | null) => void };

const RouteFilterContext = createContext<RouteFilterValue | null>(null);

function useRouteFilter() {
  const ctx = use(RouteFilterContext);
  if (!ctx) throw new Error("Route filter components must be used inside <RouteFilterProvider>");
  return ctx;
}

export function RouteFilterProvider({ children }: { children: ReactNode }) {
  const [applied, setApplied] = useState<string | null>(null);
  return <RouteFilterContext value={{ applied, apply: setApplied }}>{children}</RouteFilterContext>;
}

const ALL_LABEL = "Tất cả điểm đến";

/** Destinations that appear in the route list, in list order. */
function filterOptions() {
  const routes = getRoutes();
  return getDestinations().filter((d) => routes.some((r) => r.destinationId === d.id));
}

/** "TỈNH / THÀNH ĐẾN" field + "Tìm tuyến xe". Picking only sets the draft; the button applies it. */
export function RouteFilterForm() {
  const { applied, apply } = useRouteFilter();
  const [draft, setDraft] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const options = filterOptions();
  const labelOf = (id: string | null) => (id ? (options.find((d) => d.id === id)?.province ?? ALL_LABEL) : ALL_LABEL);
  const count = getRoutes().filter((r) => !applied || r.destinationId === applied).length;

  return (
    <div className="flex flex-col">
      <form
        role="search"
        aria-label="Lọc danh sách tuyến"
        onSubmit={(event) => {
          event.preventDefault();
          apply(draft);
        }}
        className="flex flex-col gap-3 lg:flex-row lg:items-start"
      >
        <FieldButton
          id="route-filter-destination"
          label="Tỉnh / thành đến"
          value={labelOf(draft)}
          aria-haspopup="dialog"
          onClick={() => setPickerOpen(true)}
          className="lg:w-[420px]"
        />
        <Button type="submit" className="w-full lg:w-[260px]">
          Tìm tuyến xe
        </Button>
      </form>
      <p role="status" className="text-sm text-muted not-empty:mt-3">
        {applied
          ? count
            ? `Đang hiển thị ${count} tuyến đến ${labelOf(applied)}.`
            : `Chưa có tuyến đến ${labelOf(applied)}.`
          : null}
      </p>
      <DestinationPicker
        open={pickerOpen}
        value={draft}
        options={options}
        onClose={() => setPickerOpen(false)}
        onSelect={(id) => {
          setDraft(id);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

/** Figma state "Trạng thái · location" (6:3110) with an extra "Tất cả điểm đến" option. */
function DestinationPicker({
  open,
  value,
  options,
  onClose,
  onSelect,
}: {
  open: boolean;
  value: string | null;
  options: ReturnType<typeof filterOptions>;
  onClose: () => void;
  onSelect: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const q = normalize(query);
  const matches = options.filter((d) => !q || normalize(d.province).includes(q) || normalize(d.label).includes(q));
  const choose = (id: string | null) => {
    setQuery("");
    onSelect(id);
  };
  const option = (id: string | null, label: string) => (
    <Button
      key={id ?? "all"}
      variant={id === value ? "primary" : "secondary"}
      aria-pressed={id === value}
      className="w-full"
      onClick={() => choose(id)}
    >
      {label}
    </Button>
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        setQuery("");
        onClose();
      }}
      title="Chọn điểm đến"
    >
      <TextField
        id="route-filter-query"
        label="Tỉnh / thành phố"
        placeholder="Tìm điểm đến"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {q ? null : option(null, ALL_LABEL)}
      {matches.map((d) => option(d.id, d.province))}
      {matches.length === 0 ? (
        <p role="status" className="text-sm text-muted">
          Chưa có tuyến đến “{query}”.
        </p>
      ) : null}
    </Dialog>
  );
}

/** List item hidden while another destination is selected. */
export function RouteFilterItem({
  destinationId,
  className,
  children,
}: {
  destinationId: string;
  className?: string;
  children: ReactNode;
}) {
  const { applied } = useRouteFilter();
  return (
    <li hidden={applied !== null && applied !== destinationId} className={className}>
      {children}
    </li>
  );
}

/** Removes a whole section when none of its routes match the applied filter. */
export function RouteFilterGroup({ destinationIds, children }: { destinationIds: string[]; children: ReactNode }) {
  const { applied } = useRouteFilter();
  if (applied && !destinationIds.includes(applied)) return null;
  return children;
}
