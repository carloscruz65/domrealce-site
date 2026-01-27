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

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=80",
    alt: "Carrinha comercial com decoração (placeholder)",
    title: "Carrinhas comerciais",
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
    alt: "Viatura com branding (placeholder)",
    title: "Rotulagem de marca",
  },
  {
    src: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&q=80",
    alt: "Detalhe de vinil aplicado (placeholder)",
    title: "Acabamento premium",
  },
  {
    src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1600&q=80",
    alt: "Camião/veículo grande (placeholder)",
    title: "Grande formato",
  },
  {
    src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1600&q=80",
    alt: "Frota/empresa (placeholder)",
    title: "Frotas",
  },
  {
    src: "https://images.unsplash.com/photo-1517142089942-ba376ce32a0b?w=1600&q=80",
    alt: "Aplicação de vinil (placeholder)",
    title: "Aplicação profissional",
  },
];

const proof = [
  { icon: CheckCircle, title: "Trabalho completo", desc: "Design, produção e aplicação no nosso atelier." },
  { icon: Shield, title: "Materiais premium", desc: "Vinil e impressão com durabilidade e acabamento limpo." },
  { icon: Star, title: "Experiência real", desc: "Projetos exigentes em carrinhas, camiões e máquinas." },
];

const steps = [
  { step: "01", title: "Contacto rápido", desc: "Diz-nos o tipo de viatura e objetivo." },
  { step: "02", title: "Proposta & maquete", desc: "Apresentamos solução e orçamento." },
  { step: "03", title: "Produção", desc: "Impressão e preparação com controlo de qualidade." },
  { step: "04", title: "Aplicação", desc: "Aplicação profissional (planeada para durar)." },
];

const faqs = [
  {
    q: "Fazem só carrinhas comerciais?",
    a: "Fazemos carrinhas, camiões, atrelados, máquinas e também viaturas particulares. Esta página é focada em empresas.",
  },
  {
    q: "Quanto tempo demora?",
    a: "Depende do tipo de trabalho e disponibilidade. Normalmente conseguimos responder com estimativa e plano após ver as fotos/medidas.",
  },
  {
    q: "Preciso de ter o design pronto?",
    a: "Não. Podemos criar o design e preparar tudo para produção e aplicação.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-200">
      {children}
    </span>
  );
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

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Decoração de viaturas{" "}
                <span className="text-brand-yellow">com acabamento premium</span>
                <br className="hidden sm:block" />
                para promover o seu negócio
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=80"
                  alt="Decoração de viatura comercial (placeholder)"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur rounded-lg px-4 py-3 text-center">
                    <p className="text-brand-yellow font-semibold">
                      Projetos exigentes. Resultado limpo.
                    </p>
                    <p className="text-xs text-gray-300">
                      Produção e aplicação própria
                    </p>
                  </div>
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
                  Competição
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
            <p className="text-gray-400 text-sm mt-2">
              Foco em legibilidade, durabilidade e acabamento.
            </p>
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
              <p className="text-gray-400 text-sm">Placeholders. Depois trocamos por trabalhos reais.</p>
            </div>
            <Link href="/servico-decoracao-viaturas">
              <Button variant="ghost" className="text-brand-yellow hover:text-brand-yellow/80">
                Ver serviço completo <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((img, idx) => (
              <div
                key={img.title + idx}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-brand-yellow/40 transition-colors"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading={idx < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute left-3 right-3 bottom-3">
                  <div className="bg-black/55 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-sm font-semibold text-white leading-tight">{img.title}</p>
                    <p className="text-[11px] text-gray-200">Resultado final com acabamento limpo</p>
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
              <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
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
            <p className="text-gray-400 text-sm mt-2">
              Para não perderes tempo e teres resultado previsível.
            </p>
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
              Quer avançar com a sua <span className="text-brand-yellow">viatura comercial</span>?
            </h2>
            <p className="text-gray-300 mb-6">
              Envie 2 a 4 fotos da viatura, localidade e objetivo. Respondemos com orientação e orçamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90"
                >
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
                  className="w-full sm:w-auto border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                >
                  Falar no WhatsApp
                </Button>
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Sem compromisso · Resposta rápida · Produção e aplicação própria
            </p>
            <p className="mt-10 text-xs text-brand-yellow max-w-xl mx-auto md:mx-0">
              Além de viaturas, a DOMREALCE também faz montras, impressão e decoração.
              Loja online disponível no menu.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}