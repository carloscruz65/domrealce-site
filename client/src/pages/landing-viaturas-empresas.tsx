import React from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  MessageCircle,
  ArrowRight,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Star,
  Car,
  Truck,
} from "lucide-react";

/**
 * ✅ ONDE TROCAR (1 sítio só)
 * Se as imagens não carregarem, troca o BASE para o prefixo correto do teu projeto.
 * Exemplos comuns:
 * - "/public-objects/public/inicio/Landing-page-viaturas"
 * - "/objects/public/inicio/Landing-page-viaturas"
 * - "https://<teu-dominio-ou-cdn>/public/inicio/Landing-page-viaturas"
 */
const BASE = "/public-objects/inicio/Landing-page-viaturas";

/**
 * ✅ Cache-buster simples (evita “versões fantasmas”/cache agressiva durante testes)
 * Quando atualizares imagens, muda a string (ex.: "lp-v2").
 */
const ASSET_VERSION = "lp-v1";

/**
 * ✅ Assets num só sítio (hero + galeria).
 * A galeria agora tem subtitle por imagem (para os textos condizerem com cada foto).
 */
const ASSETS = {
  hero: {
    src: `${BASE}/IMG20231030164706.webp`,
    alt: "Decoração de carrinha comercial - trabalho real DOMREALCE",
  },
  gallery: [
    {
      src: `${BASE}/IMG20231117095713.webp`,
      alt: "Decoração de carrinha comercial - exemplo real DOMREALCE",
      title: "Carrinhas comerciais",
      subtitle: "Acabamento limpo · aplicação profissional",
    },
    {
      src: `${BASE}/IMG20240403181400.webp`,
      alt: "Rotulagem e branding em viatura - exemplo real DOMREALCE",
      title: "Rotulagem de marca",
      subtitle: "Branding visível · aplicação profissional",
    },
    {
      src: `${BASE}/IMG_20220603_185824.webp`,
      alt: "Decoração em camião/caixa com impressão e vinil - DOMREALCE",
      title: "Camiões e caixas",
      subtitle: "Legibilidade à distância · acabamento limpo",
    },
    {
      src: `${BASE}/IMG20250625133703.webp`,
      alt: "Decoração em grande formato (camião) - DOMREALCE",
      title: "Grande formato",
      subtitle: "Impacto visual · acabamento limpo",
    },
    {
      src: `${BASE}/IMG_20220815_170210.webp`,
      alt: "Frota: decoração em cisterna e viaturas - DOMREALCE",
      title: "Frotas e cisternas",
      subtitle: "Uniformização de frota · acabamento limpo",
    },
    {
      src: `${BASE}/IMG20250114091322.webp`,
      alt: "Decoração e vinil em máquinas e equipamentos - DOMREALCE",
      title: "Máquinas e equipamentos",
      subtitle: "Sinalética e branding · aplicação profissional",
    },
  ],
};

const proof = [
  { icon: CheckCircle, title: "Trabalho completo", desc: "Design, produção e aplicação no nosso atelier." },
  { icon: Shield, title: "Materiais premium", desc: "Vinil e impressão com durabilidade e acabamento limpo." },
  { icon: Star, title: "Experiência real", desc: "Projetos exigentes em carrinhas, camiões e máquinas." },
];

const steps = [
  { step: "01", title: "Contacto rápido", desc: "Envie fotos e diga o objetivo." },
  { step: "02", title: "Proposta & maquete", desc: "Proposta e maquete para aprovação." },
  { step: "03", title: "Produção", desc: "Produção com controlo de qualidade." },
  { step: "04", title: "Aplicação", desc: "Aplicação profissional, pensada para durar." },
];

const faqs = [
  {
    q: "Fazem só carrinhas comerciais?",
    a: "Trabalhamos carrinhas, camiões, atrelados, máquinas e também viaturas particulares. Esta página é focada em empresas e frotas comerciais.",
  },
  {
    q: "Quanto tempo demora?",
    a: "Depende do tipo de trabalho e da disponibilidade. Após analisar as fotos e medidas, enviamos estimativa e plano de execução.",
  },
  {
    q: "Preciso de ter o design pronto?",
    a: "Não. Criamos o design, preparamos os ficheiros e tratamos de todo o processo até à aplicação.",
  },
  {
    q: "Qual é o preço?",
    a: "O valor depende do tipo de viatura e da solução pretendida. Envie fotos e medidas para receber um orçamento personalizado.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-200">
      {children}
    </span>
  );
}

function withVersion(src: string) {
  // Evita “sumir/voltar” por cache agressiva durante desenvolvimento/restores
  return `${src}?v=${encodeURIComponent(ASSET_VERSION)}`;
}

