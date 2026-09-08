import { useEffect, type ReactNode } from "react";
import { ArrowRight, CheckCircle, Palette, Scissors, Settings, Sticker, Zap } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackWhatsAppConversion } from "@/utils/trackWhatsApp";
import {
  selectPublicGalleryImages,
  type PublicGalleryImage,
} from "@/pages/servico-autocolantes-cms-data";

type Item = { id: string; position: number; visible: boolean; [key: string]: unknown };
type Section = {
  id: string;
  key?: string;
  type: string;
  position: number;
  visible: boolean;
  content: Record<string, unknown>;
};
type Page = {
  sections: Section[];
  seo?: { title: string; description: string; ogImage: string | null };
  legacyGallery?: { images?: PublicGalleryImage[] } | PublicGalleryImage[];
};

const WHATSAPP_URL = "https://wa.me/351930682725?text=Olá!%20Interessado%20em%20autocolantes.";
const asText = (value: unknown) => (typeof value === "string" ? value : "");
const asItems = (value: unknown) =>
  (Array.isArray(value) ? (value as Item[]) : [])
    .filter((item) => item.visible)
    .sort((a, b) => a.position - b.position);
const asGalleryColumns = (value: unknown): 2 | 3 | 4 => {
  const columns = Number(value);
  return columns === 2 || columns === 4 ? columns : 3;
};
const icons = { scissors: Scissors, sticker: Sticker, palette: Palette, settings: Settings, zap: Zap, "check-circle": CheckCircle };

export function CmsAutocolantesPage({
  page,
  calculatorUrl,
  legacyImages,
}: {
  page: Page;
  calculatorUrl: string;
  legacyImages: PublicGalleryImage[];
}) {
  const sections = [...page.sections]
    .filter((section) => section.visible)
    .sort((a, b) => a.position - b.position);

  useEffect(() => {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [sections]);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title={page.seo?.title}
        description={page.seo?.description}
        image={page.seo?.ogImage ?? undefined}
      />
      <Navigation />
      <main>{sections.map((section) => renderSection(section, page, calculatorUrl, legacyImages))}</main>
      <Footer />
    </div>
  );
}

