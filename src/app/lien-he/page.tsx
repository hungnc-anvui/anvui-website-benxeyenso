import type { Metadata } from "next";
import Image from "next/image";
import { buttonClass } from "@/components/ui/button";
import { PageHero, Section } from "@/components/ui/section";
import { getStationContact } from "@/data/repositories/station";
import { ContactForm } from "@/features/contact/contact-form";
import { SupportButton } from "@/features/support/support-provider";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Hỏi về tuyến xe, đặt vé, dịch vụ và hướng dẫn đến bến.",
};

/** Figma 08 · Liên hệ — desktop 6:247, mobile 6:1975. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Liên hệ"
        title={"Kết nối đúng nơi.\nĐược hỗ trợ kịp thời."}
        description="Hỏi về tuyến xe, đặt vé, dịch vụ và hướng dẫn đến bến."
      />
      <Section tone="white" labelledBy="contact-title">
        <ContactChannels />
        <ContactForm />
      </Section>
    </>
  );
}

/**
 * "Contact layout" (6:266 / 6:1991): support channels + location photo.
 * Buttons open the prototype overlays call / zalo / assistant / directions — the
 * hotline and Zalo OA are unverified (handoff), so no numbers are shown.
 */
function ContactChannels() {
  const contact = getStationContact();
  return (
    <div className="grid gap-8 lg:grid-cols-[568fr_600fr]">
      <div className="flex flex-col gap-5">
        <h2 id="contact-title" className="text-h3 font-bold text-navy">
          {contact.name}
        </h2>
        <address className="text-body text-muted not-italic">{contact.address}</address>
        <SupportButton view="call" className={buttonClass("primary", "w-full")}>
          Gọi tổng đài bến
        </SupportButton>
        <SupportButton view="zalo" className={buttonClass("secondary", "w-full")}>
          Chat Zalo
        </SupportButton>
        <SupportButton view="assistant" className={buttonClass("secondary", "w-full")}>
          Hỏi trợ lý AI
        </SupportButton>
        <p className="text-sm text-muted">{contact.channelsNote}</p>
      </div>
      <figure className="flex flex-col gap-4">
        <div className="relative h-[230px] overflow-hidden rounded-lg md:h-[320px] lg:h-[360px]">
          <Image
            src={contact.photo.src}
            alt={contact.photo.alt}
            fill
            preload
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-xs font-medium text-muted">{contact.photoCaption}</figcaption>
        <SupportButton view="directions" className={buttonClass("secondary", "w-full")}>
          Xem hướng dẫn đến bến
        </SupportButton>
      </figure>
    </div>
  );
}
