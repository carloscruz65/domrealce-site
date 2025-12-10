import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Palette,
  CheckCircle,
  Star,
  ArrowRight,
  Target,
  Layers,
  Eye,
  Monitor,
  FileImage,
} from "lucide-react";

export default function ServicoDesignGrafico() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Identidade Visual Completa",
      description:
        "Criamos logótipos únicos e desenvolvemos toda a identidade visual da sua marca.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Design Vectorial",
      description:
        "Desenhos escaláveis em qualquer tamanho sem perda de qualidade.",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Maquetes",
      description:
        "Visualização realista dos seus projetos antes da produção final.",
    },
    {
      icon: <FileImage className="w-6 h-6" />,
      title: "Material Publicitário",
      description:
        "Criação de identidade visual e material promocional para todos os formatos.",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Design Digital",
      description: "Layouts para páginas web e plataformas digitais.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Estratégia Visual",
      description:
        "Alinhamento do design com a mensagem e objetivos do seu negócio.",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Briefing",
      description:
        "Reunião para entender objetivos, público-alvo e preferências visuais da sua marca.",
    },
    {
      step: "02",
      title: "Conceito e Criação",
      description:
        "Pesquisa, desenvolvimento de conceitos criativos e criação das propostas de design.",
    },
    {
      step: "03",
      title: "Aprovação e Entrega",
      description:
        "Ajustes finais, aprovação e entrega dos ficheiros em todos os formatos necessários.",
    },
  ];

  const benefits = [
    "Marca profissional e memorável",
    "Diferenciação da concorrência",
    "Maior credibilidade no mercado",
    "Comunicação visual consistente",
    "Ficheiros em múltiplos formatos",
    "Suporte técnico contínuo",
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      alt: "Design de logótipo profissional",
      title: "Identidade Visual Corporativa",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
      alt: "Material publicitário criativo",
      title: "Material Publicitário",
    },
    {
      src: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80",
      alt: "Design de branding",
      title: "Branding Completo",
    },
    {
      src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      alt: "Maquete de design",
      title: "Maquetes 3D",
    },
    {
      src: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80",
      alt: "Design gráfico moderno",
      title: "Design Moderno",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80",
      alt: "Papelaria corporativa",
      title: "Papelaria Corporativa",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "design-grafico"],
  });

  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        badge="Design Gráfico Profissional"
        badgeIcon={<Palette className="w-4 h-4" />}
        title="Identidade Visual que marca a diferença"
        subtitle="Design que comunica"
        description="Criamos designs únicos e memoráveis que comunicam a essência da sua marca. Com 40 anos de experiência, transformamos ideias em identidades visuais poderosas."
        imageSrc="/public-objects/servicos/design-grafico.webp"
        imageAlt="Design Gráfico DOMREALCE"
      />

      <main>
        {/* Features / Serviços incluídos */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-yellow">Serviços</span>{" "}
                <span className="text-white">Incluídos</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Um serviço de design gráfico completo para cobrir todas as
                necessidades visuais da sua marca.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="text-brand-yellow mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Galeria em cartões simples, sem clique */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-yellow">Exemplos</span>{" "}
                <span className="text-white">de Trabalhos</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Alguns projetos de identidade visual e aplicações gráficas que
                desenvolvemos para os nossos clientes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.title && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-white">
                        {image.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Processo minimalista */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Como</span>{" "}
                <span className="text-brand-yellow">Trabalhamos</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Um processo simples e claro, pensado para tornar o projeto de
                design gráfico mais eficiente e sem surpresas.
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

        {/* Benefícios + bloco de confiança */}
        <section className="py-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Benefícios</span>{" "}
                  <span className="text-white">para o seu negócio</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Um design profissional é um investimento na sua marca. Ajuda a
                  comunicar melhor, a gerar confiança e a destacar-se num
                  mercado competitivo.
                </p>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-yellow mt-1 flex-shrink-0" />
                      <span className="text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-10 h-10 text-brand-yellow mx-auto mb-3" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Experiência e Confiança
                  </h3>
                  <p className="text-gray-400">
                    Com 40 anos de experiência, garantimos um acompanhamento
                    próximo e resultados à altura da sua marca.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Revisões incluídas</span>
                    <span className="text-brand-yellow font-semibold">
                      Até 3
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Formatos entregues</span>
                    <span className="text-brand-yellow font-semibold">
                      Todos os necessários
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Suporte pós-entrega</span>
                    <span className="text-brand-yellow font-semibold">
                      3 meses
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-brand-yellow font-semibold">
                      5 a 10 dias úteis
                    </span>
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
              <span className="text-brand-yellow">identidade visual?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Fale connosco e descubra como podemos transformar a sua marca numa
              presença visual forte, coerente e memorável.
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
                  href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20design%20gráfico."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
