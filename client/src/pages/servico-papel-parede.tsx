import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { buildCalculatorUrl } from "@/utils/calculatorAttribution";
import { useQuery } from "@tanstack/react-query";
import {
  Wallpaper,
  CheckCircle,
  Star,
  ArrowRight,
  Grid,
  Palette,
  Home,
  Ruler,
  Eye,
  Search,
  ShoppingCart,
} from "lucide-react";

export default function ServicoPapelParede() {
  const calculatorUrl = buildCalculatorUrl(
    typeof window === "undefined" ? "" : window.location.search,
  );

  const process = [
    {
      step: "01",
      title: "Escolha da imagem",
      description:
        "Escolha uma textura da nossa loja ou envie um link/referência. Se preferir, nós ajudamos a escolher o visual ideal.",
    },
    {
      step: "02",
      title: "Medidas personalizadas",
      description:
        "Indique as dimensões exatas (largura x altura) e a quantidade de paredes.",
    },
    {
      step: "03",
      title: "Medição e orçamento",
      description:
        "Calculamos quantidades, enviamos orçamento detalhado e esclarecemos dúvidas.",
    },
    {
      step: "04",
      title: "Produção",
      description:
        "Preparamos e produzimos o papel de parede com a solução visual escolhida.",
    },
    {
      step: "05",
      title: "Entrega e aplicação",
      description:
        "Entregamos e aplicamos com equipa especializada e garantia de qualidade.",
    },
  ];

  const benefits = [
    "Catálogo sempre atualizado",
    "Visualização em tamanho real",
    "Cálculo automático de quantidades",
    "Encomenda online simples",
    "Garantia de qualidade",
    "Suporte técnico especializado",
  ];

  // ✅ Cards no modelo Design (accordion)
  const catalogoCards: ServiceAccordionCard[] = [
    {
      key: "variedade",
      icon: <Grid className="w-6 h-6" />,
      title: "Grande variedade de texturas",
      intro: "Tendências atuais e opções para todos os estilos.",
      content: [
        "Coleção ampla e atualizada com padrões, texturas e estilos diferentes.",
        "Opções para ambientes residenciais e comerciais.",
      ],
    },
    {
      key: "categorias",
      icon: <Search className="w-6 h-6" />,
      title: "Múltiplas categorias",
      intro: "Encontra rápido o padrão certo.",
      content: [
        "Organização intuitiva por estilos e categorias.",
        "Filtragem mais rápida para chegar ao que realmente procura.",
      ],
    },
    {
      key: "tamanho-real",
      icon: <Eye className="w-6 h-6" />,
      title: "Visualização real",
      intro: "Veja a textura em tamanho real antes de decidir.",
      content: [
        "Catálogo interativo para avaliar melhor escala e detalhe.",
        "Ajuda a escolher com mais confiança e menos dúvidas.",
      ],
    },
    {
      key: "medidas",
      icon: <Ruler className="w-6 h-6" />,
      title: "Medidas personalizadas",
      intro: "Cálculo orientado ao seu espaço.",
      content: [
        "Indica largura e altura e calculamos a solução mais adequada.",
        "Evita desperdícios e ajuda a definir quantidades com segurança.",
      ],
    },
    {
      key: "comparar",
      icon: <Palette className="w-6 h-6" />,
      title: "Seleção múltipla",
      intro: "Compare opções antes de fechar a escolha.",
      content: [
        "Comparação lado a lado para escolher o padrão ideal.",
        "Útil quando está entre 2 ou 3 opções.",
      ],
    },
    {
      key: "simulacao",
      icon: <Home className="w-6 h-6" />,
      title: "Simulação no ambiente",
      intro: "Antecipar o resultado final ajuda a decidir melhor.",
      content: [
        "Visualize o papel aplicado no ambiente antes de avançar.",
        "Menos incerteza e mais satisfação no resultado final.",
      ],
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80",
      alt: "Papel de parede decorativo moderno",
      title: "Texturas modernas",
    },
    {
      src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      alt: "Papel de parede com padrões geométricos",
      title: "Padrões geométricos",
    },
    {
      src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      alt: "Papel de parede floral elegante",
      title: "Designs florais",
    },
    {
      src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
      alt: "Papel de parede texturizado",
      title: "Texturas premium",
    },
    {
      src: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80",
      alt: "Papel de parede para quarto",
      title: "Ambientes acolhedores",
      title2: "Ambientes acolhedores",
    } as any,
    {
      src: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80",
      alt: "Papel de parede artístico",
      title: "Arte na parede",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "papel-parede"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        serviceId="papel-parede"
        badge="Papel de Parede Premium"
        badgeIcon={<Wallpaper className="w-4 h-4" />}
        title="Papel de parede à medida do seu espaço"
        subtitle="Decoração personalizada"
        description="Descubra uma coleção completa de papéis de parede, com visualização em tamanho real, várias categorias e produção personalizada à medida do seu espaço."
        imageSrc="/public-objects/servicos/papel-parede.webp"
        imageAlt="Papel de Parede DOMREALCE"
      />

      {/* Trust signals */}
      <section className="py-3 bg-gray-900/70 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-10">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              Preço imediato
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              Encomenda online
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              Apoio personalizado
            </div>
          </div>
        </div>
      </section>

      {/* Opções principais */}
      <section className="py-10 bg-black border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow/60 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-10 h-10 text-brand-yellow mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-white">Quer comprar diretamente?</h3>
                <p className="text-gray-400 text-sm mb-4">Explore a nossa loja online com dezenas de texturas disponíveis.</p>
                <Button asChild className="bg-brand-yellow text-black font-semibold hover:bg-brand-yellow/90">
                  <Link href="/loja/papel-parede">
                    Ver loja online <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border border-brand-yellow/40 hover:border-brand-yellow transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Palette className="w-10 h-10 text-brand-yellow mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-white">Quer algo personalizado?</h3>
                <p className="text-gray-400 text-sm mb-4">Envie uma imagem, escolha de um banco de imagens ou peça ajuda.</p>
                <Button asChild className="bg-brand-yellow text-black font-semibold hover:bg-brand-yellow/90">
                  <a href={calculatorUrl}>
                    Calcular preço e encomendar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main>
        <ServiceCardsSection
          titleTop="Catálogo"
          titleBottom="interativo"
          subtitle="Explore centenas de texturas, padrões e estilos num catálogo fácil de utilizar e sempre atualizado."
          cards={catalogoCards}
          defaultOpenKey={null}
        />

        <ServiceGallery
          images={galleryImages}
          title="Exemplos de ambientes"
          description="Algumas inspirações de aplicação de papel de parede em diferentes estilos e espaços."
          columns={3}
        />

        {/* Como funciona */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Como</span>{" "}
                <span className="text-brand-yellow">funciona</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Pode escolher uma textura da nossa loja ou enviar um link/referência.
                Se não tiver imagem definida, nós ajudamos a escolher a solução visual
                mais adequada ao seu espaço.
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

        {/* Vantagens */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    <span className="text-brand-yellow">Vantagens</span>{" "}
                    <span className="text-white">exclusivas</span>
                  </h2>
                  <p className="text-gray-400 mb-8 text-lg">
                    Mais do que vender papel de parede, oferecemos uma solução
                    completa com aconselhamento, medição e aplicação profissional.
                  </p>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                        <span className="text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-black rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-6">
                    <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Serviço completo
                    </h3>
                    <p className="text-gray-400">
                      Da escolha da imagem à aplicação final, a nossa equipa
                      acompanha todo o processo com atenção ao detalhe.
                    </p>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Texturas disponíveis</span>
                      <span className="text-brand-yellow font-semibold">Grande variedade</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Categorias</span>
                      <span className="text-brand-yellow font-semibold">Diversas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Aplicação profissional</span>
                      <span className="text-brand-yellow font-semibold">Disponível</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Garantia</span>
                      <span className="text-brand-yellow font-semibold">2 anos</span>
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
              <span className="text-white">Pronto para transformar o seu</span>{" "}
              <span className="text-brand-yellow">espaço?</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Indique as medidas, escolha a imagem ou referência e configure o seu
              papel de parede diretamente na nossa app.
            </p>

            <div className="flex justify-center">
              <Button
                asChild
                className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
              >
                <a href={calculatorUrl}>
                  CALCULAR PREÇO E ENCOMENDAR
                  <ArrowRight className="w-5 h-5 ml-2" />
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