"use client";

import Link from "next/link";
import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { Button, buttonClass } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextAreaField } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { paths } from "@/lib/routes";

/**
 * Support channels — Figma states support / call / zalo / assistant /
 * assistantReply / directions / requestSent / otherTrip. Hotline and Zalo OA are
 * not verified yet (handoff note 10), so requests go through the contact form.
 */
export type SupportView =
  | "support"
  | "call"
  | "zalo"
  | "assistant"
  | "directions"
  | "requestSent"
  | "otherTrip";

type SupportContextValue = { open: (view: SupportView) => void; close: () => void };

const SupportContext = createContext<SupportContextValue | null>(null);

export function useSupport() {
  const ctx = use(SupportContext);
  if (!ctx) throw new Error("useSupport must be used inside <SupportProvider>");
  return ctx;
}

type Answer = { title: string; text: string; href?: string; cta?: string };

const QUICK_QUESTIONS: Array<{ label: string; answer: Answer }> = [
  {
    label: "Tìm chuyến xe phù hợp",
    answer: {
      title: "Tìm chuyến xe phù hợp",
      text: "Chọn điểm đến và ngày đi (có hiển thị âm lịch), sau đó ấn “Tìm chuyến xe”. Bạn có thể lọc theo giờ đi, loại xe và tiện ích.",
      href: paths.booking.search,
      cta: "Mở trang tìm chuyến",
    },
  },
  {
    label: "Cách đến Bến xe Yên Sở",
    answer: {
      title: "Hướng dẫn đến bến",
      text: "Bến xe nằm tại khu vực đường Đỗ Mười / Vành đai 3, Hà Nội. Hãy kiểm tra điểm đón trên vé và đến sớm để làm thủ tục.",
      href: paths.contact,
      cta: "Xem liên hệ & chỉ đường",
    },
  },
  {
    label: "Dịch vụ và tổ chức bến",
    answer: {
      title: "Dịch vụ và tổ chức bến",
      text: "Bến có quầy vé, khu vực thông tin, sảnh chờ và khu vực đón trả khách. Xem sơ đồ tổ chức bến để tìm đúng khu vực bạn cần.",
      href: paths.organization,
      cta: "Xem tổ chức bến",
    },
  },
  {
    label: "Tôi muốn gặp nhân viên",
    answer: {
      title: "Kết nối nhân viên hỗ trợ",
      text: "Để lại họ tên, số điện thoại và nội dung cần hỗ trợ, bộ phận chăm sóc hành khách sẽ tiếp nhận và phản hồi.",
      href: `${paths.contact}#loi-nhan`,
      cta: "Gửi yêu cầu cho nhân viên",
    },
  },
];

const KEYWORDS: Array<{ words: string[]; index: number }> = [
  { words: ["duong", "den ben", "dia chi", "o dau", "chi duong", "vanh dai"], index: 1 },
  { words: ["dich vu", "quay", "sanh", "to chuc", "khu vuc", "gui do", "wc"], index: 2 },
  { words: ["nhan vien", "tong dai", "goi", "zalo", "khieu nai"], index: 3 },
  { words: ["chuyen", "ve", "dat", "gia", "lich", "tuyen", "ghe"], index: 0 },
];

function answerFor(question: string): Answer {
  const q = question
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
  const hit = KEYWORDS.find((k) => k.words.some((w) => q.includes(w)));
  if (hit) return QUICK_QUESTIONS[hit.index].answer;
  return {
    title: "Trợ lý đang ở chế độ minh họa",
    text: "Câu trả lời tự động sẽ dùng nguồn tri thức được bến duyệt. Bạn có thể chọn câu hỏi gợi ý hoặc gửi yêu cầu để nhân viên hỗ trợ.",
    href: `${paths.contact}#loi-nhan`,
    cta: "Gửi yêu cầu cho nhân viên",
  };
}

const inlineCta = "inline-flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-primary underline";

