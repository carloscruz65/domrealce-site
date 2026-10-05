import { buildCalculatorUrl } from "@/utils/calculatorAttribution";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  CheckCircle,
  Star,
  ArrowRight,
  ArrowUpRight,
  Frame,
  Brush,
  Camera,
  Palette,
  Award,
  Shield,
} from "lucide-react";

export default function ServicoTelasArtisticas() {
  const calculatorUrl = buildCalculatorUrl(
    typeof window === "undefined" ? "" : window.location.search,
  );

  // ✅ Agora vamos usar estes “features” no accordion
  const features = [
    {
      icon: <Frame className="w-6 h-6" />,
      title: "Canvas premium",
      description:
        "Telas de algodão de alta gramagem para máxima durabilidade e qualidade.",
    },
    {
      icon: <Brush className="w-6 h-6" />,
      title: "Impressão artística",
      description:
        "Tecnologia de impressão que reproduz fielmente cores e texturas.",
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografias personalizadas",
      description:
        "Transforme as suas fotografias em obras de arte profissionais.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Arte digital",
      description: "Criação de arte digital exclusiva para a sua tela.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Molduras incluídas",
      description: "Variedade de molduras elegantes incluídas no serviço.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Resistente ao tempo",
      description:
        "Tintas UV resistentes que mantêm as cores vibrantes por anos.",
    },
  ];

  const artisticCards: ServiceAccordionCard[] = features.map((f, idx) => ({
    key: `feature-${idx}`,
    icon: f.icon,
    title: f.title,
    intro: "Detalhe técnico e acabamento premium.",
    content: [f.description],
  }));

  const sizes = [
    "20x30 cm",
    "30x40 cm",
    "40x50 cm",
    "50x70 cm",
    "60x80 cm",
    "70x100 cm",
    "80x120 cm",
    "100x150 cm",
  ];

  const applications = [
    {
      title: "Decoração residencial",
      description:
        "Transforme a sua casa num espaço único com arte personalizada.",
      examples: ["Salas de estar", "Quartos", "Escritórios", "Corredores"],
    },
    {
      title: "Espaços comerciais",
      description: "Crie ambientes profissionais inspiradores e memoráveis.",
      examples: ["Hotéis", "Restaurantes", "Consultórios", "Escritórios"],
    },
    {
      title: "Presentes especiais",
      description: "Ofereça algo verdadeiramente único e pessoal.",
      examples: ["Casamentos", "Aniversários", "Formações", "Eventos"],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Seleção da imagem",
      description:
        "Envie uma fotografia, um link/referência, ou descreva o estilo pretendido. Nós ajudamos a escolher o visual ideal.",
    },
    {
      step: "02",
      title: "Preparação digital",
      description:
        "Otimizamos a imagem para garantir a melhor qualidade de impressão.",
    },
    {
      step: "03",
      title: "Impressão em canvas",
      description: "Impressão de alta qualidade em tela de algodão premium.",
    },
    {
      step: "04",
      title: "Montagem e moldura",
      description: "Esticamos a tela e aplicamos a moldura escolhida.",
    },
    {
      step: "05",
      title: "Controlo de qualidade",
      description:
        "Inspeção final antes da entrega para garantir um resultado perfeito.",
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      alt: "Tela artística em sala moderna",
      title: "Arte contemporânea",
    },
    {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      alt: "Canvas com fotografia em preto e branco",
      title: "Fotografia artística",
    },
    {
      src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80",
      alt: "Tela com paisagem natural",
      title: "Paisagens naturais",
    },
    {
      src: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
      alt: "Canvas abstrato colorido",
      title: "Arte abstrata",
    },
    {
      src: "https://images.unsplash.com/photo-1578926314433-e2789279f4aa?w=800&q=80",
      alt: "Tela decorativa em quarto",
      title: "Decoração personalizada",
    },
    {
      src: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
      alt: "Tela artística premium",
      title: "Qualidade premium",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "telas-artisticas"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        serviceId="telas-artisticas"
        badge="Telas Artísticas Premium"
        badgeIcon={<Image className="w-4 h-4" />}
        title="Transforme fotografias em obras de arte"
        subtitle="Impressão artística"
        description="Impressão artística em canvas de alta qualidade. Transforme as suas memórias mais preciosas ou criações artísticas em telas duradouras e elegantes."
        imageSrc="/public-objects/servicos/telas-artisticas.webp"
        imageAlt="Telas Artísticas DOMREALCE"
        primaryCta={{
          text: "CALCULAR PREÇO E ENCOMENDAR",
          href: calculatorUrl,
          nativeNavigation: true,
        }}
      />

      <main>
        {/* ✅ Qualidade artística (normalizada para cards + dropdown) */}
        <ServiceCardsSection
          titleTop="Qualidade"
          titleBottom="artística"
          subtitle="Tecnologia de impressão artística que garante resultados dignos de galeria."
          cards={artisticCards}
          defaultOpenKey={null}
        />

        {/* Galeria */}
        <ServiceGallery
          images={galleryImages}
          title="Exemplos de telas artísticas"
          description="Algumas inspirações de telas produzidas para decoração residencial e comercial."
          columns={3}
        />

        {/* Tamanhos disponíveis */}
        <section className="pt-8 pb-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Tamanhos</span>{" "}
                <span className="text-brand-yellow">disponíveis</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Desde formatos compactos até grandes obras de parede.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 text-center hover:border-brand-yellow transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-brand-yellow mb-2">
                    {size}
                  </div>
                  <div className="text-sm text-gray-400">Formato padrão</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aplicações ideais */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Aplicações</span>{" "}
                <span className="text-brand-yellow">ideais</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Perfeitas para qualquer ambiente que necessite de um toque
                artístico especial.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {applications.map((application, index) => (
                <Card
                  key={index}
                  className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                      {application.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {application.description}
                    </p>
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">
                        Exemplos:
                      </span>
                      <div className="space-y-1">
                        {application.examples.map((example, exampleIndex) => (
                          <div
                            key={exampleIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                            <span className="text-sm text-gray-300">
                              {example}
                            </span>
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

        {/* Processo de criação */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Processo de</span>{" "}
                <span className="text-brand-yellow">criação</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Cada tela é cuidadosamente produzida para garantir qualidade
                artística excecional.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
              {process.map((step) => (
                <div
                  key={step.step}
                  className="bg-gray-900/80 border border-gray-800 rounded-2xl px-6 py-5 flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-yellow rounded-full flex items-center justify-center text-black font-bold text-lg md:text-xl">
                      {step.step}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Garantia de qualidade */}
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
                    Utilizamos apenas materiais premium e tecnologia de impressão
                    avançada para garantir que cada tela seja uma verdadeira obra
                    de arte.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Canvas 100% algodão, 400g/m²
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Tintas pigmentadas resistentes UV
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">Molduras de madeira</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        Acabamento profissional e pronto a pendurar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-6">
                    <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Qualidade artística
                    </h3>
                    <p className="text-gray-400">
                      Cada tela é uma peça única criada com máximo cuidado.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Durabilidade</span>
                      <span className="text-brand-yellow font-semibold">
                        50+ anos
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Resolução mínima</span>
                      <span className="text-brand-yellow font-semibold">
                        300 DPI
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Prazo de produção</span>
                      <span className="text-brand-yellow font-semibold">
                        3-7 dias
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Garantia</span>
                      <span className="text-brand-yellow font-semibold">
                        Vida útil da tela
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* CTA final */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para criar a sua</span>{" "}
              <span className="text-brand-yellow">obra de arte?</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Escolha as medidas, indique a quantidade e configure a sua tela
              diretamente na nossa app. Veja o preço de imediato e conclua a
              encomenda online.
            </p>

            <Button
              asChild
              className="bg-brand-yellow text-black hover:bg-brand-yellow/90 px-8 py-6 text-lg font-semibold"
            >
              <a href={calculatorUrl}>
                CALCULAR PREÇO E ENCOMENDAR
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}