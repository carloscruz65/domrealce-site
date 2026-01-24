import { lazy, Suspense } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  ArrowRight,
  Car,
  Store,
  Palette,
  Printer,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";

const quickServices = [
  {
    icon: <Car className="w-8 h-8" />,
    title: "Viaturas",
    description: "Rotulagem e decoração",
    href: "/servico-decoracao-viaturas",
    color: "text-brand-yellow",
  },
  {
    icon: <Store className="w-8 h-8" />,
    title: "Montras",
    description: "Espaços comerciais",
    href: "/servico-espacos-comerciais",
    color: "text-brand-turquoise",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Decoração",
    description: "Papel de parede",
    href: "/servico-papel-parede",
    color: "text-brand-coral",
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: "Impressão",
    description: "Lonas e painéis",
    href: "/servico-impressao-digital",
    color: "text-brand-yellow",
  },
];

const featuredProjects = [
  // Linha 1: Viaturas (com âncoras)
  {
    title: "Carrinhas comerciais",
    image: "/public-objects/servicos/1768587381333-IMG_20161228_164220.webp",
    href: "/servico-decoracao-viaturas#comerciais",
    badge: "Viaturas",
  },
  {
    title: "Camiões e atrelados",
    image:
      "/public-objects/servicos/1766825756937-Decoracao_volvo_globetrotter_reboconorte.webp",
    href: "/servico-decoracao-viaturas#camioes",
    badge: "Viaturas",
  },
  {
    title: "Máquinas e equipamentos",
    image: "/public-objects/servicos/JLG450AJ.webp",
    href: "/servico-decoracao-viaturas#maquinas",
    badge: "Viaturas",
  },

  // Linha 2: Outros (sem âncoras)
  {
    title: "Impressão digital",
    image: "/public-objects/servicos/1766769024380-textura_tijolo_burro.webp",
    href: "/servico-impressao-digital",
    badge: "Outros",
  },
  {
    title: "Telas artísticas",
    image: "/public-objects/servicos/telas-artisticas.webp",
    href: "/servico-telas-artisticas",
    badge: "Outros",
  },
  {
    title: "Espaços comerciais",
    image: "/public-objects/servicos/espacos-comerciais.webp",
    href: "/servico-espacos-comerciais",
    badge: "Outros",
  },
];

export default function HomeV2() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <SEOHead
        title="Decoração de Viaturas e Comunicação Visual | DOMREALCE"
        description="Decoração de viaturas, montras, impressão digital e papel de parede personalizado. Materiais premium e aplicação própria. Peça orçamento sem compromisso."
        keywords="decoração viaturas, rotulagem, vinil, wrapping, montras, impressão digital, papel de parede, Paredes, Porto"
        canonicalUrl="https://www.domrealce.com/"
      />

      <Navigation />

      {/* HERO */}
      <section className="relative pt-16 sm:pt-18 pb-10 md:pt-28 md:pb-12 bg-gradient-to-b from-black via-[#0a0a0a] to-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* TEXTO */}
            <div className="order-2 md:order-1 text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 text-xs text-brand-yellow mb-4 mx-auto md:mx-0">
                <CheckCircle className="w-3 h-3" />
                <span>Durabilidade a sério. Orçamento grátis.</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Se resiste ao{" "}
                <span className="text-brand-yellow">todo-o-terreno</span>,
                <br className="hidden sm:block" /> resiste ao{" "}
                <span className="text-brand-turquoise">dia-a-dia</span> da sua
                empresa.
              </h1>

              {/* Teaser curto ANTES dos botões (mobile) */}
              <p className="text-base sm:text-lg text-gray-300 mb-5 max-w-xl mx-auto md:mx-0">
                Vinil e aplicação profissional para viaturas e frotas, com
                acabamento premium e resistência comprovada.
              </p>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center md:justify-start">
                <Link href="/contactos#formulario">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 text-base"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Pedir orçamento grátis
                  </Button>
                </Link>

                <a
                  href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20DOMREALCE"
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

              {/* IMAGEM (mobile fica aqui, entre botões e descrição) */}
              <div className="order-3 md:hidden mb-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10">
                  <img
                    src="/public-objects/inicio/slider/1766771076470-ford_ranger_hortouniao.webp"
                    alt="Decoração de viatura DOMREALCE"
                    className="w-full aspect-[4/3] object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur rounded-lg px-4 py-3 text-center">
                      <p className="text-brand-yellow font-semibold">
                        Projetos exigentes. Acabamento premium.
                      </p>
                      <p className="text-xs text-gray-300">
                        Atelier próprio em Paredes · 40+ anos de experiência
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição completa (mobile vem DEPOIS da imagem, desktop fica como antes) */}
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 max-w-xl mx-auto md:mx-0">
                Do design à aplicação final no Grande Porto. Ideal para carrinhas
                comerciais, camiões, máquinas e frotas que precisam de durar.
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <span>Resposta em 24h</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-turquoise" />
                  <span>Aplicação própria (Grande Porto)</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Materiais premium +200 projetos</span>
                </div>
              </div>
            </div>

            {/* Hero image (desktop) */}
            <div className="hidden md:block order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10">
                <img
                  src="/public-objects/inicio/slider/1766771076470-ford_ranger_hortouniao.webp"
                  alt="Decoração de viatura DOMREALCE"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur rounded-lg px-4 py-3 text-center">
                    <p className="text-brand-yellow font-semibold">
                      Projetos exigentes. Acabamento premium.
                    </p>
                    <p className="text-xs text-gray-300">
                      Atelier próprio em Paredes · 40+ anos de experiência
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* /Hero image */}
          </div>
        </div>
      </section>

      {/* Quick services */}
      <section className="py-8 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400 mb-4">O que fazemos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickServices.map((service) => (
              <Link key={service.title} href={service.href}>
                <Card className="bg-black/60 border-white/10 hover:border-brand-yellow/50 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`${service.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-400">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos reais (fixo, 3+3, com links para serviços) */}
      <section className="py-10 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Projetos <span className="text-brand-yellow">reais</span>
              </h2>
              <p className="text-gray-400 text-sm">Exemplos por categoria</p>
            </div>

            <Link href="/portfolio">
              <Button
                variant="ghost"
                className="text-brand-yellow hover:text-brand-yellow/80"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featuredProjects.map((item, index) => (
              <Link key={`${item.href}-${index}`} href={item.href}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-brand-yellow/40 transition-colors">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-colors" />

                  {/* etiqueta + título */}
                  <div className="absolute left-3 top-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full bg-black/60 border border-white/15 text-gray-200">
                      {item.badge}
                    </div>
                  </div>
                  <div className="absolute left-3 right-3 bottom-3">
                    <div className="bg-black/55 backdrop-blur-sm rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold text-white leading-tight">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Ver serviço →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/portfolio">
              <Button className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                Ver portfólio completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-10 bg-gradient-to-r from-brand-yellow/10 via-[#0a0a0a] to-brand-turquoise/10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Quer um projeto{" "}
              <span className="text-brand-yellow">semelhante</span>?
            </h2>
            <p className="text-gray-300 mb-6">
              Fale connosco e receba um orçamento personalizado sem compromisso.
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
                href="https://wa.me/351930682725?text=Olá!%20Vi%20o%20vosso%20site%20e%20quero%20saber%20mais."
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
              Sem compromisso · Resposta em menos de 24 horas
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}