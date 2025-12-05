import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { DynamicGallery } from "@/components/dynamic-gallery";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navigation />

      {/* HERO – topo do portfólio */}
      <section className="mt-16 bg-gradient-to-br from-black via-[#050505] to-brand-yellow/10 border-b border-white/5">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Texto */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-yellow mb-4">
                <Sparkles className="w-3 h-3" />
                <span>Trabalhos reais · Domrealce</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                O nosso{" "}
                <span className="text-brand-yellow">
                  portfólio
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                Uma seleção de projetos em viaturas, espaços comerciais, papel de parede
                e comunicação visual, pensados ao detalhe desde o primeiro esboço
                até à instalação final.
              </p>

              <p className="text-sm md:text-base text-gray-400 mb-8">
                Aqui encontra exemplos de trabalhos que já estão na rua — provas reais
                da qualidade de impressão, corte, laminação e aplicação da DOMREALCE.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="#galeria">
                  <Button className="bg-brand-yellow text-black font-semibold hover:bg-brand-yellow/90 flex items-center justify-center gap-2">
                    Ver trabalhos
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/contactos#formulario">
                  <Button
                    variant="outline"
                    className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
                  >
                    Falar sobre um projeto
                  </Button>
                </Link>
              </div>
            </div>

            {/* Destaques / números rápidos */}
            <div className="grid gap-4 md:gap-5">
              <div className="rounded-2xl border border-white/10 bg-black/60 p-5 md:p-6 shadow-lg shadow-black/40">
                <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-[0.18em]">
                  Em poucas palavras
                </h2>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                  Atelier de comunicação visual no norte de Portugal, focado em
                  soluções à medida: decoração de viaturas, espaços comerciais,
                  papel de parede, telas e projetos especiais.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/70 p-3 md:p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-brand-yellow">
                    40+
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 leading-tight">
                    anos de experiência acumulada
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/70 p-3 md:p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-brand-turquoise">
                    200+
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 leading-tight">
                    projetos em viaturas e espaços
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/70 p-3 md:p-4 text-center">
                  <p className="text-xl md:text-2xl font-bold text-brand-coral">
                    Grande Porto
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 leading-tight">
                    foco da nossa intervenção
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-yellow/20 bg-gradient-to-r from-brand-yellow/10 via-transparent to-brand-turquoise/10 p-4 text-sm text-gray-200">
                📌 Cada imagem que vê aqui representa um projeto completo: estudo,
                maquete, produção e aplicação. Se se identifica com este tipo de
                trabalho, provavelmente vamos dar-nos bem.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA DINÂMICA */}
      <section id="galeria" className="pt-10 pb-12 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Projetos em destaque
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              Filtre por categoria para ver o tipo de trabalho que procura.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-3 md:p-4">
            <DynamicGallery showCategories={true} />
          </div>
        </div>
      </section>

      {/* CONTACTO RÁPIDO / CTA FINAL */}
      <section className="bg-gradient-to-r from-brand-turquoise/15 via-black to-brand-yellow/15 py-14 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Gostava de ver o seu projeto aqui?
            </h2>
            <p className="text-sm md:text-base text-gray-200 mb-8">
              Fale connosco sobre a sua ideia — seja decoração de viatura,
              renovação de espaço comercial, papel de parede personalizado ou
              outro projeto especial. Podemos estudar tudo com uma maquete
              aproximada do resultado final.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button
                  size="lg"
                  className="bg-brand-yellow text-black hover:bg-brand-yellow/90 font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar a DOMREALCE
                </Button>
              </Link>

              <Link href="/servicos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black"
                >
                  Ver serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}