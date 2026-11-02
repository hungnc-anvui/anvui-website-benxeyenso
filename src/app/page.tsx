import Image from "next/image";
import Link from "next/link";
import { BookingStepsSection } from "@/components/common/booking-steps";
import { FeaturedRoutesSection } from "@/components/common/featured-routes";
import { GalleryTeaserSection } from "@/components/common/gallery-teaser";
import { OperatorCard } from "@/components/common/operator-card";
import { PhotoCard } from "@/components/common/photo-card";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { images } from "@/data/mock/images";
import { getArticles } from "@/data/repositories/content";
import { getOperators } from "@/data/repositories/transport";
import { SearchForm } from "@/features/search/search-form";
import { SupportButton } from "@/features/support/support-provider";
import { paths, searchHref } from "@/lib/routes";

/** Figma 01 · Trang chủ — desktop 3:176, mobile 3:418. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickServices />
      <FeaturedRoutesSection />
      <AboutTeaser />
      <OperatorsTeaser />
      <BookingStepsSection />
      <GalleryTeaserSection />
      <NewsTeaser />
      <AssistantBand />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-white py-8 lg:py-10">
      <div className="container-page flex flex-col gap-6">
        <div className="grid gap-10 lg:grid-cols-[512fr_648fr]">
          <div className="flex flex-col gap-5">
            <Tag tone="mint">BẾN XE YÊN SỞ · HÀ NỘI</Tag>
            <h1 id="hero-title" className="text-h1 font-bold whitespace-pre-line text-navy lg:text-display">
              {"Khởi đầu an tâm.\nKết nối mọi\nhành trình."}
            </h1>
            <p className="max-w-[480px] text-body text-muted">
              Tìm tuyến xe, chọn nhà vận tải và đặt vé thuận tiện trong một trải nghiệm liền mạch.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={searchHref()} className="sm:w-60">
                Tìm chuyến xe
              </ButtonLink>
              <ButtonLink href={paths.about} variant="secondary" className="sm:w-60">
                Khám phá bến
              </ButtonLink>
            </div>
          </div>
          <div className="relative h-[272px] overflow-hidden rounded-xl md:h-[400px] lg:h-[460px]">
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              fill
              preload
              sizes="(min-width: 1024px) 648px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <SearchForm />
      </div>
    </section>
  );
}

const QUICK_SERVICES: Array<{ label: string; icon: IconName; href?: string }> = [
  { label: "Đặt vé trực tuyến", icon: "ticket", href: searchHref() },
  { label: "Tra cứu nhà xe", icon: "bus", href: paths.operators },
  { label: "Tìm khu vực tại bến", icon: "pin", href: paths.organization },
  { label: "Hỗ trợ hành khách", icon: "phone" },
];

function QuickServices() {
  const itemClass = "flex w-full items-center gap-3 text-body font-semibold text-white hover:underline";
  return (
    <nav aria-label="Dịch vụ nhanh" className="bg-navy py-8 lg:py-6">
      <ul className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {QUICK_SERVICES.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className={itemClass}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ) : (
              <SupportButton view="support" className={itemClass}>
                <Icon name={item.icon} />
                {item.label}
              </SupportButton>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AboutTeaser() {
  return (
    <Section tone="white" labelledBy="about-teaser-title">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="relative h-[240px] overflow-hidden rounded-xl lg:h-[370px]">
          <Image
            src={images.aerial.src}
            alt={images.aerial.alt}
            fill
            sizes="(min-width: 1024px) 580px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">
          <Eyebrow>HẠ TẦNG HIỆN ĐẠI · DỊCH VỤ THUẬN TIỆN</Eyebrow>
          <h2 id="about-teaser-title" className="text-h2 font-bold whitespace-pre-line text-navy">
            {"Một điểm đến.\nNhiều kết nối."}
          </h2>
          <p className="text-body text-muted">
            Không gian bến được tổ chức theo chức năng, kết hợp thông tin điện tử và dịch vụ hỗ trợ để hành khách chủ
            động hơn trên từng chặng đi.
          </p>
          <ButtonLink href={paths.about} className="w-full lg:w-[330px]">
            Tìm hiểu Bến xe Yên Sở
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

function OperatorsTeaser() {
  const operators = getOperators().slice(0, 3);
  return (
    <Section tone="white" labelledBy="operators-teaser-title">
      <SectionHeading
        id="operators-teaser-title"
        eyebrow="KẾT NỐI NHÀ VẬN TẢI"
        title="Chọn đúng nhà xe. Đi thật an tâm."
        description="Tra cứu tuyến khai thác, tiện ích và điều kiện vé của từng doanh nghiệp."
      />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {operators.map((operator) => (
          <li key={operator.id}>
            <OperatorCard operator={operator} />
          </li>
        ))}
      </ul>
      <p className="text-xs font-medium text-muted">Tên và tuyến doanh nghiệp đang dùng dữ liệu minh họa.</p>
      <ButtonLink href={paths.operators} variant="secondary" className="w-full lg:w-[280px]">
        Tất cả doanh nghiệp
      </ButtonLink>
    </Section>
  );
}

function NewsTeaser() {
  const articles = getArticles().slice(0, 6);
  return (
    <Section tone="paper" labelledBy="news-teaser-title">
      <SectionHeading
        id="news-teaser-title"
        eyebrow="NHỊP SỐNG YÊN SỞ"
        title="Tin tức, góc ảnh & cẩm nang"
        description="Khám phá bến và chuẩn bị cho hành trình."
      />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <PhotoCard
              image={article.image}
              eyebrow={article.category.toUpperCase()}
              title={article.title}
              description={article.excerpt}
              cta="Đọc bài viết"
              href={paths.article(article.slug)}
            />
          </li>
        ))}
      </ul>
      <ButtonLink href={paths.news} variant="secondary" className="w-full lg:w-[300px]">
        Xem tất cả tin tức
      </ButtonLink>
    </Section>
  );
}

function AssistantBand() {
  const button = buttonClass("light", "w-full");
  return (
    <Section tone="navy" labelledBy="assistant-title">
      <SectionHeading
        id="assistant-title"
        onDark
        size="lg"
        title="Bạn cần tìm chuyến hay tìm đường trong bến?"
        description="Hỏi trợ lý AI hoặc kết nối trực tiếp với bộ phận hỗ trợ."
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <SupportButton view="assistant" className={`${button} lg:w-[280px]`}>
          Hỏi trợ lý AI
        </SupportButton>
        <SupportButton view="zalo" className={`${button} lg:w-60`}>
          Chat Zalo
        </SupportButton>
        <SupportButton view="call" className={`${button} lg:w-60`}>
          Gọi tổng đài
        </SupportButton>
      </div>
    </Section>
  );
}
