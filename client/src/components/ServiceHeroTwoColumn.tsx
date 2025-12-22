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

export default function ServiceHeroTwoColumn({
  serviceId,
  badge: propBadge,
  badgeIcon,
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  imageSrc: propImageSrc = "/public-objects/servicos/placeholder.webp",
  imageAlt = "Serviço DOMREALCE",
  primaryCta: propPrimaryCta = { text: "Pedir Orçamento", href: "/contactos#formulario" },
  secondaryCta: propSecondaryCta = { text: "Ver Portfolio", href: "/portfolio" },
  imagePosition = "right",
  children,
}: ServiceHeroTwoColumnProps) {
  const { data: apiData } = useQuery<HeroApiResponse>({
    queryKey: ["/api/service-heroes", serviceId],
    enabled: !!serviceId,
    staleTime: 0, // Always fetch fresh data for hero content
    refetchOnMount: true,
  });

  const heroData = apiData?.hero;
  const badge = heroData?.badge || propBadge;
  const title = heroData?.title || propTitle || "Serviço";
  const subtitle = heroData?.subtitle || propSubtitle;
  const description = heroData?.description || propDescription;
  const imageSrc = heroData?.backgroundImage || propImageSrc;
  const primaryCta = {
    text: heroData?.primaryCtaText || propPrimaryCta.text,
    href: heroData?.primaryCtaHref || propPrimaryCta.href,
  };
  const secondaryCta = {
    text: heroData?.secondaryCtaText || propSecondaryCta.text,
    href: heroData?.secondaryCtaHref || propSecondaryCta.href,
  };
  const textContent = (
    <div className="flex flex-col justify-center h-full py-8 md:py-12 lg:py-16">
      {badge && (
        <Badge 
          variant="outline" 
          className="w-fit mb-4 text-brand-yellow border-brand-yellow/30 bg-brand-yellow/10"
        >
          {badgeIcon && <span className="mr-2">{badgeIcon}</span>}
          {badge}
        </Badge>
      )}
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-xl md:text-2xl text-brand-yellow font-medium mb-4">
          {subtitle}
        </p>
      )}
      
      {description && (
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
          {description}
        </p>
      )}

      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={primaryCta.href}>
          <Button 
            className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-semibold px-6 py-3"
            data-testid="button-hero-primary-cta"
          >
            {primaryCta.text}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        <Link href={secondaryCta.href}>
          <Button 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 px-6 py-3"
            data-testid="button-hero-secondary-cta"
          >
            {secondaryCta.text}
          </Button>
        </Link>
      </div>
    </div>
  );

  const imageContent = (
    <div className="relative h-[300px] md:h-[400px] lg:h-full w-full overflow-hidden rounded-2xl">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  return (
    <section className="bg-[#050505] pt-20 md:pt-24 pb-8 md:pb-12 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center min-h-[400px] md:min-h-[500px]">
          {imagePosition === "left" ? (
            <>
              <div className="order-2 md:order-1">{imageContent}</div>
              <div className="order-1 md:order-2">{textContent}</div>
            </>
          ) : (
            <>
              <div>{textContent}</div>
              <div>{imageContent}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
