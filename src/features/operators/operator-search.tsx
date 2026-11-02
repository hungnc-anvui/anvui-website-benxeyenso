"use client";

import { createContext, use, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/field";
import { getOperators, searchOperators } from "@/data/repositories/transport";

/**
 * Live search of "04 · Danh sách doanh nghiệp" (field 5:307 / 6:1723, state "operatorSearch" 6:3244 / 6:3573).
 * Operator cards stay server-rendered; these wrappers only decide which ones are shown.
 */
const INITIAL_VISIBLE = 3;
const LIST_ID = "operator-list";

type OperatorSearchValue = {
  query: string;
  setQuery: (query: string) => void;
  expanded: boolean;
  showAll: () => void;
  matches: Set<string>;
  searching: boolean;
  openDialog: () => void;
};

const OperatorSearchContext = createContext<OperatorSearchValue | null>(null);

function useOperatorSearch() {
  const ctx = use(OperatorSearchContext);
  if (!ctx) throw new Error("Operator search components must be used inside <OperatorSearchProvider>");
  return ctx;
}

function scrollToList() {
  document.getElementById(LIST_ID)?.scrollIntoView({ block: "start" });
}

export function OperatorSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const searching = query.trim().length > 0;
  const matches = new Set(searchOperators(query).map((o) => o.id));

  const showAll = () => {
    setQuery("");
    setExpanded(true);
  };

  return (
    <OperatorSearchContext
      value={{ query, setQuery, expanded, showAll, matches, searching, openDialog: () => setDialogOpen(true) }}
    >
      {children}
      <OperatorSearchDialog
        open={dialogOpen}
        initialQuery={query}
        onClose={() => setDialogOpen(false)}
        onSubmit={(next) => {
          setQuery(next);
          setDialogOpen(false);
          requestAnimationFrame(scrollToList);
        }}
      />
    </OperatorSearchContext>
  );
}

/** "TÊN NHÀ XE / ĐIỂM ĐẾN" — filters the list as the user types (diacritic-insensitive). */
export function OperatorSearchField() {
  const { query, setQuery, searching, matches } = useOperatorSearch();
  return (
    <form
      role="search"
      aria-label="Tra cứu doanh nghiệp vận tải"
      onSubmit={(event) => {
        event.preventDefault();
        scrollToList();
      }}
      className="flex flex-col"
    >
      <TextField
        id="operator-query"
        type="search"
        label="Tên nhà xe / điểm đến"
        placeholder="Nhập tên doanh nghiệp hoặc tỉnh thành"
        autoComplete="off"
        enterKeyHint="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        containerClassName="lg:w-[700px]"
      />
      <p role="status" className="text-sm text-muted not-empty:mt-3">
        {searching
          ? matches.size
            ? `Tìm thấy ${matches.size} doanh nghiệp phù hợp với “${query.trim()}”.`
            : `Không tìm thấy doanh nghiệp phù hợp với “${query.trim()}”.`
          : null}
      </p>
    </form>
  );
}

/** Grid wrapper; hidden when nothing matches so the empty state takes its place. */
export function OperatorGrid({ children }: { children: ReactNode }) {
  const { searching, matches } = useOperatorSearch();
  return (
    <ul id={LIST_ID} hidden={searching && matches.size === 0} className="grid scroll-mt-6 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}

export function OperatorGridItem({ operatorId, index, children }: { operatorId: string; index: number; children: ReactNode }) {
  const { searching, matches, expanded } = useOperatorSearch();
  const visible = searching ? matches.has(operatorId) : expanded || index < INITIAL_VISIBLE;
  return (
    <li hidden={!visible} data-operator={operatorId}>
      {children}
    </li>
  );
}

export function OperatorEmptyState() {
  const { searching, matches, query, openDialog } = useOperatorSearch();
  if (!searching || matches.size > 0) return null;
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-paper p-6">
      <h3 className="text-title font-semibold text-navy">Chưa tìm thấy doanh nghiệp phù hợp</h3>
      <p className="text-sm text-muted">
        Không có doanh nghiệp nào khớp với “{query.trim()}”. Thử nhập tên doanh nghiệp, mã như “DN 01” hoặc tỉnh thành
        như Thanh Hóa, Vinh, Huế.
      </p>
      <Button onClick={openDialog} className="mt-1 w-full lg:w-[280px]">
        Tìm doanh nghiệp khác
      </Button>
    </div>
  );
}

/** "Tất cả doanh nghiệp": clears the search and reveals every operator, then moves focus to the first new card. */
export function ShowAllOperatorsButton() {
  const { searching, expanded, showAll } = useOperatorSearch();
  if (expanded && !searching) return null;
  const total = getOperators().length;
  return (
    <Button
      variant="secondary"
      className="w-full lg:w-[280px]"
      onClick={() => {
        const focusIndex = searching ? 0 : INITIAL_VISIBLE;
        showAll();
        requestAnimationFrame(() => {
          const links = document.querySelectorAll<HTMLAnchorElement>(`#${LIST_ID} > li a`);
          links[Math.min(focusIndex, links.length - 1)]?.focus();
        });
      }}
    >
      Tất cả doanh nghiệp
      <span className="sr-only"> ({total})</span>
    </Button>
  );
}

/** Figma state "Trạng thái · operatorSearch" (6:3244 desktop / 6:3573 mobile). */
function OperatorSearchDialog({
  open,
  initialQuery,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
  onSubmit: (query: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Tìm doanh nghiệp vận tải">
      {/* Dialog only renders children while open, so the draft restarts from the current search each time. */}
      <OperatorSearchDialogForm initialQuery={initialQuery} onSubmit={onSubmit} />
    </Dialog>
  );
}

function OperatorSearchDialogForm({ initialQuery, onSubmit }: { initialQuery: string; onSubmit: (query: string) => void }) {
  const [draft, setDraft] = useState(initialQuery);
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(draft);
      }}
    >
      <TextField
        id="operator-dialog-query"
        type="search"
        label="Tên doanh nghiệp"
        placeholder="Nhập tên doanh nghiệp"
        autoComplete="off"
        enterKeyHint="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Xem danh sách doanh nghiệp
      </Button>
    </form>
  );
}
