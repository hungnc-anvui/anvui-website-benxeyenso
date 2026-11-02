"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import type { GalleryPhoto } from "@/types/domain";

const OpenPhotoContext = createContext<(index: number) => void>(() => {});

/**
 * Holds the lightbox state for the gallery page. Server-rendered tiles open it through
 * `OpenPhotoButton`, so only the buttons and the dialog ship as client code.
 */
export function GalleryLightboxProvider({ photos, children }: { photos: GalleryPhoto[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <OpenPhotoContext value={setIndex}>
      {children}
      <GalleryLightbox photos={photos} index={index} onChange={setIndex} onClose={() => setIndex(null)} />
    </OpenPhotoContext>
  );
}

/** Button that opens photo `index` (position in the gallery list, 0-based). */
export function OpenPhotoButton({ index, ...props }: Omit<ComponentProps<"button">, "onClick" | "type"> & { index: number }) {
  const open = useContext(OpenPhotoContext);
  return <button type="button" aria-haspopup="dialog" onClick={() => open(index)} {...props} />;
}

/**
 * Figma "Xem ảnh · …" (30:3252 → 30:3351 desktop 1120 wide, 30:5144 → 30:5243 mobile 343 wide):
 * navy card, title, photo (fit), "n / 10 · Hình ảnh Bến xe Yên Sở", ← Trước / Sau →, Đóng ảnh.
 * Native <dialog>: focus trap + top layer; Esc closes, ←/→ browse (wrapping around).
 */
function GalleryLightbox({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Close on backdrop only when the press also started there (not a text selection dragged out).
  const pressedBackdrop = useRef(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const open = index !== null;
  const total = photos.length;
  const photo = index !== null ? photos[index] : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      nextRef.current?.focus();
    }
    if (!open && dialog.open) {
      dialog.close();
      returnFocusRef.current?.focus();
    }
  }, [open]);

  // Close when the page unmounts while open (e.g. navigation).
  useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const go = (delta: number) => {
    if (index === null) return;
    onChange((index + delta + total) % total);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      go(event.key === "ArrowLeft" ? -1 : 1);
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
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
      onKeyDown={onKeyDown}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-280 overflow-y-auto overscroll-contain rounded-xl bg-navy p-0 text-white shadow-dock"
    >
      {photo && index !== null ? (
        <div className="flex flex-col gap-4 p-4 lg:p-6">
          <h2 id={titleId} className="text-title font-semibold">
            {photo.title}
          </h2>
          <div className="relative h-[min(350px,calc(100dvh-284px))] min-h-50 overflow-hidden rounded-md lg:h-[min(650px,calc(100dvh-300px))]">
            <Image
              src={photo.image.src}
              alt={photo.image.alt}
              fill
              loading="eager"
              sizes="(min-width: 1168px) 1072px, calc(100vw - 64px)"
              className="object-contain"
            />
          </div>
          <p className="text-sm" aria-live="polite" aria-atomic="true">
            {index + 1} / {total} · Hình ảnh Bến xe Yên Sở
            <span className="sr-only">: {photo.title}</span>
          </p>
          <div className="grid grid-cols-2 gap-3 lg:flex">
            <Button variant="light" aria-label="Ảnh trước" onClick={() => go(-1)} className="lg:w-60">
              <span aria-hidden="true">←</span> Trước
            </Button>
            <Button ref={nextRef} variant="light" aria-label="Ảnh sau" onClick={() => go(1)} className="lg:w-60">
              Sau <span aria-hidden="true">→</span>
            </Button>
          </div>
          <Button variant="light" onClick={onClose} className="w-full">
            Đóng ảnh
          </Button>
        </div>
      ) : null}
    </dialog>
  );
}
