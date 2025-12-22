import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

function HeroSkeleton() {
  return (
      <section className="w-full pt-24 md:pt-28 pb-10">
      <div className="mx-auto max-w-6xl px-4">
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
}: ServiceHeroTwoColumnProps) {
  const cmsEnabled = Boolean(serviceId && serviceId.trim() !== "");

  const { data, isLoading, isFetching, isError } = useQuery<HeroApiResponse>({
    queryKey: cmsEnabled ? ["/api/service-heroes", serviceId] : ["__no_cms__"],
    enabled: cmsEnabled,
    // Não precisamos de staleTime aqui; o QueryClient global já vai tratar disso.
    refetchOnWindowFocus: false,
  });

  // ✅ REGRA ANTI-FLASH:
  // Se CMS está ativo e ainda está a carregar (e não temos dados), mostramos skeleton.
  if (cmsEnabled && (isLoading || isFetching) && !data) {
    return <HeroSkeleton />;
  }

  const cmsHero = data?.hero ?? null;

  // Se vier CMS com conteúdo útil, usamos CMS. Se não vier (ou erro), fallback para props.
  const resolved = {
    badge: cmsHero?.badge ?? propBadge,
    title: cmsHero?.title ?? propTitle,
    subtitle: cmsHero?.subtitle ?? propSubtitle,
    description: cmsHero?.description ?? propDescription,
    imageSrc: cmsHero?.backgroundImage ?? propImageSrc,
    imageAlt: propImageAlt ?? "Imagem do serviço",
    primaryCta: cmsHero?.primaryCtaText && cmsHero?.primaryCtaHref
      ? { text: cmsHero.primaryCtaText, href: cmsHero.primaryCtaHref }
      : propPrimaryCta,
    secondaryCta: cmsHero?.secondaryCtaText && cmsHero?.secondaryCtaHref
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
          <Badge className="bg-white/10 text-white border border-white/10">
            {resolved.badge}
          </Badge>
        </div>
      ) : null}

      {resolved.title ? (
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
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
    <section className="w-full pt-24 md:pt-28 pb-12">
      <div className="mx-auto max-w-6xl px-4">
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