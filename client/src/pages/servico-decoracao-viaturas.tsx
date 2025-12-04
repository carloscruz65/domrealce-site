import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceGallery from "@/components/service-gallery";
import ServiceHero from "@/components/service-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Car, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Truck,
  Bike,
  Bus,
  Settings,
  Shield
} from "lucide-react";

// Imagens padrão (agora com URLs externas, como nas outras páginas)
const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    alt: "Carrinha comercial com decoração em vinil",
    title: "Decoração de Frotas Comerciais"
  },
  {
    src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
    alt: "Viatura de competição com autocolantes de patrocinadores",
    title: "Viaturas de Competição"
  },
  {
    src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?w=800&q=80",
    alt: "Processo de instalação de vinil em viatura",
    title: "Instalação Profissional"
  }
];

export default function ServicoDecoracaoViaturas() {
  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ["/api/service-galleries", "decoracao-viaturas"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  const vehicleTypes = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas particulares",
      description: "Personalização completa de carros pessoais.",
      features: ["Mudança de cor", "Proteção da pintura", "Designs personalizados", "Efeitos especiais"]
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Veículos comerciais",
      description: "Publicidade móvel para o seu negócio.",
      features: ["Branding empresarial", "Informações de contacto", "Promoções", "Logótipos"]
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas de competição",
      description: "Decoração para desportos motorizados.",
      features: ["Patrocinadores", "Numeração", "Designs aerodinâmicos", "Materiais especiais"]
    },
    {
      icon: <Bus className="w-8 h-8" />,
      title: "Camiões e pesados",
      description: "Decoração para veículos de grande porte.",
      features: ["Publicidade de grande impacto", "Identificação de frota", "Regulamentações", "Visibilidade"]
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Motociclos",
      description: "Personalização para motocicletas.",
      features: ["Designs únicos", "Proteção do depósito", "Detalhes especiais", "Efeitos personalizados"]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Máquinas de obras",
      description: "Identificação e personalização de equipamentos.",
      features: ["Numeração", "Logótipos da empresa", "Informações de segurança", "Cores corporativas"]
    }
  ];

  const materials = [
    {
      name: "Vinil cast premium",
      description: "Material de conformação superior para curvas complexas.",
      durability: "7–10 anos",
      applications: ["Wrapping completo", "Mudança de cor", "Proteção"]
    },
    {
      name: "Vinil promocional", 
      description: "Económico para aplicações de média duração.",
      durability: "3–5 anos",
      applications: ["Publicidade", "Rotulação", "Detalhes"]
    },
    {
      name: "PPF (paint protection film)",
      description: "Película transparente de proteção da pintura.",
      durability: "10+ anos",
      applications: ["Proteção frontal", "Portas", "Espelhos"]
    },
    {
      name: "Vinil de texturas",
      description: "Texturas realistas para decoração de viaturas.",
      durability: "5–7 anos",
      applications: ["Detalhes interiores", "Spoilers", "Capôs"]
    }
  ];

  const services = [
    {
      title: "Wrapping completo",
      description: "Mudança completa da cor ou aplicação de design em toda a viatura.",
      benefits: ["Protege a pintura original", "Reversível", "Muitas opções de cor", "Valor de revenda mantido"]
    },
    {
      title: "Wrapping parcial",
      description: "Decoração de áreas específicas da viatura.",
      benefits: ["Custo reduzido", "Impacto visual", "Fácil manutenção", "Flexibilidade de design"]
    },
    {
      title: "Rotulação publicitária",
      description: "Aplicação de logótipos e informações comerciais.",
      benefits: ["Publicidade móvel", "Imagem profissional", "Alcance geográfico", "Custo-benefício"]
    },
    {
      title: "Película de proteção",
      description: "Aplicação de película protetora transparente.",
      benefits: ["Protege de riscos", "Quase invisível", "Auto-regeneração", "Longa duração"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consulta e medição",
      description: "Avaliação da viatura e definição do projeto personalizado."
    },
    {
      step: "02", 
      title: "Design e aprovação",
      description: "Criação do design e visualização do resultado final."
    },
    {
      step: "03",
      title: "Preparação da viatura", 
      description: "Limpeza profunda e preparação das superfícies."
    },
    {
      step: "04",
      title: "Aplicação especializada",
      description: "Instalação por técnicos especializados com ferramentas profissionais."
    },
    {
      step: "05",
      title: "Controlo de qualidade",
      description: "Inspeção final e orientações de manutenção."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero igual ao estilo das outras páginas */}
      <ServiceHero
        serviceId="decoracao-viaturas"
        badge="Decoração de viaturas"
        badgeIcon={<Car className="w-4 h-4 mr-2" />}
        title="Decoração de viaturas"
        subtitle="wrapping e publicidade móvel"
        description="Especialistas em car wrapping e decoração de viaturas. Desde mudanças de cor completas até publicidade móvel para o seu negócio, com qualidade profissional garantida."
        overlayOpacity="0"
        primaryCta={{
          text: "Transformar a minha viatura",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Contactar",
          href: "/contactos#formulario"
        }}
      />

      {/* Tipos de veículos */}
      <section className="pt-8 pb-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Tipos de</span>{" "}
              <span className="text-white">veículos</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Especializados em todos os tipos de veículos, desde carros particulares até grandes frotas comerciais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <Card
                key={index}
                className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">
                    {vehicle.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {vehicle.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{vehicle.description}</p>
                  <div className="space-y-2">
                    {vehicle.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria (igual às outras, só cartões) */}
      <ServiceGallery
        title="Galeria de trabalhos"
        description="Alguns exemplos de projetos de decoração de viaturas realizados pela nossa equipa."
        images={galleryImages}
        columns={3}
      />

      {/* Serviços */}
      <section className="pt-8 pb-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Serviços</span>{" "}
              <span className="text-brand-yellow">disponíveis</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Soluções completas para transformar e proteger a sua viatura.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Benefícios:</span>
                    <div className="space-y-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                          <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Materiais */}
      <section className="pt-8 pb-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Materiais</span>{" "}
              <span className="text-brand-yellow">premium</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Utilizamos apenas materiais de marcas reconhecidas mundialmente.
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
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Aplicações:</span>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app, appIndex) => (
                        <Badge
                          key={appIndex}
                          variant="outline"
                          className="border-brand-yellow text-brand-yellow"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo</span>{" "}
              <span className="text-brand-yellow">profissional</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia que garante resultados excecionais e duradouros.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="w-px h-8 bg-gray-700 ml-8 mt-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantia / Qualidade */}
      <section className="py-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Garantia de</span>{" "}
                  <span className="text-white">qualidade</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Todos os nossos trabalhos incluem garantia contra defeitos de aplicação 
                  e utilizamos apenas materiais certificados pelos fabricantes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Garantia de aplicação: 2 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Materiais certificados Hexis, Oracal e Mactac</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Técnicos especializados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Seguro de responsabilidade civil</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Suporte pós-venda</span>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Excelência comprovada
                  </h3>
                  <p className="text-gray-400">
                    40 anos de experiência em decoração de viaturas.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Viaturas decoradas</span>
                    <span className="text-brand-yellow font-semibold">
                      1000+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-brand-yellow font-semibold">
                      2–5 dias
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Satisfação</span>
                    <span className="text-brand-yellow font-semibold">
                      99%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-brand-yellow font-semibold">
                      2 anos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final, sem degradê */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para transformar a sua</span>{" "}
            <span className="text-brand-yellow">viatura?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco e descubra como podemos dar uma nova vida 
            à sua viatura com qualidade e profissionalismo.
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

      <Footer />
    </div>
  );
}
