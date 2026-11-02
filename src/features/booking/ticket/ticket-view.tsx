"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PageHero, Section } from "@/components/ui/section";
import { paths } from "@/lib/routes";
import { bookingActions, useBookingDraft, useStoreReady, useTickets } from "@/stores/booking-store";
import type { Ticket } from "@/types/domain";
import { scrollBehavior } from "@/lib/motion";
import { TicketCard } from "./ticket-card";

/** Placeholder while the client store / search params resolve (no flash of the empty state). */
export function TicketPageFallback() {
  return (
    <div aria-busy="true">
      <Section tone="paper">
        <div className="h-48.5 lg:h-53" />
      </Section>
      <Section tone="white">
        <div className="min-h-160" />
      </Section>
      <p className="sr-only" role="status">
        Đang tải vé điện tử…
      </p>
    </div>
  );
}

/**
 * Figma 15 · Xác nhận & vé điện tử (6:1217 / mobile 6:2877) + state "saved" (6:3288 / 6:3617).
 * Shows `?code=` when given, otherwise the ticket issued for the current booking.
 */
export function TicketView() {
  const params = useSearchParams();
  const codeParam = params.get("code")?.trim().toUpperCase() || null;
  const ready = useStoreReady();
  const draft = useBookingDraft();
  const tickets = useTickets();
  // Keeps the ticket on screen while "Đặt chuyến khác" resets the draft and navigates away.
  const [pinned, setPinned] = useState<string | null>(null);

  const code = codeParam ?? draft.ticketCode ?? pinned;
  const ticket = code ? tickets.find((t) => t.code === code) : undefined;

  if (!ready) return <TicketPageFallback />;
  if (!ticket) return <NoTicket code={codeParam} />;
  return <IssuedTicket ticket={ticket} onLeave={() => setPinned(ticket.code)} />;
}

function IssuedTicket({ ticket, onLeave }: { ticket: Ticket; onLeave: () => void }) {
  const router = useRouter();
  const [savedOpen, setSavedOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const reviewTicket = () => {
    setSavedOpen(false);
    // After the dialog has closed (and restored focus), move to the ticket.
    requestAnimationFrame(() => {
      titleRef.current?.focus({ preventScroll: true });
      titleRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
    });
  };

  const bookAnother = () => {
    onLeave();
    bookingActions.reset();
    router.push(paths.booking.search);
  };

  return (
    <>
      <PageHero
        crumb="Xác nhận"
        title={"Đặt vé thành công.\nHẹn gặp bạn tại Yên Sở."}
        description="Lưu vé và kiểm tra thông tin trước khi lên xe."
      />
      <Section tone="white">
        <TicketCard ticket={ticket} titleRef={titleRef} />
        <div className="flex flex-col gap-6">
          <Button className="w-full lg:w-85" aria-haspopup="dialog" onClick={() => setSavedOpen(true)}>
            Lưu vé điện tử
          </Button>
          <ButtonLink href={paths.organization} variant="secondary" className="w-full lg:w-85">
            Hướng dẫn tại bến
          </ButtonLink>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary">
          <Link href={paths.lookup} className="hover:underline">
            Tra cứu vé →
          </Link>
          <button type="button" onClick={bookAnother} className="hover:underline">
            Đặt chuyến khác →
          </button>
        </div>
      </Section>
      <Dialog
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Vé điện tử của bạn"
        description="Lưu mã vé và mã QR để xuất trình khi lên xe."
      >
        <Button className="w-full" onClick={reviewTicket}>
          Xem lại vé
        </Button>
      </Dialog>
    </>
  );
}

function NoTicket({ code }: { code: string | null }) {
  return (
    <>
      <PageHero
        crumb="Xác nhận"
        title="Chưa có vé điện tử."
        description={
          code
            ? `Không tìm thấy vé ${code} trên thiết bị này. Hãy tra cứu bằng mã vé và số điện thoại đã đặt.`
            : "Hoàn tất đặt vé để nhận phiếu lên xe, hoặc tra cứu vé đã đặt bằng mã vé và số điện thoại."
        }
      />
      <Section tone="white">
        <div className="flex flex-col gap-4 lg:flex-row">
          <ButtonLink href={paths.booking.search} className="w-full lg:w-85">
            Tìm chuyến xe
          </ButtonLink>
          <ButtonLink href={paths.lookup} variant="secondary" className="w-full lg:w-85">
            Tra cứu vé
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
