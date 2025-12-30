import React, { useEffect, useMemo, useRef, useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceGallery from "@/components/service-gallery";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { MachinesSection } from "@/components/services/MachinesSection";
import { TrucksSection } from "@/components/services/TrucksSection";
import ServicesAvailableSection from "@/components/services/ServicesAvailableSection";

import {
  Car,
  Star,
  ArrowRight,
  ArrowLeft,
  Truck,
  Bike,
  Bus,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Tipagem da resposta da API do HERO (igual ao que o ServiceHeroTwoColumn usa)
 * GET /api/service-heroes/:serviceId  (via react-query queryKey)
 */
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

// Configuração de imagens por sub-serviço (desacoplado)
const subServiceConfig: Record<
  string,
  {
    apiId: string;
    heroImage: string;
    heroAlt: string;
    defaultGalleryImages: Array<{ src: string; alt: string; title: string }>;
  }
> = {
  particulares: {
    apiId: "decoracao-viaturas-particulares",
    heroImage: "/public-objects/servicos/decoracao-viaturas/particulares.webp",
    heroAlt: "Personalização de viaturas particulares DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/decoracao-viaturas/particulares-1.webp",
        alt: "Viatura particular personalizada",
        title: "Personalização Discreta",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/particulares-2.webp",
        alt: "Faixas decorativas em viatura",
        title: "Faixas Decorativas",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/particulares-3.webp",
        alt: "Detalhes em vinil",
        title: "Detalhes Personalizados",
      },
    ],
  },
  comerciais: {
    apiId: "decoracao-viaturas-comerciais",
    heroImage: "/public-objects/servicos/decoracao-viaturas/comerciais.webp",
    heroAlt: "Decoração de veículos comerciais DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/decoracao-viaturas/comerciais-1.webp",
        alt: "Carrinha comercial decorada",
        title: "Rotulagem Comercial",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/comerciais-2.webp",
        alt: "Frota com identidade visual",
        title: "Identificação de Frota",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/comerciais-3.webp",
        alt: "Publicidade móvel",
        title: "Publicidade Móvel",
      },
    ],
  },
  competicao: {
    apiId: "decoracao-viaturas-competicao",
    heroImage: "/public-objects/servicos/decoracao-viaturas/competicao.webp",
    heroAlt: "Decoração de viaturas de competição DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/decoracao-viaturas/competicao-1.webp",
        alt: "Viatura de rally decorada",
        title: "Patrocinadores",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/competicao-2.webp",
        alt: "Numeração de competição",
        title: "Numeração Oficial",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/competicao-3.webp",
        alt: "Layout de pista",
        title: "Design de Competição",
      },
    ],
  },
  motos: {
    apiId: "decoracao-viaturas-motos",
    heroImage: "/public-objects/servicos/decoracao-viaturas/motos.webp",
    heroAlt: "Decoração de motociclos DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/decoracao-viaturas/motos-1.webp",
        alt: "Motociclo personalizado",
        title: "Design Único",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/motos-2.webp",
        alt: "Proteção de depósito",
        title: "Proteção de Depósito",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/motos-3.webp",
        alt: "Detalhes especiais",
        title: "Efeitos Especiais",
      },
    ],
  },
  camioes: {
    apiId: "decoracao-viaturas-camioes",
    heroImage: "/public-objects/servicos/decoracao-viaturas/camioes.webp",
    heroAlt: "Decoração de camiões e atrelados DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/decoracao-viaturas/camioes-1.webp",
        alt: "Camião com rotulagem completa",
        title: "Rotulagem Total",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/camioes-2.webp",
        alt: "Atrelado decorado",
        title: "Grande Formato",
      },
      {
        src: "/public-objects/servicos/decoracao-viaturas/camioes-3.webp",
        alt: "Frota de transporte",
        title: "Identificação de Frota",
      },
    ],
  },
  maquinas: {
    apiId: "decoracao-viaturas-maquinas",
    heroImage: "/public-objects/servicos/maquinas/hero.webp",
    heroAlt: "Máquina industrial com decoração DOMREALCE",
    defaultGalleryImages: [
      {
        src: "/public-objects/servicos/maquinas/maquina-1.webp",
        alt: "Escavadora decorada",
        title: "Máquinas de Construção",
      },
      {
        src: "/public-objects/servicos/maquinas/maquina-2.webp",
        alt: "Empilhador com identificação",
        title: "Equipamento Logístico",
      },
      {
        src: "/public-objects/servicos/maquinas/maquina-3.webp",
        alt: "Grua com sinalização",
        title: "Sinalização de Segurança",
      },
    ],
  },
};

