import { Section, SectionHeading } from "@/components/ui/section";

export const BOOKING_STEPS = [
  { title: "Lựa chọn hành trình", text: "Chọn điểm đi, điểm đến, ngày đi và ấn “Tìm chuyến xe”." },
  { title: "Chọn chuyến", text: "Chọn chuyến phù hợp, ấn “Đặt chỗ” và chọn ghế." },
  { title: "Thanh toán", text: "Kiểm tra thông tin, chọn cổng và ấn “Thanh toán”." },
  { title: "Xác nhận", text: "Nhận thông tin đặt vé thành công và lên xe." },
] as const;

/** Figma "Hướng dẫn đặt vé" (3:321). */
export function BookingStepsSection() {
  return (
    <Section tone="sky" labelledBy="booking-steps-title">
      <SectionHeading id="booking-steps-title" eyebrow="BỐN BƯỚC DỄ DÀNG" title="Đặt vé rõ ràng. Lên xe thuận tiện." />
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {BOOKING_STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-lg bg-white p-6">
            <span className="text-h2 font-bold text-primary" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-title font-semibold text-navy">
              <span className="sr-only">Bước {i + 1}: </span>
              {step.title}
            </h3>
            <p className="text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">
        Kiểm tra điểm đón, giờ khởi hành và điều kiện vé. Chỗ được xác nhận sau khi thanh toán thành công.
      </p>
    </Section>
  );
}
