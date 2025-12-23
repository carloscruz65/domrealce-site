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
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  imagePosition?: "left" | "right";
  children?: React.ReactNode;

  /** ✅ Novo: quando true, o conteúdo não fica preso ao container (full width). */
  fullBleed?: boolean;

  /** ✅ Novo: permite alinhar o hero com a largura dos cards sem mexer aqui outra vez. */
  contentClassName?: string;
}

function HeroSkeleton({
  fullBleed = false,
  contentClassName,
}: {
  fullBleed?: boolean;
  contentClassName?: string;
}) {
  const wrapperClass = fullBleed
    ? "w-full px-4"
    : contentClassName ?? "mx-auto max-w-7xl px-4";

  return (
    <section className="w-full pt-24 md:pt-28 pb-10">
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

  // ✅ REGRA ANTI-FLASH:
  if (cmsEnabled && (isLoading || isFetching) && !data) {
    return <HeroSkeleton fullBleed={fullBleed} contentClassName={contentClassName} />;
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
    <div className="space-y-4">
      {resolved.badge ? (
        <div className="flex items-center gap-2">
          {badgeIcon ? <span className="text-brand-yellow">{badgeIcon}</span> : null}
          <span className="inline-flex items-center rounded-full bg-brand-yellow text-black px-3 py-1 text-xs font-semibold">
            {resolved.badge}
          </span>
        </div>
      ) : null}

      {resolved.title ? (
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-yellow">
          {resolved.title}
        </h1>
      ) : null}

      {resolved.subtitle ? (
        <p className="text-base md:text-lg text-white/80">{resolved.subtitle}</p>
      ) : null}

      {resolved.description ? (
        <p className="text-sm md:text-base text-white/70 leading-relaxed">
          {resolved.description}
        </p>
      ) : null}

      {isError && cmsEnabled ? (
        <p className="text-xs text-red-400">
          (Aviso) Falha ao carregar o CMS. A usar conteúdo base.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        {resolved.primaryCta?.href && resolved.primaryCta?.text ? (
          <Link href={resolved.primaryCta.href}>
            <Button className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
              {resolved.primaryCta.text} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : null}

        {resolved.secondaryCta?.href && resolved.secondaryCta?.text ? (
          <Link href={resolved.secondaryCta.href}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              {resolved.secondaryCta.text}
            </Button>
          </Link>
        ) : null}
      </div>

      {children}
    </div>
  );

  return (
    <section className="w-full pt-28 md:pt-32 pb-12">
      <div className={wrapperClass}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
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