const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    alt: "Carrinha comercial com decoração em vinil",
    title: "Decoração de Frotas Comerciais",
  },
  {
    src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
    alt: "Viatura de competição com autocolantes de patrocinadores",
    title: "Viaturas de Competição",
  },
  {
    src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?w=800&q=80",
    alt: "Processo de instalação de vinil em viatura",
    title: "Instalação Profissional",
  },
];

function getSubServiceConfig(key: string | null) {
  if (!key) return null;
  return subServiceConfig[key] || null;
}

type VehicleKey =
  | "particulares"
  | "comerciais"
  | "competicao"
  | "camioes"
  | "motos"
  | "maquinas";

function GallerySkeleton() {
  return (
    <section className="w-full py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4">
          <div className="h-7 w-56 rounded bg-white/10 animate-pulse" />
          <div className="mt-2 h-4 w-96 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] rounded-2xl bg-white/10 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// md=2 colunas, lg=3 colunas
function useDesktopCols() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const calc = () => {
      if (typeof window === "undefined") return 3;
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const update = () => setCols(calc());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

export default function ServicoDecoracaoViaturas() {
  const [activeVehicle, setActiveVehicle] = useState<VehicleKey | null>(null);

  const revealRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gridRef = useRef<HTMLDivElement | null>(null);

  const hasSelection = Boolean(activeVehicle);
  const desktopCols = useDesktopCols();

  const sectionRef = useRef<HTMLElement | null>(null);

  function openVehicle(key: VehicleKey) {
    setActiveVehicle((prev) => {
      const next = prev === key ? null : key;

      if (next) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const headerOffset = 100;
            const section = sectionRef.current;
            if (section) {
              const elementPosition = section.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }
          }, 50);
        });
      }

      return next;
    });
  }

  const activeConfig = getSubServiceConfig(activeVehicle);
  const activeApiId = activeConfig?.apiId || "decoracao-viaturas-particulares";

  const {
    data: galleryData,
    isLoading: galleryLoading,
    isFetching: galleryFetching,
  } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", activeApiId],
    enabled: hasSelection,
  });

  const cmsHasImages = Boolean(galleryData?.images?.length);
  const isGalleryLoading =
    hasSelection && (galleryLoading || galleryFetching) && !galleryData;

  const galleryImages = cmsHasImages
    ? galleryData!.images
    : isGalleryLoading
      ? []
      : activeConfig?.defaultGalleryImages || defaultImages;

  const vehicleTypes: Array<{
    key: VehicleKey;
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
  }> = [
    {
      key: "particulares",
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas particulares",
      description: "Personalização e detalhes.",
      features: [
        "Detalhes e faixas",
        "Autocolantes personalizados",
        "Peças simples (sem desmontagens críticas)",
        "Avaliação conforme a viatura",
      ],
    },
    {
      key: "comerciais",
      icon: <Truck className="w-8 h-8" />,
      title: "Veículos comerciais",
      description: "Publicidade móvel para o seu negócio.",
      features: [
        "Identificação da empresa",
        "Contactos e serviços",
        "Promoções e campanhas",
        "Rotulagem total ou parcial",
      ],
    },
    {
      key: "competicao",
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas de competição",
      description: "Decoração para desportos motorizados.",
      features: [
        "Patrocinadores",
        "Numeração",
        "Layouts rápidos",
        "Materiais específicos",
      ],
    },
    {
      key: "camioes",
      icon: <Bus className="w-8 h-8" />,
      title: "Camiões e atrelados",
      description: "Grande formato com leitura à distância.",
      features: [
        "Rotulagem por painéis / total",
        "Criação por referência (fotos do cliente)",
        "Renovação de decorações existentes",
        "Aplicação no local do cliente",
      ],
    },
    {
      key: "motos",
      icon: <Bike className="w-8 h-8" />,
      title: "Motociclos",
      description: "Personalização para motociclos.",
      features: ["Designs únicos", "Proteção do depósito", "Detalhes especiais", "Efeitos"],
    },
    {
      key: "maquinas",
      icon: <Settings className="w-8 h-8" />,
      title: "Máquinas de obras",
      description: "Identificação técnica e sinalização de segurança.",
      features: [
        "Reposição de logótipos de origem",
        "Sinais de perigo / aviso / segurança",
        "Numeração de frota",
        "Cores corporativas",
      ],
    },
  ];

  const vehicleKeys = vehicleTypes.map((v) => v.key);
  const currentIndex = activeVehicle ? vehicleKeys.indexOf(activeVehicle) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < vehicleKeys.length - 1;

  const goToPrev = () => {
    if (hasPrev) openVehicle(vehicleKeys[currentIndex - 1]);
  };
  const goToNext = () => {
    if (hasNext) openVehicle(vehicleKeys[currentIndex + 1]);
  };

  const closeAndScrollToGrid = () => {
    setActiveVehicle(null);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const VehicleSubNav = () => (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 md:mb-4 p-2 md:p-3 bg-gray-800/80 rounded-lg border border-gray-700">
      <Button
        variant="ghost"
        size="sm"
        onClick={closeAndScrollToGrid}
        className="text-brand-yellow hover:text-yellow-400 text-xs sm:text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar aos serviços
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPrev}
          disabled={!hasPrev}
          className="text-gray-300 hover:text-white disabled:opacity-40 text-xs sm:text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          className="text-gray-300 hover:text-white disabled:opacity-40 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Seguinte</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderVehicleDetails = (key: VehicleKey) => {
    if (key === "particulares") {
      return (
        <ServiceHeroTwoColumn
          compact
          hideTitle
          serviceId={subServiceConfig.particulares.apiId}
          badge="Particulares"
          badgeIcon={<Car className="w-4 h-4" />}
          title="Viaturas particulares"
          subtitle="Personalização e detalhes"
          description="Trabalhos personalizados em viaturas particulares, avaliados caso a caso, com atenção à segurança, estética e durabilidade dos materiais aplicados."
          imageSrc={subServiceConfig.particulares.heroImage}
          imageAlt={subServiceConfig.particulares.heroAlt}
          primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
          secondaryCta={{ text: "Ver Portfólio", href: "/portfolio" }}
          imagePosition="right"
        />
      );
    }

    if (key === "comerciais") {
      return (
        <ServiceHeroTwoColumn
          serviceId={subServiceConfig.comerciais.apiId}
          badge="Veículos comerciais"
          badgeIcon={<Truck className="w-4 h-4" />}
          title="Rotulagem comercial que trabalha por si"
          subtitle="Publicidade móvel, clara e profissional"
          description="Decoração para carrinhas e frotas com foco em legibilidade, impacto e consistência de marca."
          imageSrc={subServiceConfig.comerciais.heroImage}
          imageAlt={subServiceConfig.comerciais.heroAlt}
          primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
        />
      );
    }

    if (key === "competicao") {
      return (
        <ServiceHeroTwoColumn
          serviceId={subServiceConfig.competicao.apiId}
          badge="Competição"
          badgeIcon={<Car className="w-4 h-4" />}
          title="Decoração para viaturas de competição"
          subtitle="Rápido, limpo e com presença"
          description="Autocolantes de patrocinadores, numeração e layouts para pista."
          imageSrc={subServiceConfig.competicao.heroImage}
          imageAlt={subServiceConfig.competicao.heroAlt}
          primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
        />
      );
    }

    if (key === "motos") {
      return (
        <ServiceHeroTwoColumn
          serviceId={subServiceConfig.motos.apiId}
          badge="Motociclos"
          badgeIcon={<Bike className="w-4 h-4" />}
          title="Motociclos com identidade"
          subtitle="Peças, detalhes e impacto"
          description="Personalização em vinil para depósitos, carenagens e detalhes."
          imageSrc={subServiceConfig.motos.heroImage}
          imageAlt={subServiceConfig.motos.heroAlt}
          primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
        />
      );
    }

    if (key === "maquinas") {
      return (
        <MachinesSection
          heroImage={subServiceConfig.maquinas.heroImage}
          heroAlt={subServiceConfig.maquinas.heroAlt}
        />
      );
    }

    return (
      <TrucksSection
        heroImage={subServiceConfig.camioes.heroImage}
        heroAlt={subServiceConfig.camioes.heroAlt}
      />
    );
  };

  const materials = [
    {
      name: "Vinil cast premium",
      description: "Material de conformação superior para curvas complexas.",
      durability: "7–10 anos",
      applications: ["Wrapping", "Rotulagem total", "Proteção"],
    },
    {
      name: "Vinil promocional",
      description: "Económico para aplicações de média duração.",
      durability: "3–5 anos",
      applications: ["Publicidade", "Rotulação", "Detalhes"],
    },
    {
      name: "PPF (paint protection film)",
      description: "Película transparente de proteção da pintura.",
      durability: "10+ anos",
      applications: ["Proteção frontal", "Portas", "Espelhos"],
    },
    {
      name: "Vinil de texturas",
      description: "Texturas realistas para decoração de viaturas.",
      durability: "5–7 anos",
      applications: ["Detalhes", "Capôs", "Interior (peças)"],
    },
  ];

  const services = [
    {
      title: "Rotulação publicitária",
      description: "Aplicação de logótipos e informação comercial.",
      benefits: ["Publicidade móvel", "Imagem profissional", "Alcance geográfico", "Custo-benefício"],
    },
    {
      title: "Wrapping parcial",
      description: "Decoração de áreas específicas da viatura.",
      benefits: ["Custo reduzido", "Impacto visual", "Flexibilidade", "Fácil manutenção"],
    },
    {
      title: "Identificação de frota",
      description: "Normalização visual para várias viaturas.",
      benefits: ["Consistência", "Rapidez", "Repetição fácil", "Escalável"],
    },
    {
      title: "Produção + aplicação",
      description: "Impressão no nosso espaço e aplicação conforme o contexto.",
      benefits: ["Controlo de qualidade", "Planeamento", "Acabamento", "Durabilidade"],
    },
  ];

  const process = [
    { step: "01", title: "Consulta e levantamento", description: "Objetivo, superfícies e restrições." },
    { step: "02", title: "Design e aprovação", description: "Proposta visual e confirmação final." },
    { step: "03", title: "Produção", description: "Impressão e preparação com controlo de qualidade." },
    { step: "04", title: "Aplicação profissional", description: "No nosso espaço ou no local do cliente." },
    { step: "05", title: "Entrega e manutenção", description: "Verificação final e recomendações." },
  ];

  // ✅ Desktop: calcular onde inserir o detalhe (fim da row do cartão aberto)
  const detailRowEndIdx = useMemo(() => {
    if (!activeVehicle) return -1;
    const idx = vehicleTypes.findIndex((v) => v.key === activeVehicle);
    if (idx < 0) return -1;
    const cols = Math.max(1, desktopCols);
    return Math.min(vehicleTypes.length - 1, Math.ceil((idx + 1) / cols) * cols - 1);
  }, [activeVehicle, vehicleTypes, desktopCols]);

  const desktopBefore = useMemo(() => {
    if (!activeVehicle || detailRowEndIdx < 0) return vehicleTypes;
    return vehicleTypes.slice(0, detailRowEndIdx + 1);
  }, [activeVehicle, detailRowEndIdx, vehicleTypes]);

  const desktopAfter = useMemo(() => {
    if (!activeVehicle || detailRowEndIdx < 0) return [];
    return vehicleTypes.slice(detailRowEndIdx + 1);
  }, [activeVehicle, detailRowEndIdx, vehicleTypes]);

  const renderVehicleCard = (vehicle: (typeof vehicleTypes)[number]) => {
    const isOpen = activeVehicle === vehicle.key;

    return (
      <div key={vehicle.key} className="scroll-mt-28">
        <Card className="h-full bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="text-brand-yellow mb-4">{vehicle.icon}</div>

            <h3 className="text-xl font-semibold mb-3 text-white">
              {vehicle.title}
            </h3>
            <p className="text-gray-400 mb-4">{vehicle.description}</p>

            <div className="space-y-2 mb-6">
              {vehicle.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => openVehicle(vehicle.key)}
              className="mt-auto w-full bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90"
            >
              {isOpen ? "Fechar" : "Ver mais"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <section ref={sectionRef} className="pt-10 pb-16 bg-gray-900/40 scroll-mt-28">
        <div className="container mx-auto px-4 pt-8">
          <div className={`${activeVehicle ? "hidden md:block" : ""} text-center mb-12 pt-16`}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Tipos de</span>{" "}
              <span className="text-white">veículos</span>
            </h2>

            <h1 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-white">
              Comunicação visual aplicada a todo o tipo de veículos
            </h1>
          </div>

          {/* ✅ MOBILE: detalhe sozinho */}
          {activeVehicle && (
            <div
              className="md:hidden scroll-mt-28 mt-2"
              ref={(node) => {
                revealRefs.current[activeVehicle] = node;
              }}
            >
              <VehicleSubNav />
              {renderVehicleDetails(activeVehicle)}
            </div>
          )}

          {/* ✅ DESKTOP: grid escondida quando há seleção */}
          <div ref={gridRef} className="scroll-mt-28">
            {/* Grid de cartões: escondida quando há seleção */}
            <div className={`${activeVehicle ? "hidden" : "grid"} md:grid-cols-2 lg:grid-cols-3 gap-8`}>
              {vehicleTypes.map(renderVehicleCard)}
            </div>

            {/* Desktop: detalhe (só visível quando há seleção) */}
            {activeVehicle && (
              <div
                className="hidden md:block mt-8 scroll-mt-28"
                ref={(node) => {
                  if (activeVehicle) revealRefs.current[activeVehicle] = node;
                }}
              >
                <VehicleSubNav />
                {renderVehicleDetails(activeVehicle)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESTO: só aparece depois de escolher */}
      {hasSelection && (
        <>
          <ServicesAvailableSection services={services} />

          {galleryImages.length > 0 ? (
            <ServiceGallery
              title="Galeria de trabalhos"
              description="Alguns exemplos de projetos realizados pela nossa equipa."
              images={galleryImages}
              columns={3}
            />
          ) : isGalleryLoading ? (
            <GallerySkeleton />
          ) : (
            <section className="w-full py-10">
              <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-2xl font-semibold text-white">
                  Galeria de trabalhos
                </h2>
                <p className="text-sm text-white/70">
                  Ainda não há imagens para este serviço.
                </p>
              </div>
            </section>
          )}

          <section className="pt-8 pb-16 bg-gray-900/40">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  <span className="text-white">Materiais</span>{" "}
                  <span className="text-brand-yellow">premium</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Utilizamos materiais de marcas reconhecidas e adequados ao uso real.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {materials.map((material, index) => (
                  <Card
                    key={index}
                    className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                        {material.name}
                      </h3>
                      <p className="text-gray-400 mb-4">{material.description}</p>

                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Durabilidade:</span>
                        <span className="text-brand-yellow font-semibold ml-2">
                          {material.durability}
                        </span>
                      </div>

                      <span className="text-sm text-gray-500 mb-2 block">
                        Aplicações:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {material.applications.map((app, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-brand-yellow text-brand-yellow"
                          >
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 bg-black border-t border-gray-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  <span className="text-white">Processo</span>{" "}
                  <span className="text-brand-yellow">profissional</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Metodologia que garante consistência, qualidade e durabilidade.
                </p>
              </div>

              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {process.map((step, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-yellow text-black flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-white">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-gray-900/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    <span className="text-brand-yellow">Garantia de</span>{" "}
                    <span className="text-white">qualidade</span>
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">Garantia de aplicação: 2 anos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">Materiais certificados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">Suporte pós-venda</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-2">
                    <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Experiência comprovada
                    </h3>
                    <p className="text-gray-400">
                      Décadas de prática em comunicação visual aplicada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-black border-t border-gray-900">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                <span className="text-white">Pronto para avançar com a</span>{" "}
                <span className="text-brand-yellow">sua decoração?</span>
              </h2>

              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Diz-nos o tipo de veículo e o objetivo. Nós tratamos do resto.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
                >
                  <Link href="/contactos#formulario">
                    Solicitar orçamento
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
                >
                  <a
                    href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20decoração%20de%20viaturas."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp direto
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}