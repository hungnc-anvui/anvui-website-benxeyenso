"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Figma states are 520px wide (calendar 480px, gallery lightbox 1120px). */
  size?: "sm" | "md" | "lg";
  /** Render the full-width ghost "Đóng" button used by every Figma state. */
  closeLabel?: string | null;
  className?: string;
};

const sizes = {
  sm: "max-w-[480px]",
  md: "max-w-[520px]",
  lg: "max-w-[1120px]",
};

/**
 * Modal built on native <dialog>: focus trap, Esc to close and top-layer
 * rendering come from the browser. Layout follows the Figma "Trạng thái · …" frames.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeLabel = "Đóng",
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // Close on backdrop only when the press also started there (not a text selection dragged out).
  const pressedBackdrop = useRef(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close when the component unmounts while open (e.g. route change).
  useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      // Esc: keep the element open and let the `open` prop drive closing. Listening to the
      // native "close" event instead would also fire when we close it programmatically
      // (e.g. switching from one support dialog to another) and reset the caller's state.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === ref.current;
      }}
      onClick={(event) => {
        if (event.target === ref.current && pressedBackdrop.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-y-auto overscroll-contain rounded-lg bg-white p-0 text-navy shadow-dock",
        sizes[size],
      )}
    >
      {open ? (
        <div className={cn("flex flex-col gap-4 p-4 lg:p-6", className)}>
          <h2 id={titleId} className="text-h3 font-bold lg:text-h2">
            {title}
          </h2>
          {description ? (
            <div id={descId} className="text-body text-muted">
              {description}
            </div>
          ) : null}
          {children}
          {closeLabel ? (
            <Button variant="ghost" onClick={onClose} className="w-full">
              {closeLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
