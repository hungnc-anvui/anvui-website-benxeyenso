"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <Section tone="paper" innerClassName="items-start py-10 lg:py-20">
      <p className="text-xs font-medium text-green">ĐÃ CÓ LỖI XẢY RA</p>
      <h1 className="text-h3 font-bold text-navy lg:text-h1">Trang chưa thể hiển thị.</h1>
      <p className="max-w-[600px] text-body text-muted">Vui lòng thử lại. Nếu lỗi tiếp diễn, hãy quay về trang chủ.</p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button onClick={retry} className="sm:w-60">
          Thử lại
        </Button>
        <ButtonLink href="/" variant="secondary" className="sm:w-60">
          Về trang chủ
        </ButtonLink>
      </div>
    </Section>
  );
}
