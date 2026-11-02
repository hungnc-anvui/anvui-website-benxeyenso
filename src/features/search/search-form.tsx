"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FieldButton } from "@/components/ui/field";
import { getBookableDestinations, getDestination, ORIGIN_LABEL } from "@/data/repositories/transport";
import { cn } from "@/lib/cn";
import { addDays, formatDateField, formatDay, formatDayShort } from "@/lib/format";
import { searchHref } from "@/lib/routes";
import { useToday } from "@/lib/use-today";
import { CalendarDialog } from "./calendar-dialog";
import { LocationDialog, OriginDialog } from "./location-dialog";

type TripType = "oneway" | "roundtrip";
type Picker = "origin" | "destination" | "date" | "return" | null;

export type SearchFormInitial = {
  to?: string;
  date?: string;
  returnDate?: string;
};

type Errors = Partial<Record<"to" | "date" | "returnDate", string>>;

/**
 * Figma "Tìm kiếm đặt vé" (3:203 desktop / 3:442 mobile) with its overlays:
 * location (6:3110), calendar (6:2988) and roundtrip (6:3123).
 */
export function SearchForm({ initial, className }: { initial?: SearchFormInitial; className?: string }) {
  const router = useRouter();
  const today = useToday();
  const destinations = getBookableDestinations();

  const [tripType, setTripType] = useState<TripType>(initial?.returnDate ? "roundtrip" : "oneway");
  const [to, setTo] = useState<string | null>(initial?.to ?? "thanh-hoa");
  const [pickedDate, setPickedDate] = useState<string | null>(initial?.date ?? null);
  const [pickedReturn, setPickedReturn] = useState<string | null>(initial?.returnDate ?? null);
  const [picker, setPicker] = useState<Picker>(null);
  const [roundtripOpen, setRoundtripOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Default departure is today; a stale date from the URL is kept so the user sees why it is rejected.
  const date = pickedDate ?? today;
  const returnDate = pickedReturn ?? (date ? addDays(date, 3) : null);
  const destination = to ? getDestination(to) : undefined;

  const validate = (): Errors => {
    const next: Errors = {};
    if (!to) next.to = "Vui lòng chọn điểm đến";
    if (!date) next.date = "Vui lòng chọn ngày đi";
    else if (today && date < today) next.date = "Ngày đi đã qua, vui lòng chọn lại";
    if (tripType === "roundtrip") {
      if (!returnDate) next.returnDate = "Vui lòng chọn ngày về";
      else if (date && returnDate < date) next.returnDate = "Ngày về phải sau ngày đi";
    }
    return next;
  };

  const submit = (fromDialog = false) => {
    const next = validate();
    setErrors(next);
    const firstError = (["to", "date", "returnDate"] as const).find((key) => next[key]);
    if (firstError) {
      const ids = fromDialog
        ? { to: "rt-destination", date: "rt-date", returnDate: "rt-return" }
        : {
            to: "search-destination",
            date: tripType === "roundtrip" ? "search-dates" : "search-date",
            returnDate: "search-dates",
          };
      requestAnimationFrame(() => document.getElementById(ids[firstError])?.focus());
      return false;
    }
    router.push(
      searchHref({
        to: to!,
        date: date!,
        returnDate: tripType === "roundtrip" ? returnDate! : undefined,
      }),
    );
    return true;
  };

  const chooseTripType = (type: TripType) => {
    setTripType(type);
    if (type === "roundtrip") setRoundtripOpen(true);
  };

  const fields = (inDialog: boolean) => (
    <>
      <FieldButton
        id={inDialog ? "rt-origin" : "search-origin"}
        label="Điểm đi"
        value={ORIGIN_LABEL}
        onClick={() => setPicker("origin")}
      />
      <FieldButton
        id={inDialog ? "rt-destination" : "search-destination"}
        label="Điểm đến"
        value={destination?.province}
        placeholder="Chọn điểm đến"
        error={errors.to}
        onClick={() => setPicker("destination")}
      />
      {!inDialog && tripType === "roundtrip" ? (
        <FieldButton
          id="search-dates"
          label="Ngày đi · Ngày về"
          value={date && returnDate ? `${formatDayShort(date)} → ${formatDay(returnDate)}` : undefined}
          placeholder="Chọn ngày"
          error={errors.date ?? errors.returnDate}
          onClick={() => setRoundtripOpen(true)}
        />
      ) : (
        <FieldButton
          id={inDialog ? "rt-date" : "search-date"}
          label="Ngày đi · Dương / Âm"
          value={date ? formatDateField(date) : undefined}
          placeholder="Chọn ngày đi"
          error={errors.date}
          onClick={() => setPicker("date")}
        />
      )}
      {inDialog ? (
        <FieldButton
          id="rt-return"
          label="Ngày về · Dương / Âm"
          value={returnDate ? formatDateField(returnDate) : undefined}
          placeholder="Chọn ngày về"
          error={errors.returnDate}
          onClick={() => setPicker("return")}
        />
      ) : null}
    </>
  );

  return (
    <div className={cn("flex flex-col gap-4 rounded-lg bg-white p-4", className)}>
      <div
        role="radiogroup"
        aria-label="Loại hành trình"
        className="flex gap-4"
        onKeyDown={(event) => {
          // Radio keyboard model: arrows move the selection between the two options.
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          event.preventDefault();
          const next: TripType = tripType === "oneway" ? "roundtrip" : "oneway";
          chooseTripType(next);
          event.currentTarget.querySelector<HTMLButtonElement>(`[data-trip-type="${next}"]`)?.focus();
        }}
      >
        {(
          [
            ["oneway", "Một chiều"],
            ["roundtrip", "Khứ hồi"],
          ] as const
        ).map(([type, label]) => {
          const active = tripType === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              data-trip-type={type}
              onClick={() => chooseTripType(type)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full p-2 text-xs font-medium text-primary transition-colors",
                active ? "bg-sky" : "bg-paper hover:bg-sky",
              )}
            >
              <span aria-hidden="true">{active ? "●" : "○"}</span>
              {label}
            </button>
          );
        })}
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="grid items-start gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_316px]"
      >
        {fields(false)}
        <Button type="submit" className="w-full">
          Tìm chuyến xe
        </Button>
      </form>

      <Dialog open={roundtripOpen} onClose={() => setRoundtripOpen(false)} title="Chuyến đi và trở về">
        <div className="flex flex-col gap-4">{fields(true)}</div>
        <Button
          className="w-full"
          onClick={() => {
            if (submit(true)) setRoundtripOpen(false);
          }}
        >
          Tìm chuyến xe
        </Button>
      </Dialog>

      <OriginDialog open={picker === "origin"} onClose={() => setPicker(null)} />
      <LocationDialog
        open={picker === "destination"}
        onClose={() => setPicker(null)}
        destinations={destinations}
        value={to}
        onSelect={(id) => {
          setTo(id);
          setErrors((e) => ({ ...e, to: undefined }));
          setPicker(null);
        }}
      />
      <CalendarDialog
        open={picker === "date"}
        onClose={() => setPicker(null)}
        value={date}
        min={today}
        onConfirm={(iso) => {
          setPickedDate(iso);
          if (pickedReturn && pickedReturn < iso) setPickedReturn(null);
          setErrors((e) => ({ ...e, date: undefined }));
          setPicker(null);
        }}
      />
      <CalendarDialog
        open={picker === "return"}
        onClose={() => setPicker(null)}
        title="Chọn ngày về"
        value={returnDate}
        min={date ?? today}
        today={today}
        onConfirm={(iso) => {
          setPickedReturn(iso);
          setErrors((e) => ({ ...e, returnDate: undefined }));
          setPicker(null);
        }}
      />
    </div>
  );
}
