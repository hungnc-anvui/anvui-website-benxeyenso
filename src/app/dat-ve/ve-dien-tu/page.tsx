import type { Metadata } from "next";
import { Suspense } from "react";
import { TicketPageFallback, TicketView } from "@/features/booking/ticket/ticket-view";

export const metadata: Metadata = {
  title: "Vé điện tử",
  description: "Xác nhận đặt vé và phiếu lên xe điện tử của bạn.",
};

/** Figma 15 · Xác nhận & vé điện tử (6:1217 / 6:2877). `?code=` shows a specific issued ticket. */
export default function TicketPage() {
  return (
    <Suspense fallback={<TicketPageFallback />}>
      <TicketView />
    </Suspense>
  );
}
