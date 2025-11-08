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
  gradientOverlay?: string;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: string;
  height?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
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
  gradientOverlay: propGradientOverlay = "from-black/40 via-black/20 to-transparent",
  backgroundColor: propBackgroundColor,
  textColor: propTextColor,
  overlayOpacity: propOverlayOpacity,
  height: propHeight,
  primaryCta: propPrimaryCta = {
    text: "Iniciar Meu Projeto",
    href: "/contactos#formulario"
  },
  secondaryCta: propSecondaryCta = {
    text: "Contactar",
    href: "/contactos#formulario"
  },
  portfolioButton = true
}: ServiceHeroProps) {
  const { data: heroData, isLoading } = useQuery<HeroData>({
    queryKey: ['/api/service-heroes', serviceId],
    enabled: !!serviceId,
  });

  const badge = heroData?.badge || propBadge || "";
  const title = heroData?.title || propTitle || "";
  const subtitle = heroData?.subtitle || propSubtitle;
  const description = heroData?.description || propDescription || "";
  const backgroundImage = heroData?.backgroundImage || propBackgroundImage;
  const backgroundTexture = heroData?.backgroundTexture || propBackgroundTexture;
  const gradientOverlay = heroData?.gradientOverlay || propGradientOverlay;
  const backgroundColor = heroData?.backgroundColor || propBackgroundColor;
  const textColor = heroData?.textColor || propTextColor;
  const overlayOpacity = heroData?.overlayOpacity || propOverlayOpacity || "0.5";
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
      <section className="relative pt-32 pb-20 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
          <p className="text-gray-400">A carregar hero...</p>
        </div>
      </section>
    );
  }
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...(backgroundColor && { backgroundColor }),
        ...(customHeight && { minHeight: customHeight }),
      }
    : backgroundTexture
    ? {
        backgroundImage: backgroundTexture,
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        ...(backgroundColor && { backgroundColor }),
        ...(customHeight && { minHeight: customHeight }),
      }
    : {
        ...(backgroundColor && { backgroundColor }),
        ...(customHeight && { minHeight: customHeight }),
      };

  return (
    <section 
      className="relative pt-32 pb-20 overflow-hidden"
      style={backgroundStyle}
    >
      {/* Overlay Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay}`}
        style={{ opacity: parseFloat(overlayOpacity) }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-turquoise/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-brand-coral/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <Badge className="bg-brand-yellow text-black mb-6 text-base px-4 py-2">
              {badgeIcon}
              {badge}
            </Badge>
          )}
          
          <h1 
            className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight"
            style={textColor ? { color: textColor } : undefined}
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
            className="text-xl md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto"
            style={textColor ? { color: textColor, opacity: 0.9 } : { color: "#d1d5db" }}
          >
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button 
              asChild 
              className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-bold px-8 py-6 text-lg hover:scale-105 transition-transform"
            >
              <Link href={primaryCta.href} data-testid="button-primary-cta">
                {primaryCta.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black px-8 py-6 text-lg"
            >
              <Link href={secondaryCta.href} data-testid="button-secondary-cta">{secondaryCta.text}</Link>
            </Button>
            
            {portfolioButton && (
              <Button 
                asChild 
                variant="outline" 
                className="border-brand-yellow/50 text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
              >
                <Link href="/portfolio" data-testid="button-portfolio">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Portfólio
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
}
