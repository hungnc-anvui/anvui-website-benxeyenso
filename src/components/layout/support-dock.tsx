"use client";

import { Icon } from "@/components/ui/icon";
import { useSupport } from "@/features/support/support-provider";
import { cn } from "@/lib/cn";

const bubble = "inline-flex size-12 items-center justify-center rounded-full text-xs font-medium transition-colors";

/**
 * Figma "Hỗ trợ luôn sẵn sàng": desktop shows Gọi / Zalo / AI (3:411) — only from 1360px,
 * where it sits in the side margin instead of over the 1200px content column —
 * smaller screens get a single phone button that opens the channel list (3:650).
 */
export function SupportDock() {
  const { open } = useSupport();
  return (
    <>
      <div
        role="group"
        aria-label="Hỗ trợ hành khách"
        className="fixed top-[290px] right-4 z-30 hidden flex-col gap-2 rounded-[32px] bg-white p-2 shadow-dock min-[1360px]:flex"
      >
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => open("call")}
          className={cn(bubble, "bg-sky text-primary hover:bg-sky-hover")}
        >
          Gọi
        </button>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => open("zalo")}
          className={cn(bubble, "bg-sky text-primary hover:bg-sky-hover")}
        >
          Zalo
        </button>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => open("assistant")}
          aria-label="Trợ lý AI"
          className={cn(bubble, "bg-primary text-white hover:bg-primary-hover")}
        >
          AI
        </button>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => open("support")}
        aria-label="Hỗ trợ hành khách"
        className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-white text-primary shadow-dock min-[1360px]:hidden"
      >
        <Icon name="phone" />
      </button>
    </>
  );
}
