import Image from "next/image";
import type { Ref } from "react";
import { Tag } from "@/components/ui/tag";
import { getOperator, getRoute, getTrip } from "@/data/repositories/transport";
import { formatDay, formatLunar, formatVnd } from "@/lib/format";
import type { Ticket } from "@/types/domain";

/**
 * "PHIẾU LÊN XE" block of Figma 15 · Xác nhận & vé điện tử (6:1235 / mobile 6:2892).
 * Shared by the confirmation page and the ticket lookup result.
 */
export function TicketCard({
  ticket,
  titleId = "ticket-title",
  titleRef,
}: {
  ticket: Ticket;
  titleId?: string;
  titleRef?: Ref<HTMLHeadingElement>;
}) {
  const trip = getTrip(ticket.tripId);
  const route = trip ? getRoute(trip.routeId) : undefined;
  const operator = trip ? getOperator(trip.operatorId) : undefined;
  const seats = `Ghế ${ticket.seats.join(", ")}`;
  const breakdown = [
    `Giá niêm yết ${formatVnd(ticket.listTotal)}`,
    ticket.tripDiscount > 0 ? `Ưu đãi chuyến −${formatVnd(ticket.tripDiscount)}` : null,
    ticket.voucherDiscount > 0 ? `Voucher ${ticket.voucherCode ?? ""} −${formatVnd(ticket.voucherDiscount)}` : null,
  ].filter(Boolean);

  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-6">
      <Tag>✓ ĐÃ XÁC NHẬN</Tag>
      <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-h2 font-bold text-navy outline-none">
        PHIẾU LÊN XE
      </h2>
      <p className="text-title font-semibold text-navy">{route?.name ?? "Chuyến xe từ Bến xe Yên Sở"}</p>
      <div className="flex flex-col gap-1">
        <div className="text-body text-ink">
          <p>
            {ticket.passenger.fullName} · {seats}
          </p>
          <p>
            {trip ? `${trip.departTime} · ` : ""}
            {formatDay(ticket.date)} · Âm lịch {formatLunar(ticket.date)}
          </p>
          {trip ? <p>Có mặt tại bến lúc {trip.checkInTime}</p> : null}
          {operator ? <p>{operator.name}</p> : null}
          <p>
            Mã vé: <span className="font-semibold">{ticket.code}</span>
          </p>
          <p>
            Đã thanh toán: <span className="font-semibold">{formatVnd(ticket.total)}</span> · QR ngân hàng
          </p>
        </div>
        <p className="text-sm text-muted">{breakdown.join(" · ")}</p>
      </div>
      <Image
        src="/images/qr-demo.svg"
        alt={`Mã QR minh họa của vé ${ticket.code}`}
        width={180}
        height={180}
        loading="eager"
        className="size-45"
      />
      <p className="text-sm text-muted">Vé và QR minh họa, không có giá trị lên xe.</p>
    </article>
  );
}