export function SupportProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<SupportView | null>(null);
  // Stable value: opening a dialog must not re-render every consumer.
  const value = useMemo<SupportContextValue>(() => ({ open: setView, close: () => setView(null) }), []);
  const { open, close } = value;

  /** Hotline / Zalo are unverified, so a request goes through the contact form (which confirms it). */
  const requestLink = (
    <Link href={`${paths.contact}#loi-nhan`} onClick={close} className={buttonClass("primary", "w-full")}>
      Gửi yêu cầu hỗ trợ
    </Link>
  );

  return (
    <SupportContext value={value}>
      {children}

      <Dialog
        open={view === "support"}
        onClose={close}
        title="Bạn cần hỗ trợ gì?"
        description="Tiếp tục hành trình với sự hỗ trợ từ bến xe."
        closeLabel="Quay lại đặt vé"
      >
        <Button variant="secondary" className="w-full" onClick={() => open("call")}>
          Gọi điện tư vấn
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => open("zalo")}>
          Chat Zalo
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => open("assistant")}>
          Hỏi trợ lý AI
        </Button>
      </Dialog>

      <Dialog
        open={view === "call"}
        onClose={close}
        title="Gọi Bến xe Yên Sở"
        description="Số tổng đài chính thức sẽ được cập nhật tại đây. Bạn có thể gửi yêu cầu để được hỗ trợ."
      >
        {requestLink}
      </Dialog>

      <Dialog
        open={view === "zalo"}
        onClose={close}
        title="Kết nối qua Zalo"
        description="Tài khoản Zalo chính thức của bến xe sẽ được cập nhật tại đây."
      >
        {requestLink}
      </Dialog>

      <Dialog
        open={view === "directions"}
        onClose={close}
        title="Hướng dẫn đến bến"
        description="Khu vực đường Đỗ Mười / Vành đai 3, Hà Nội. Đối chiếu điểm đón trên vé trước khi đến."
      >
        <Button className="w-full" onClick={() => open("assistant")}>
          Hỏi nhân viên
        </Button>
      </Dialog>

      <Dialog
        open={view === "otherTrip"}
        onClose={close}
        title="Thông tin chuyến xe"
        description="Liên hệ doanh nghiệp vận tải để xác nhận lịch chạy và chỗ còn trống."
      >
        <Button className="w-full" onClick={() => open("support")}>
          Liên hệ hỗ trợ
        </Button>
      </Dialog>

      <Dialog
        open={view === "requestSent"}
        onClose={close}
        title="Đã ghi nhận yêu cầu"
        description="Bộ phận hỗ trợ sẽ tiếp nhận nội dung và phản hồi qua thông tin bạn cung cấp."
      >
        <Link href={paths.home} onClick={close} className={buttonClass("primary", "w-full")}>
          Về trang chủ
        </Link>
      </Dialog>

      <AssistantDialog open={view === "assistant"} onClose={close} />
    </SupportContext>
  );
}

/** Figma states "assistant" (6:3190) and "assistantReply" (6:3212) — scripted answers only. */
function AssistantDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState<string>();

  const close = () => {
    setAnswer(null);
    setQuestion("");
    setQuestionError(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} title="Trợ lý Yên Sở">
      <Tag>AI · HỖ TRỢ THÔNG TIN</Tag>
      <div aria-live="polite" className="flex flex-col gap-2 rounded-md bg-sky p-4">
        <p className="text-sm font-semibold text-primary">{answer ? answer.title : "Xin chào, tôi có thể giúp gì?"}</p>
        <p className="text-sm text-muted">
          {answer ? answer.text : "Tìm tuyến xe, hướng dẫn đặt vé hoặc tìm hiểu dịch vụ tại bến."}
        </p>
        {answer?.href ? (
          <Link href={answer.href} onClick={close} className={inlineCta}>
            {answer.cta} <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
      {QUICK_QUESTIONS.map((q) => (
        <Button key={q.label} variant="secondary" className="w-full" onClick={() => setAnswer(q.answer)}>
          {q.label}
        </Button>
      ))}
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!question.trim()) {
            setQuestionError("Vui lòng nhập nội dung cần hỗ trợ.");
            return;
          }
          setQuestionError(undefined);
          setAnswer(answerFor(question));
          setQuestion("");
        }}
      >
        <TextAreaField
          id="assistant-question"
          label="Câu hỏi của bạn"
          placeholder="Nhập nội dung cần hỗ trợ…"
          rows={2}
          value={question}
          error={questionError}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Gửi câu hỏi
        </Button>
      </form>
    </Dialog>
  );
}

/** Button that opens a support dialog — usable from Server Components. */
export function SupportButton({
  view,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  view: SupportView;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const { open } = useSupport();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      aria-label={ariaLabel}
      onClick={() => open(view)}
    >
      {children}
    </button>
  );
}
