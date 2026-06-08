import React from "react";
import { trackWhatsAppConversion } from "@/utils/trackWhatsApp";
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
  Wrench,
  Layers,
  Award,
  Printer,
  PenTool,
  Sticker,
  Car,
  Store,
  Wallpaper,
  Building2,
} from "lucide-react";

const WA_URL =
  "https://wa.me/351930682725?text=Olá!%20Vi%20a%20página%20de%20Comunicação%20Visual%20e%20quero%20um%20orçamento.";

const GALLERY_BASE = "/public-objects/inicio/Landing-page-viaturas";

const services = [
  {
    icon: PenTool,
    title: "Design Gráfico",
    desc: "Criação de identidade visual, logótipos, cartazes e suportes de comunicação adaptados à sua marca.",
    href: "/servico-design-grafico",
  },
  {
    icon: Printer,
    title: "Impressão Digital",
    desc: "Impressão em grande formato para banners, lonas, telas, roll-ups e muito mais.",
    href: "/servico-impressao-digital",
  },
  {
    icon: Sticker,
    title: "Autocolantes e Etiquetas",
    desc: "Autocolantes de corte, etiquetas personalizadas e vinil para qualquer superfície.",
    href: "/servico-autocolantes",
  },
  {
    icon: Car,
    title: "Decoração de Viaturas",
    desc: "Rotulagem e decoração de carrinhas, camiões e frotas comerciais com acabamento profissional.",
    href: "/servico-decoracao-viaturas",
  },
  {
    icon: Store,
    title: "Espaços Comerciais",
    desc: "Decoração de montras, interiores e espaços comerciais que reforçam a presença da sua marca.",
    href: "/servico-espacos-comerciais",
  },
  {
    icon: Wallpaper,
    title: "Papel de Parede",
    desc: "Papel de parede personalizado com as suas imagens ou design, para escritórios e lojas.",
    href: "/servico-papel-parede",
  },
];

const vantagens = [
  {
    icon: Wrench,
    title: "Produção própria",
    desc: "Equipamentos e atelier próprios em Paredes. Sem intermediários, mais controlo de qualidade.",
  },
  {
    icon: Award,
    title: "Aplicação profissional",
    desc: "Equipa especializada com mais de 40 anos de experiência em aplicação de vinil e impressão.",
  },
  {
    icon: Layers,
    title: "Materiais duráveis",
    desc: "Usamos materiais certificados de marcas líderes do setor, adequados a uso exterior e interior.",
  },
  {
    icon: Building2,
    title: "Experiência empresarial",
    desc: "Mais de 1500 projetos concluídos para empresas de todos os setores.",
  },
];

const gallery = [
  {
    src: `${GALLERY_BASE}/IMG20231030164706.webp`,
    alt: "Decoração de viatura comercial DOMREALCE",
    caption: "Viaturas comerciais",
  },
  {
    src: `${GALLERY_BASE}/IMG20231117095713.webp`,
    alt: "Rotulagem de carrinha - DOMREALCE",
    caption: "Rotulagem de marca",
  },
  {
    src: `${GALLERY_BASE}/IMG20240403181400.webp`,
    alt: "Branding em viatura - DOMREALCE",
    caption: "Frotas e branding",
  },
  {
    src: `${GALLERY_BASE}/IMG_20220603_185824.webp`,
    alt: "Impressão em grande formato - DOMREALCE",
    caption: "Grande formato",
  },
  {
    src: `${GALLERY_BASE}/IMG_20220815_170210.webp`,
    alt: "Decoração de cisterna - DOMREALCE",
    caption: "Camiões e cisternas",
  },
  {
    src: `${GALLERY_BASE}/IMG20250114091322.webp`,
    alt: "Aplicação de vinil em equipamento - DOMREALCE",
    caption: "Máquinas e equipamentos",
  },
];