export default function LandingViaturasEmpresas() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden w-full">
      <SEOHead
        title="Decoração de Viaturas para Empresas | DOMREALCE"
        description="Decoração e rotulagem de viaturas comerciais no Grande Porto. Design, produção e aplicação profissional. Peça orçamento rápido."
        keywords="decoração de viaturas, rotulagem viaturas, vinil, carrinhas comerciais, frota, grande porto, paredes"
        canonicalUrl="https://www.domrealce.com/decoracao-viaturas-empresas"
      />

      <Navigation />

      {/* HERO */}
      <section className="relative pt-10 pb-10 md:pt-16 md:pb-12 bg-gradient-to-b from-black via-[#0a0a0a] to-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* TEXTO */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 text-xs text-brand-yellow mb-4 mx-auto md:mx-0">
                <CheckCircle className="w-3 h-3" />
                <span>Decoração de viaturas para empresas</span>
              </div>

              {/* ✅ headline corrigida */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Transforme a sua{" "}
                <span className="text-brand-yellow">viatura numa publicidade</span>
                <br className="hidden sm:block" />
                em movimento
              </h1>

              <p className="text-base sm:text-lg text-gray-300 mb-5 max-w-xl mx-auto md:mx-0">
                Do design à aplicação final. Ideal para carrinhas, camiões e frotas comerciais no Grande Porto.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center md:justify-start">
                <Link href="/contactos#formulario">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 text-base"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Pedir orçamento
                  </Button>
                </Link>

                <a
                  href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20decoração%20de%20viatura%20comercial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-base"
                  >
                    WhatsApp direto
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start text-xs">
                <Pill>
                  <Clock className="w-3.5 h-3.5 mr-2 text-brand-yellow" />
                  Resposta rápida
                </Pill>
                <Pill>
                  <MapPin className="w-3.5 h-3.5 mr-2 text-brand-turquoise" />
                  Paredes · Grande Porto
                </Pill>
                <Pill>
                  <Shield className="w-3.5 h-3.5 mr-2 text-green-400" />
                  Materiais duráveis
                </Pill>
              </div>
            </div>

            {/* IMAGEM */}
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10 border border-white/10 h-[380px]">
                <img
                  src={withVersion(ASSETS.hero.src)}
                  alt={ASSETS.hero.alt}
                  className="w-full h-full object-cover object-[70%_65%] md:object-center"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    console.warn("Falhou hero:", ASSETS.hero.src);
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />

                {/* Gradient suave */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* TEXTO SEM BARRA */}
                <div className="absolute bottom-6 left-6">
                  <p className="text-brand-yellow font-semibold text-sm md:text-base">
                    Projetos exigentes. Resultado limpo.
                  </p>
                  <p className="text-xs text-gray-300">Produção e aplicação própria</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-400">
                <div className="inline-flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-yellow" />
                  Carrinhas
                </div>
                <div className="inline-flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-yellow" />
                  Camiões/Atrelados
                </div>
                <div className="inline-flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-yellow" />
                  Frotas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA / BENEFÍCIOS */}
      <section className="py-10 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Porque escolher a <span className="text-brand-yellow">DOMREALCE</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Foco em legibilidade, durabilidade e acabamento.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {proof.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="bg-black/60 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-brand-yellow" />
                      <h3 className="font-semibold text-white">{p.title}</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{p.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* MINI CTA */}
          <div className="mt-6 text-center">
            <p className="text-base text-gray-200 mb-4">Pronto para avançar com a sua viatura comercial?</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contactos#formulario">
                <Button className="bg-brand-yellow text-black font-semibold hover:bg-brand-yellow/90">
                  Pedir orçamento personalizado
                </Button>
              </Link>

              <a
                href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20decoração%20de%20viatura%20comercial."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-green-500/80 text-green-300 hover:bg-green-500 hover:text-white"
                >
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-10 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Exemplos <span className="text-brand-yellow">visuais</span>
              </h2>
              <p className="text-gray-400 text-sm">Trabalhos reais (DOMREALCE).</p>
            </div>
            <Link href="/servico-decoracao-viaturas">
              <Button variant="ghost" className="text-brand-yellow hover:text-brand-yellow/80">
                Ver serviço completo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ASSETS.gallery.map((img, idx) => (
              <div
                key={img.title + idx}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-brand-yellow/40 transition-colors bg-black/40"
              >
                <img
                  src={withVersion(img.src)}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority={idx < 2 ? "high" : "auto"}
                  decoding="async"
                  onError={(e) => {
                    console.warn("Falhou imagem galeria:", img.src);
                    (e.currentTarget as HTMLImageElement).src = withVersion(ASSETS.hero.src);
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute left-3 right-3 bottom-3">
                  <div className="px-2 py-1">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      {img.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      {img.subtitle ?? "Acabamento limpo · aplicação profissional"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contactos#formulario">
              <Button className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                Pedir orçamento agora <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a
              href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20decoração%20de%20viatura%20comercial."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-green-500 text-green-300 hover:bg-green-500 hover:text-white">
                WhatsApp direto
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="py-10 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Processo <span className="text-brand-yellow">simples</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Para não perder tempo e ter um resultado previsível.</p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-black/60 border border-white/10 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-yellow text-black flex items-center justify-center font-semibold text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-sm text-gray-300 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Perguntas <span className="text-brand-yellow">rápidas</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Respostas curtas para decidir rápido.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f) => (
              <Card key={f.q} className="bg-black/60 border-white/10">
                <CardContent className="p-5">
                  <p className="font-semibold text-white">{f.q}</p>
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-10 bg-gradient-to-r from-brand-yellow/10 via-[#0a0a0a] to-brand-turquoise/10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Pronto para avançar com a sua <span className="text-brand-yellow">viatura comercial?</span>?
            </h2>
            <p className="text-gray-300 mb-6">
              Envie 2 a 4 fotos da viatura, localidade e objetivo. Respondemos com orientação e orçamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button size="lg" className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Pedir orçamento
                </Button>
              </Link>

              <a
                href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20para%20decoração%20de%20viatura%20comercial.%20Tenho%20fotos%20e%20medidas."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-green-500 text-green-300 hover:bg-green-500 hover:text-white"
                >
                  Falar no WhatsApp
                </Button>
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">Sem compromisso · Resposta rápida · Produção e aplicação própria em atelier</p>
            <p className="mt-10 text-xs text-brand-yellow max-w-xl mx-auto md:mx-0">
              Além de viaturas, a DOMREALCE também trabalha montras, impressão digital e decoração.
              Loja online disponível no menu.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}