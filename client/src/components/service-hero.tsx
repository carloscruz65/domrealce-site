import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Eye } from "lucide-react";

interface ServiceHeroProps {
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: string;
  backgroundTexture?: string;
  gradientOverlay?: string;
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

export default function ServiceHero({
  badge,
  badgeIcon,
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundTexture,
  gradientOverlay = "from-black/90 via-black/80 to-black/90",
  primaryCta = {
    text: "Iniciar Meu Projeto",
    href: "/contactos#formulario"
  },
  secondaryCta = {
    text: "Contactar",
    href: "/contactos#formulario"
  },
  portfolioButton = true
}: ServiceHeroProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    : backgroundTexture
    ? {
        backgroundImage: backgroundTexture,
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat"
      }
    : {};

  return (
    <section 
      className="relative pt-32 pb-20 overflow-hidden"
      style={backgroundStyle}
    >
      {/* Overlay Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientOverlay}`} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-turquoise/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-brand-coral/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-brand-yellow text-black mb-6 text-base px-4 py-2">
            {badgeIcon}
            {badge}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            <span className="text-brand-yellow">{title}</span>
            {subtitle && (
              <>
                <br />
                <span className="text-white">{subtitle}</span>
              </>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button 
              asChild 
              className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-bold px-8 py-6 text-lg hover:scale-105 transition-transform"
            >
              <Link href={primaryCta.href}>
                {primaryCta.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black px-8 py-6 text-lg"
            >
              <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
            
            {portfolioButton && (
              <Button 
                asChild 
                variant="outline" 
                className="border-brand-yellow/50 text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
              >
                <Link href="/portfolio">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Portfólio
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
