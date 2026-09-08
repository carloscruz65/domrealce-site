import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HeroApiResponse {
  hero: {
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
  } | null;
}

interface ServiceHeroTwoColumnProps {
  serviceId?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryCta?: { text: string; href?: string; onClick?: () => void };
  secondaryCta?: { text: string; href?: string; onClick?: () => void };
  imagePosition?: "left" | "right";
  children?: React.ReactNode;

  /** ✅ quando true, o conteúdo não fica preso ao container (full width) */
  fullBleed?: boolean;

  /** ✅ permite alinhar o hero com a largura dos cards */
  contentClassName?: string;

  /** ✅ Novo: modo compacto (para abrir dentro de cards/listagens, reduz muito os espaçamentos) */
  compact?: boolean;

  /** ✅ Novo: evita repetir o título quando o card já o mostra */
  hideTitle?: boolean;

  /** Dá mais largura e presença à coluna de texto sem afetar o conteúdo */
  textForward?: boolean;
}

function HeroSkeleton({
  fullBleed = false,
  contentClassName,
  compact = false,
}: {
  fullBleed?: boolean;
  contentClassName?: string;
  compact?: boolean;
}) {
  const wrapperClass = fullBleed
    ? "w-full px-4"
    : contentClassName ?? "mx-auto max-w-7xl px-4";

  // ✅ compact: corta o “buraco” no topo quando usado dentro de um card
  const sectionPadding = compact
    ? "pt-6 md:pt-10 pb-8"
    : "pt-24 md:pt-28 pb-10";

  return (
    <section className={`w-full ${sectionPadding}`}>
      <div className={wrapperClass}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-white/10 animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-6 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="h-20 w-full rounded bg-white/10 animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-9 w-32 rounded bg-white/10 animate-pulse" />
              <div className="h-9 w-32 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="aspect-[16/10] w-full rounded-2xl bg-white/10 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function ServiceHeroTwoColumn({
  serviceId,
  badge: propBadge,
  badgeIcon,
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  imageSrc: propImageSrc,
  imageAlt: propImageAlt,
  primaryCta: propPrimaryCta,
  secondaryCta: propSecondaryCta,
  imagePosition = "right",
  children,

  fullBleed = false,
  contentClassName,

  compact = false,
  hideTitle = false,
  textForward = false,
}: ServiceHeroTwoColumnProps) {
  const cmsEnabled = Boolean(serviceId && serviceId.trim() !== "");

  const { data, isLoading, isFetching, isError } = useQuery<HeroApiResponse>({
    queryKey: cmsEnabled ? ["/api/service-heroes", serviceId] : ["__no_cms__"],
    enabled: cmsEnabled,
    refetchOnWindowFocus: false,
  });

  const wrapperClass = fullBleed
    ? "w-full px-4"
    : contentClassName ?? "mx-auto max-w-7xl px-4";

  // ✅ Anti-flash
  if (cmsEnabled && (isLoading || isFetching) && !data) {
    return (
      <HeroSkeleton
        fullBleed={fullBleed}
        contentClassName={contentClassName}
        compact={compact}
      />
    );
  }

  const cmsHero = data?.hero ?? null;

  const resolved = {
    badge: cmsHero?.badge ?? propBadge,
    title: cmsHero?.title ?? propTitle,
    subtitle: cmsHero?.subtitle ?? propSubtitle,
    description: cmsHero?.description ?? propDescription,
    imageSrc: cmsHero?.backgroundImage ?? propImageSrc,
    imageAlt: propImageAlt ?? "Imagem do serviço",
    primaryCta:
      cmsHero?.primaryCtaText && cmsHero?.primaryCtaHref
        ? { text: cmsHero.primaryCtaText, href: cmsHero.primaryCtaHref }
        : propPrimaryCta,
    secondaryCta:
      cmsHero?.secondaryCtaText && cmsHero?.secondaryCtaHref
        ? { text: cmsHero.secondaryCtaText, href: cmsHero.secondaryCtaHref }
        : propSecondaryCta,
  };

  const ImageBlock = (
    <div className="relative overflow-hidden rounded-2xl">
      {resolved.imageSrc ? (
        <img
          src={resolved.imageSrc}
          alt={resolved.imageAlt}
          className="w-full h-full object-cover aspect-[16/10]"
          loading="eager"
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-white/5" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    </div>
  );

  const TextBlock = (
    <div className={textForward ? "space-y-5" : "space-y-4"}>
      {resolved.badge ? (
        <div className="flex items-center gap-2">
          {badgeIcon ? <span className="text-brand-yellow">{badgeIcon}</span> : null}
          <span className="inline-flex items-center rounded-full bg-brand-yellow text-black px-3 py-1 text-xs font-semibold">
            {resolved.badge}
          </span>
        </div>
      ) : null}

      {/* ✅ evita repetição do título quando já existe no card */}
      {!hideTitle && resolved.title ? (
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-yellow">
          {resolved.title}
        </h1>
      ) : null}

      {resolved.subtitle ? (
        <p className="text-base md:text-lg text-white/80">{resolved.subtitle}</p>
      ) : null}

      {resolved.description ? (
        <p className={textForward
          ? "max-w-2xl text-base leading-relaxed text-white/70 md:text-[1.0625rem] lg:text-lg"
          : "text-sm md:text-base text-white/70 leading-relaxed"
        }>
          {resolved.description}
        </p>
      ) : null}

      {isError && cmsEnabled ? (
        <p className="text-xs text-red-400">
          (Aviso) Falha ao carregar o CMS. A usar conteúdo base.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        {resolved.primaryCta?.text ? (() => {
          const pCta = resolved.primaryCta!;
          const pClick = pCta.onClick
            ?? (pCta.href?.startsWith("http")
              ? () => window.open(pCta.href!, "_blank", "noopener,noreferrer")
              : pCta.href?.startsWith("#")
              ? () => {
                  const id = pCta.href!.slice(1);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }
              : undefined);
          if (pClick) {
            return (
              <Button onClick={pClick} className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                {pCta.text} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            );
          }
          if (pCta.href) {
            return (
              <Link href={pCta.href}>
                <Button className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                  {pCta.text} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            );
          }
          return null;
        })() : null}

        {resolved.secondaryCta?.text ? (() => {
          const sCta = resolved.secondaryCta!;
          const sClick = sCta.onClick
            ?? (sCta.href?.startsWith("http")
              ? () => window.open(sCta.href!, "_blank", "noopener,noreferrer")
              : sCta.href?.startsWith("#")
              ? () => {
                  const id = sCta.href!.slice(1);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }
              : undefined);
          if (sClick) {
            return (
              <Button onClick={sClick} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {sCta.text}
              </Button>
            );
          }
          if (sCta.href) {
            return (
              <Link href={sCta.href}>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  {sCta.text}
                </Button>
              </Link>
            );
          }
          return null;
        })() : null}
      </div>

      {children}
    </div>
  );

  // ✅ compact: corta o espaço no topo e no fundo quando está aberto dentro do card
  const sectionPadding = compact
  ? "pt-2 md:pt-10 pb-8"
  : "pt-16 md:pt-20 pb-12";

  return (
    <section className={`w-full ${sectionPadding}`}>
      <div className={wrapperClass}>
        <div className={`grid grid-cols-1 items-center gap-8 ${
          textForward
            ? "md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:gap-10"
            : "md:grid-cols-2"
        }`}>
          {imagePosition === "left" ? (
            <>
              {ImageBlock}
              {TextBlock}
            </>
          ) : (
            <>
              {TextBlock}
              {ImageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}