function renderSection(
  section: Section,
  page: Page,
  calculatorUrl: string,
  legacyImages: PublicGalleryImage[],
) {
  const content = section.content;
  const sectionId = `section-${section.key ?? section.type}`;
  const sectionProps = { id: sectionId, "data-section-key": section.key ?? section.type, "data-section-type": section.type };

  if (section.type === "hero") {
    return (
      <div key={section.id} {...sectionProps}>
        <ServiceHeroTwoColumn
          badge={asText(content.badge)}
          badgeIcon={<Sticker className="h-4 w-4" />}
          title={asText(content.title)}
          subtitle={asText(content.subtitle)}
          description={asText(content.description)}
          imageSrc={asText(content.imageSrc)}
          imageAlt={asText(content.imageAlt)}
          textForward
          primaryCta={{
            text: asText((content.primaryCta as Record<string, unknown>)?.text),
            onClick: () => window.location.assign(calculatorUrl),
          }}
        >
          <p className="max-w-xl text-xs leading-relaxed text-white/60 md:text-sm">
            {asText(content.highlights)}
          </p>
        </ServiceHeroTwoColumn>
      </div>
    );
  }

  if (section.type === "ordering_steps") {
    return (
      <section key={section.id} {...sectionProps} className="border-y border-gray-900 bg-gray-900/40 py-10">
        <div className="container mx-auto px-4">
          <Title top={asText(content.titleTop)} highlight={asText(content.titleHighlight)} description={asText(content.description)} />
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {asItems(content.steps).map((step) => (
              <a
                key={step.id}
                id={`card-${step.id}`}
                data-card-id={step.id}
                href={calculatorUrl}
                className="group block h-full cursor-pointer rounded-xl border border-gray-800 bg-black p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-black">{asText(step.step)}</div>
                <h3 className="mb-2 font-semibold text-white">{asText(step.title)}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{asText(step.description)}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-brand-yellow transition-transform duration-200 group-hover:translate-x-1">{asText(step.linkText)}</span>
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
            {asItems(content.assurances).map((assurance) => (
              <span key={assurance.id} id={`card-${assurance.id}`} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-yellow" /> {asText(assurance.text)}
              </span>
            ))}
          </div>
          <CalculatorCta text={asText((content.cta as Record<string, unknown>)?.text)} href={calculatorUrl} />
        </div>
      </section>
    );
  }

  if (section.type === "application_examples") {
    return (
      <section key={section.id} {...sectionProps} className="border-b border-gray-900 bg-black py-14">
        <div className="container mx-auto px-4">
          <Title top={asText(content.titleTop)} highlight={asText(content.titleHighlight)} description={asText(content.description)} />
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {asItems(content.items).map((example) => (
              <div key={example.id} id={`card-${example.id}`} data-card-id={example.id} className="flex min-h-28 items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" />
                <h3 className="text-sm font-semibold leading-snug text-white md:text-base">{asText(example.text)}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "feature_accordions") {
    const cards: ServiceAccordionCard[] = asItems(content.items).map((item) => {
      const Icon = icons[asText(item.icon) as keyof typeof icons] ?? Sticker;
      return {
        key: asText(item.key),
        icon: <Icon className="h-6 w-6" />,
        title: asText(item.title),
        intro: asText(item.intro),
        content: Array.isArray(item.content) ? item.content.filter((value): value is string => typeof value === "string") : [],
      };
    });
    return (
      <section key={section.id} {...sectionProps}>
        <ServiceCardsSection
          titleTop={asText(content.titleTop)}
          titleBottom={asText(content.titleBottom)}
          subtitle={asText(content.subtitle)}
          cards={cards}
          defaultOpenKey={typeof content.defaultOpenKey === "string" ? content.defaultOpenKey : null}
        />
      </section>
    );
  }

  if (section.type === "gallery") {
    const fallback = asItems(content.fallbackImages)
      .map((image) => ({ src: asText(image.src), alt: asText(image.alt), title: asText(image.title) }))
      .filter((image) => image.src);
    const embedded = Array.isArray(page.legacyGallery) ? page.legacyGallery : page.legacyGallery?.images;
    return (
      <section key={section.id} {...sectionProps}>
        <ServiceGallery
          images={selectPublicGalleryImages(legacyImages, embedded, fallback)}
          title={asText(content.title)}
          description={asText(content.description)}
          columns={asGalleryColumns(content.columns)}
        />
      </section>
    );
  }

  if (section.type === "materials_applications_production") {
    return (
      <section key={section.id} {...sectionProps} className="border-t border-gray-900 bg-black py-14">
        <div className="container mx-auto px-4">
          <Title top={asText(content.titleTop)} highlight={asText(content.titleHighlight)} description={asText(content.description)} />
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            <InfoCard title={asText(content.materialsTitle)}>
              {asItems(content.materials).map((item) => <div key={item.id} id={`card-${item.id}`}><h4 className="text-sm font-semibold text-white">{asText(item.name)}</h4><p className="mt-1 text-sm text-gray-400">{asText(item.description)}</p></div>)}
            </InfoCard>
            <InfoCard title={asText(content.applicationsTitle)}>
              {asItems(content.applications).map((item) => <div key={item.id} id={`card-${item.id}`}><h4 className="text-sm font-semibold text-white">{asText(item.category)}</h4><p className="mt-1 text-sm text-gray-400">{Array.isArray(item.items) ? item.items.join(" · ") : ""}</p></div>)}
            </InfoCard>
            <InfoCard title={asText(content.productionTitle)}>
              {asItems(content.production).map((item) => <div key={item.id} id={`card-${item.id}`} className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-black">{asText(item.step)}</div><div><h4 className="text-sm font-semibold text-white">{asText(item.title)}</h4><p className="mt-1 text-sm leading-relaxed text-gray-400">{asText(item.description)}</p></div></div>)}
            </InfoCard>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "audiences") {
    return (
      <section key={section.id} {...sectionProps} className="border-y border-gray-900 bg-gray-900/40 py-14">
        <div className="container mx-auto px-4 text-center">
          <Title top={asText(content.titleTop)} highlight={asText(content.titleHighlight)} description={asText(content.description)} />
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4">
            {asItems(content.items).map((audience) => <div key={audience.id} id={`card-${audience.id}`} className="rounded-xl border border-gray-800 bg-black px-4 py-5 text-sm font-semibold text-white"><CheckCircle className="mx-auto mb-3 h-5 w-5 text-brand-yellow" />{asText(audience.text)}</div>)}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "trust") {
    return (
      <section key={section.id} {...sectionProps} className="bg-black py-14">
        <div className="container mx-auto grid max-w-5xl items-center gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-yellow">{asText(content.eyebrow)}</p><h2 className="font-heading text-3xl font-bold text-white md:text-4xl">{asText(content.title)}</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">{asItems(content.points).map((point) => <div key={point.id} id={`card-${point.id}`} className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-4"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" /><span className="text-sm leading-relaxed text-gray-200">{asText(point.text)}</span></div>)}</div>
        </div>
      </section>
    );
  }

  if (section.type === "video" && asText(content.url)) {
    return <section key={section.id} {...sectionProps} className="border-t border-gray-900 bg-black py-14"><div className="mx-auto max-w-5xl px-4 text-center"><Title top={asText(content.title)} highlight="" description={asText(content.description)} /><video id={`video-${section.id}`} controls poster={asText(content.poster) || undefined} className="w-full rounded-xl border border-gray-800"><source src={asText(content.url)} /></video></div></section>;
  }

  if (section.type === "final_cta") {
    const secondary = content.secondaryCta as Record<string, unknown>;
    return <section key={section.id} {...sectionProps} className="border-t border-gray-900 bg-black py-16"><div className="container mx-auto px-4 text-center"><h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl"><span className="text-white">{asText(content.titleTop)} </span><span className="text-brand-yellow">{asText(content.titleHighlight)}</span></h2><p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">{asText(content.description)}</p><div className="flex flex-col justify-center gap-4 sm:flex-row"><CalculatorButton text={asText((content.primaryCta as Record<string, unknown>)?.text)} href={calculatorUrl} large /><Button asChild variant="outline" className="border-brand-yellow px-8 py-6 text-lg text-brand-yellow hover:bg-brand-yellow hover:text-black"><a id="cta-whatsapp" href={asText(secondary?.href) || WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={(event) => { event.preventDefault(); trackWhatsAppConversion(asText(secondary?.href) || WHATSAPP_URL); }}>{asText(secondary?.text)}</a></Button></div><p className="mt-5 text-sm text-gray-500">{asText(content.footnote)}</p></div></section>;
  }
  return null;
}

function Title({ top, highlight, description }: { top: string; highlight: string; description: string }) {
  return <div className="mb-9 text-center"><h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl"><span className="text-white">{top}</span><span className="text-brand-yellow">{highlight}</span></h2><p className="mx-auto max-w-3xl leading-relaxed text-gray-400">{description}</p></div>;
}

function CalculatorCta({ text, href }: { text: string; href: string }) {
  return <div className="mt-8 text-center"><CalculatorButton text={text} href={href} /></div>;
}

function CalculatorButton({ text, href, large = false }: { text: string; href: string; large?: boolean }) {
  return <Button asChild className={`bg-brand-yellow font-bold text-black hover:bg-brand-yellow/90 ${large ? "px-8 py-6 text-lg" : "px-7 py-6"}`}><a href={href}>{text}<ArrowRight className={`${large ? "h-5 w-5" : "h-4 w-4"} ml-2`} /></a></Button>;
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return <Card className="border border-gray-800 bg-gray-900/60"><CardContent className="p-6"><h3 className="mb-4 text-xl font-semibold text-brand-yellow">{title}</h3><div className="space-y-4">{children}</div></CardContent></Card>;
}