export default function LandingComunicacaoVisualEmpresas() {
  const handleWA = (e: React.MouseEvent) => {
    e.preventDefault();
    trackWhatsAppConversion(WA_URL);
  };

  return (
    <>
      <SEOHead
        title="Comunicação Visual para Empresas | DOMREALCE"
        description="Comunicação visual, impressão digital, decoração de viaturas, montras, autocolantes e publicidade para empresas. Produção e aplicação própria na DOMREALCE."
        keywords="comunicação visual empresas, impressão digital, decoração viaturas, autocolantes, papel de parede, espaços comerciais, Porto"
      />
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden pt-20">
        {/* Background — colagem 2×2 com 4 serviços */}
        <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2">
          <img
            src="/public-objects/servicos/decoracao-viaturas/comerciais.webp"
            alt="Decoração de viaturas"
            className="w-full h-full object-cover"
          />
          <img
            src="/public-objects/servicos/espacos-comerciais.webp"
            alt="Espaços comerciais"
            className="w-full h-full object-cover"
          />
          <img
            src="/public-objects/servicos/impressao-digital.webp"
            alt="Impressão digital"
            className="w-full h-full object-cover"
          />
          <img
            src="/public-objects/servicos/autocolantes.webp"
            alt="Autocolantes e etiquetas"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradiente sobre a colagem */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
          {/* Separadores subtis entre as 4 células */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/60" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/60" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
              Para Empresas
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Comunicação Visual{" "}
              <span className="text-brand-yellow">para Empresas</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Design, impressão e aplicação para destacar a sua marca em
              viaturas, montras, espaços comerciais e suportes publicitários.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contactos">
                <Button
                  size="lg"
                  className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 text-base px-8"
                >
                  Pedir Orçamento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWA}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-base px-8 w-full sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Direto
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-brand-yellow" />
                Resposta em 24h
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-brand-yellow" />
                Aplicação própria
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-brand-yellow" />
                +1500 projetos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS PRINCIPAIS ── */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Os Nossos{" "}
              <span className="text-brand-yellow">Serviços</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Da ideia à aplicação — tudo produzido e instalado pela nossa
              equipa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.href} href={s.href}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-brand-yellow/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-yellow/10 cursor-pointer group h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 flex items-center justify-center mb-4 group-hover:bg-brand-yellow/20 transition-colors">
                        <Icon className="h-6 w-6 text-brand-yellow" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {s.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1">
                        {s.desc}
                      </p>
                      <div className="mt-4 flex items-center text-brand-yellow text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
                        Ver serviço
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PORQUE ESCOLHER A DOMREALCE ── */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Porque Escolher a{" "}
              <span className="text-brand-yellow">DOMREALCE?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vantagens.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="text-center px-4 py-6 rounded-2xl bg-zinc-950 border border-zinc-800"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-brand-yellow" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TRABALHOS REALIZADOS ── */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Trabalhos{" "}
              <span className="text-brand-yellow">Realizados</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Viaturas, montras, impressão e espaços comerciais — exemplos reais
              da nossa produção.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((img) => (
              <div
                key={img.src}
                className="relative overflow-hidden rounded-xl aspect-[4/3] group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  {img.caption}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/portfolio">
              <Button
                variant="outline"
                className="border-zinc-700 text-gray-300 hover:border-brand-yellow hover:text-brand-yellow"
              >
                Ver portfólio completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CHAMADA À AÇÃO FINAL ── */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Vamos destacar{" "}
            <span className="text-brand-yellow">a sua empresa?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Envie-nos as suas ideias ou dimensões e receba um orçamento sem
            compromisso. Respondemos em menos de 24 horas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contactos">
              <Button
                size="lg"
                className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 text-base px-8 w-full sm:w-auto"
              >
                Pedir Orçamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWA}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-base px-8 w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Direto
              </Button>
            </a>
          </div>

          <p className="mt-6 text-gray-500 text-sm">
            Atelier em Paredes · Grande Porto · Produção e aplicação própria
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
