import Navigation from "@/components/navigation";
import DynamicSlider from "@/components/DynamicSlider";
import ServicesSection from "@/components/services-section";
import PortfolioSection from "@/components/portfolio-section";
import NewsSection from "@/components/news-section";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { usePageConfig } from "@/hooks/use-page-config";
import ClientLogos from "@/components/ClientLogos";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { getConfig, isLoading } = usePageConfig("home");

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <SEOHead
        title="Comunicação Visual e Impressão Digital no Norte de Portugal"
        description="DOMREALCE – Atelier de comunicação visual em Paredes, especializado em impressão digital, papel de parede, decoração de viaturas e espaços comerciais. Mais de 40 anos de experiência ao serviço da região do Grande Porto."
        keywords="comunicação visual, impressão digital, papel de parede, decoração viaturas, sinalética, publicidade, Paredes, Grande Porto, DOMREALCE"
        canonicalUrl="https://www.domrealce.com/"
      />

      <Navigation />

      {/* HERO / SLIDER – enquadrado num fundo com gradiente suave */}
      <section className="mt-16 bg-gradient-to-b from-black via-[#050505] to-[#050505]">
        <DynamicSlider />
      </section>

      {/* HIGHLIGHTS DOMREALCE – 3 pontos rápidos logo abaixo do slider */}
      <section className="bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow mb-1">
                Experiência
              </p>
              <h3 className="text-lg font-semibold mb-2">
                +40 anos em comunicação visual
              </h3>
              <p className="text-sm text-gray-300">
                Know-how acumulado em publicidade, impressão, decoração de
                viaturas, espaços comerciais e projetos personalizados.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-turquoise mb-1">
                Atelier
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Espaço de 80 m² em Paredes
              </h3>
              <p className="text-sm text-gray-300">
                Do desenho à produção: maquetes, impressão, corte, laminação e
                preparação para instalação no mesmo fluxo de trabalho.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-coral mb-1">
                Foco
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Grande Porto & Norte de Portugal
              </h3>
              <p className="text-sm text-gray-300">
                Projetos pensados para a realidade dos negócios locais: lojas,
                viaturas comerciais, escritórios, restauração e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="bg-[#050505]">
        <ServicesSection />
      </section>

      {/* PORTFÓLIO */}
      <section className="bg-[#050505]">
        <PortfolioSection />
      </section>

      {/* NOTÍCIAS */}
      <section className="bg-[#050505]">
        <NewsSection />
      </section>

      {/* CLIENTES */}
      <section className="bg-[#050505]">
        <ClientLogos />
      </section>

      {/* CTA FINAL – alinhado com o estilo das outras páginas */}
      <section className="bg-gradient-to-r from-brand-yellow/10 via-brand-turquoise/10 to-brand-coral/10 border-t border-white/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar um novo projeto?
            </h2>
            <p className="text-base md:text-lg text-gray-200 mb-8">
              Quer seja uma fachada, uma viatura, um espaço comercial ou papel
              de parede personalizado, ajudamos a transformar a sua ideia numa
              solução clara e bem executada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 flex items-center justify-center gap-2">
                <Link href="/contactos#formulario">
                  <span>Falar com a DOMREALCE</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black flex items-center justify-center gap-2"
                asChild
              >
                <Link href="/servicos">
                  <span>Ver serviços</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>
                Também podemos começar a conversa por WhatsApp:&nbsp;
                <a
                  href="https://wa.me/351930682725?text=Olá!%20Gostaria%20de%20falar%20sobre%20um%20projeto%20de%20comunicação%20visual."
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-yellow hover:text-brand-turquoise underline"
                >
                  +351 930 682 725
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}