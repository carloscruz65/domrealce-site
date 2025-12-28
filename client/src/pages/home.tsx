import { lazy, Suspense } from "react";
import Navigation from "@/components/navigation";
import StaticHero from "@/components/StaticHero";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// carregados de forma preguiçosa (abaixo da dobra)
const LazyServicesSection = lazy(() => import("@/components/services-section"));
const LazyPortfolioSection = lazy(() => import("@/components/portfolio-section"));
const LazyNewsSection = lazy(() => import("@/components/news-section"));
const LazyClientLogos = lazy(() => import("@/components/ClientLogos"));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <SEOHead
        title="Comunicação Visual e Impressão Digital no Norte de Portugal"
        description="DOMREALCE – Atelier de comunicação visual em Paredes, especializado em impressão digital, papel de parede, decoração de viaturas e espaços comerciais. Décadas de experiência ao serviço da região do Grande Porto."
        keywords="comunicação visual, impressão digital, papel de parede, decoração viaturas, sinalética, publicidade, Paredes, Grande Porto, DOMREALCE"
        canonicalUrl="https://www.domrealce.com/"
        heroImage="/public-objects/inicio/slider/bem-vindo-domrealce.webp"
      />

      <Navigation />

      {/* HERO – LCP: imagem com prioridade + versão mobile */}
      <section className="mt-16">
        <StaticHero
          imageSrc="/public-objects/inicio/slider/bem-vindo-domrealce.webp"
          imageSrcMobile="/public-objects/inicio/slider/bem-vindo-domrealce-mobile.webp"
          alt="Bem-vindos à DOMREALCE - Comunicação Visual"
          priority
        />
      </section>

      {/* SECÇÃO DE TRANSIÇÃO — mensagem de enquadramento */}
      <section className="bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4 py-10 md:py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-turquoise">
            Porque a comunicação visual certa transforma um negócio.
          </h2>

          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Criamos soluções de impressão, decoração e design que ajudam empresas
            a destacarem-se no seu mercado. Com produção própria em Paredes e
            experiência acumulada ao longo de várias décadas, tratamos cada projeto
            com rigor técnico e atenção ao detalhe.
          </p>
        </div>
      </section>

      {/* HIGHLIGHTS DOMREALCE – 3 pontos rápidos logo abaixo do hero */}
      <section className="bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow mb-1">
                Experiência
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Experiência construída ao longo de décadas
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
                Estúdio totalmente equipado em Paredes
              </h3>
              <p className="text-sm text-gray-300">
                Do desenho à produção: maquetes, impressão, corte, laminação e
                preparação para instalação no mesmo fluxo de trabalho.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow mb-1">
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

      {/* SECÇÕES ABAIXO DA DOBRA EM LAZY + SUSPENSE */}
      <Suspense fallback={null}>
        <section className="bg-[#050505]">
          <LazyServicesSection />
        </section>

        <section className="bg-[#050505]">
          <LazyPortfolioSection />
        </section>

        <section className="bg-[#050505]">
          <LazyNewsSection />
        </section>

        <section className="bg-[#050505]">
          <LazyClientLogos />
        </section>
      </Suspense>

      {/* CTA FINAL */}
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