"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/field";
import { normalize } from "@/data/repositories/transport";
import type { Destination } from "@/types/domain";

/** Figma state "Trạng thái · location" (6:3110). */
export function LocationDialog({
  open,
  onClose,
  destinations,
  value,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  destinations: Destination[];
  value: string | null;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const q = normalize(query);
  const matches = destinations.filter(
    (d) => !q || normalize(d.province).includes(q) || normalize(d.label).includes(q),
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
        id="destination-query"
        label="Tỉnh / thành phố"
        placeholder="Tìm điểm đến"
        type="search"
        enterKeyHint="search"
        spellCheck={false}
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matches.map((d) => (
        <Button
          key={d.id}
          variant={d.id === value ? "primary" : "secondary"}
          aria-pressed={d.id === value}
          className="w-full"
          onClick={() => {
            setQuery("");
            onSelect(d.id);
          }}
        >
          {d.province}
        </Button>
      ))}
      {/* Persistent live region: screen readers announce text changes, not newly mounted nodes. */}
      <p role="status" className={matches.length ? "sr-only" : "text-sm text-muted"}>
        {matches.length
          ? query
            ? `${matches.length} điểm đến phù hợp`
            : ""
          : `Chưa có tuyến đặt vé trực tuyến đến “${query}”. Xem danh sách tuyến để biết thêm lịch chạy.`}
      </p>
    </Dialog>
  );
}

/** Origin is always the station itself; this explains it instead of a dead click. */
export function OriginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Điểm khởi hành"
      description="Website hỗ trợ đặt vé cho các chuyến khởi hành từ Bến xe Yên Sở."
    >
      <Button variant="primary" aria-pressed className="w-full" onClick={onClose}>
        Bến xe Yên Sở
      </Button>
    </Dialog>
  );
}
