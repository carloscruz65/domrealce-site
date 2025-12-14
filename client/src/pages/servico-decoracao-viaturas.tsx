import React, { useRef, useState } from "react";
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
// (opcional) se quiseres depois criamos esta também:
// import VehiclesCommercialSection from "@/components/services/VehiclesCommercialSection";

import {
  Car,
  CheckCircle,
  Star,
  ArrowRight,
  Truck,
  Bike,
  Bus,
  Settings,
  Shield,
} from "lucide-react";

// Imagens padrão
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

type VehicleKey =
  | "particulares"
  | "comerciais"
  | "competicao"
  | "camioes"
  | "motos"
  | "maquinas";

export default function ServicoDecoracaoViaturas() {
  const [activeVehicle, setActiveVehicle] = useState<VehicleKey | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  const hasSelection = Boolean(activeVehicle);

  function openVehicle(key: VehicleKey) {
    setActiveVehicle((prev) => (prev === key ? null : key));

    // scroll depois do React aplicar o DOM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "decoracao-viaturas"],
  });
  const galleryImages = galleryData?.images || defaultImages;

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
      description: "Personalização e detalhes sob consulta.",
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
      features: ["Patrocinadores", "Numeração", "Layouts rápidos", "Materiais específicos"],
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      

      {/* TOP: só Tipos de veículos (para a página não “parecer gigante”) */}
      <section className="pt-0 pb-16 bg-gray-900/40 scroll-mt-28">
        <div className="container mx-auto px-4 pt-8">
          <div className="text-center mb-12 pt-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Tipos de</span>{" "}
              <span className="text-white">veículos</span>
            </h2>

            <span className="text-sm uppercase tracking-wide text-brand-yellow">
              Serviços de comunicação visual
            </span>

            <h1 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-white">
              Comunicação visual aplicada a todo o tipo de veículos
            </h1>

            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              Começa por escolher o tipo de veículo. O resto abre a seguir (sem assustar com o tamanho).
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle) => (
              <Card
                key={vehicle.key}
                className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">{vehicle.icon}</div>

                  <h3 className="text-xl font-semibold mb-3 text-white">{vehicle.title}</h3>
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
                    className="w-full bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90"
                  >
                    {activeVehicle === vehicle.key ? "Fechar" : "Ver mais"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* REVELAÇÃO PROGRESSIVA: só aparece depois de escolher */}
      {hasSelection && (
        <div ref={revealRef} className="scroll-mt-28">
          {/* Secção específica por escolha */}
          {activeVehicle === "comerciais" && (
            <ServiceHeroTwoColumn
              badge="Veículos comerciais"
              badgeIcon={<Truck className="w-4 h-4" />}
              title="Rotulagem comercial que trabalha por si"
              subtitle="Publicidade móvel, clara e profissional"
              description="Decoração para carrinhas e frotas com foco em legibilidade, impacto e consistência de marca."
              imageSrc="/public-objects/servicos/decoracao-viaturas.webp"
              imageAlt="Decoração de veículos comerciais DOMREALCE"
              primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
            />
          )}

          {activeVehicle === "competicao" && (
            <ServiceHeroTwoColumn
              badge="Competição"
              badgeIcon={<Car className="w-4 h-4" />}
              title="Decoração para viaturas de competição"
              subtitle="Rápido, limpo e com presença"
              description="Autocolantes de patrocinadores, numeração e layouts para pista."
              imageSrc="/public-objects/servicos/decoracao-viaturas.webp"
              imageAlt="Decoração de viaturas de competição DOMREALCE"
              primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
            />
          )}

          {activeVehicle === "particulares" && (
            <ServiceHeroTwoColumn
              badge="Particulares"
              badgeIcon={<Car className="w-4 h-4" />}
              title="Personalização e detalhes (sob consulta)"
              subtitle="Só o que dá para fazer bem"
              description="Trabalhos pontuais e personalizados. Avaliamos caso a caso para garantir segurança e qualidade."
              imageSrc="/public-objects/servicos/decoracao-viaturas.webp"
              imageAlt="Personalização de viaturas DOMREALCE"
              primaryCta={{ text: "Falar connosco", href: "/contactos#formulario" }}
            />
          )}

          {activeVehicle === "motos" && (
            <ServiceHeroTwoColumn
              badge="Motociclos"
              badgeIcon={<Bike className="w-4 h-4" />}
              title="Motociclos com identidade"
              subtiftle="Peças, detalhes e impacto"
              description="Personalização em vinil para depósitos, carenagens e detalhes."
              imageSrc="/public-objects/servicos/decoracao-viaturas.webp"
              imageAlt="Decoração de motociclos DOMREALCE"
              primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
            />
          )}

          {activeVehicle === "maquinas" && <MachinesSection />}
          {activeVehicle === "camioes" && <TrucksSection />}

          {/* Secções gerais (agora só aparecem depois de escolher) */}
          <ServiceGallery
            title="Galeria de trabalhos"
            description="Alguns exemplos de projetos realizados pela nossa equipa."
            images={galleryImages}
            columns={3}
          />

          


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
                      <h3 className="text-xl font-semibold mb-3 text-brand-yellow">{material.name}</h3>
                      <p className="text-gray-400 mb-4">{material.description}</p>

                      <div className="mb-4">
                        <span className="text-sm text-gray-500">Durabilidade:</span>
                        <span className="text-brand-yellow font-semibold ml-2">
                          {material.durability}
                        </span>
                      </div>

                      <span className="text-sm text-gray-500 mb-2 block">Aplicações:</span>
                      <div className="flex flex-wrap gap-2">
                        {material.applications.map((app, i) => (
                          <Badge key={i} variant="outline" className="border-brand-yellow text-brand-yellow">
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
                        <h3 className="text-lg font-semibold mb-1 text-white">{step.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
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
                    <h3 className="text-2xl font-semibold mb-2 text-white">Experiência comprovada</h3>
                    <p className="text-gray-400">Décadas de prática em comunicação visual aplicada.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ServicesAvailableSection services={services} />


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
        </div>
      )}

      <Footer />
    </div>
  );
}
