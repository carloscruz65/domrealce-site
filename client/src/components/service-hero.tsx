import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ServiceHeroProps {
  serviceId?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundTexture?: string;
  /** Se usar classes Tailwind (from-/via-/to-), aplica gradiente Tailwind; se for CSS (ex: 'linear-gradient(...)'), aplica via style.background */
  gradientOverlay?: string;
  /** Cor sólida do overlay (ex: 'rgba(0,0,0,0.6)', '#000000') */
  overlayColor?: string;
  backgroundColor?: string;
  textColor?: string;
  /** Opacidade do overlay, como string numérica. Renderiza overlay apenas se > 0. */
  overlayOpacity?: string;
  height?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  portfolioButton?: boolean;
}

interface HeroData {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundTexture?: string;
  gradientOverlay?: string;
  overlayColor?: string;        // <- NOVO
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: string;
  height?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function ServiceHero({
  serviceId,
  badge: propBadge,
  badgeIcon,
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  backgroundImage: propBackgroundImage,
  backgroundTexture: propBackgroundTexture,
  gradientOverlay: propGradientOverlay = "from-transparent via-transparent to-transparent",
  overlayColor: propOverlayColor, // <- NOVO
  backgroundColor: propBackgroundColor,
  textColor: propTextColor,
  overlayOpacity: propOverlayOpacity,
  height: propHeight,
  primaryCta: propPrimaryCta = { text: "Iniciar Meu Projeto", href: "/contactos#formulario" },
  secondaryCta: propSecondaryCta = { text: "Contactar", href: "/contactos#formulario" },
  portfolioButton = true,
}: ServiceHeroProps) {
  const { data: heroData, isLoading } = useQuery<HeroData>({
    queryKey: ["/api/service-heroes", serviceId],
    enabled: !!serviceId,
  });

  // ---------- Dados efetivos (backend sobrescreve props se vierem) ----------
  const badge = heroData?.badge || propBadge || "";
  const title = heroData?.title || propTitle || "";
  const subtitle = heroData?.subtitle || propSubtitle;
  const description = heroData?.description || propDescription || "";
  const backgroundImage = heroData?.backgroundImage || propBackgroundImage;
  const backgroundTexture = heroData?.backgroundTexture || propBackgroundTexture;
  const gradientOverlay = heroData?.gradientOverlay || propGradientOverlay;
  const overlayColor = heroData?.overlayColor || propOverlayColor; // <- NOVO
  const backgroundColor = heroData?.backgroundColor || propBackgroundColor;
  const textColor = heroData?.textColor || propTextColor;
  const overlayOpacity = heroData?.overlayOpacity || propOverlayOpacity || "0"; // padrão seguro: sem overlay
  const customHeight = heroData?.height || propHeight;

  const primaryCta = {
    text: heroData?.primaryCtaText || propPrimaryCta.text,
    href: heroData?.primaryCtaHref || propPrimaryCta.href,
  };

  const secondaryCta = {
    text: heroData?.secondaryCtaText || propSecondaryCta.text,
    href: heroData?.secondaryCtaHref || propSecondaryCta.href,
  };

  if (serviceId && isLoading) {
    return (
      <section className="relative pt-32 pb-20 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4" />
          <p className="text-gray-400">A carregar hero...</p>
        </div>
      </section>
    );
  }

  // ---------- Background (imagem | textura | cor) ----------
  const encodedBackgroundImage = backgroundImage ? encodeURI(backgroundImage) : null;

  // ---------- Overlay: gradiente Tailwind OU cor/gradiente CSS ----------
  const overlayIsVisible = parseFloat(overlayOpacity || "0") > 0;

  // Heurística: se a string do gradientOverlay tem classes tailwind de gradiente, usamos Tailwind;
  // Caso contrário, tratamos o valor como CSS em style.background (ou caímos para overlayColor).
  const looksLikeTailwindGradient =
    !!gradientOverlay && /(from-|via-|to-)/.test(gradientOverlay);

  return (
    <section 
      className="relative w-full"
      style={{
        backgroundColor: backgroundColor || "rgba(17, 24, 39, 0.5)",
      }}
    >
      {/* Imagem do hero - altura automática para responsividade */}
      {encodedBackgroundImage && (
        <img
          src={encodedBackgroundImage}
          alt={title}
          className="w-full h-auto object-contain"
          style={{
            display: "block",
            minHeight: "400px",
          }}
        />
      )}

      {/* Container absoluto para overlay e conteúdo - cobre APENAS a imagem */}
      <div className="absolute inset-0 flex items-center justify-center">
      {/* Overlay - z-1 para ficar ACIMA da imagem de fundo */}
      {overlayIsVisible &&
        (looksLikeTailwindGradient ? (
          <div
            className={`absolute inset-0 z-1 bg-gradient-to-br ${gradientOverlay}`}
            style={{ opacity: parseFloat(overlayOpacity) }}
          />
        ) : (
          <div
            className="absolute inset-0 z-1"
            style={{
              background:
                // prioridade: overlayColor sólido -> gradientOverlay como CSS -> fallback preto 60%
                overlayColor || gradientOverlay || "rgba(0,0,0,0.6)",
              opacity: parseFloat(overlayOpacity),
            }}
          />
        ))}

      {/* Elementos de fundo animados (apenas se overlay ativo) - z-2 para ficar acima do overlay */}
      {overlayIsVisible && (
        <div className="absolute inset-0 z-2 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-turquoise/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-brand-coral/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      )}

      {/* Conteúdo */}
      <div className="container mx-auto px-2 sm:px-4 relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {badge && (
            <Badge 
              className="bg-brand-yellow text-black mb-1 px-2 py-1"
              style={{ fontSize: "clamp(0.625rem, 1.5vw, 0.875rem)" }}
            >
              {badgeIcon}
              {badge}
            </Badge>
          )}

          <h1
            className="font-heading font-bold mb-1 leading-tight px-2"
            style={{
              fontSize: "clamp(1.25rem, 3.5vw, 3.5rem)",
              color: textColor,
            }}
          >
            <span className={textColor ? "" : "text-brand-yellow"}>{title}</span>
            {subtitle && (
              <>
                <br />
                <span className={textColor ? "" : "text-white"}>{subtitle}</span>
              </>
            )}
          </h1>

          <p
            className="mb-2 leading-snug max-w-3xl mx-auto px-2"
            style={{
              fontSize: "clamp(0.75rem, 1.75vw, 1.125rem)",
              color: textColor || "#d1d5db",
              opacity: textColor ? 0.9 : 1,
            }}
          >
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 justify-center items-center flex-wrap px-2">
            <Button
              asChild
              className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-bold hover:scale-105 transition-transform w-full sm:w-auto"
              style={{
                fontSize: "clamp(0.75rem, 1.25vw, 1rem)",
                padding: "clamp(0.375rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)",
              }}
            >
              <Link href={primaryCta.href} data-testid="button-primary-cta">
                {primaryCta.text}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black w-full sm:w-auto"
              style={{
                fontSize: "clamp(0.75rem, 1.25vw, 1rem)",
                padding: "clamp(0.375rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)",
              }}
            >
              <Link href={secondaryCta.href} data-testid="button-secondary-cta">
                {secondaryCta.text}
              </Link>
            </Button>

            {portfolioButton && (
              <Button
                asChild
                variant="outline"
                className="border-brand-yellow/50 text-brand-yellow hover:bg-brand-yellow hover:text-black w-full sm:w-auto"
                style={{
                  fontSize: "clamp(0.75rem, 1.25vw, 1rem)",
                  padding: "clamp(0.375rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)",
                }}
              >
                <Link href="/portfolio" data-testid="button-portfolio">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Ver Portfólio
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Fade inferior (apenas se overlay ativo) */}
      {overlayIsVisible && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      )}
      </div>
    </section>
  );
}
