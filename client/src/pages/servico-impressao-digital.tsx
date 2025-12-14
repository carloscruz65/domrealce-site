import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Printer,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Maximize,
  Palette,
  Clock,
  Award,
  ChevronDown,
} from "lucide-react";

export default function ServicoImpressaoDigital() {
  const features = [
    {
      icon: <Maximize className="w-6 h-6" />,
      title: "Tintas Látex Premium",
      description:
        "Impressões com tintas látex de alta qualidade, sem odor e resistentes ao desbotamento.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Produção Rápida",
      description:
        "Prazos de entrega reduzidos sem comprometer a qualidade de impressão.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Gestão de Prazos",
      description:
        "Planeamento de produção para cumprir prazos apertados com segurança.",
    },
  ];

  const materials = [
    {
      name: "Vinil Autocolante",
      description: "Para aplicação em superfícies lisas e curvas.",
      applications: ["Montras", "Viaturas", "Sinalização"],
    },
    {
      name: "Vinil Decorativo",
      description: "Acabamento mate para decoração interior.",
      applications: ["Paredes", "Móveis", "Vidros"],
    },
    {
      name: "Lona Publicitária",
      description: "Resistente para exterior, com ilhós incluídos.",
      applications: ["Fachadas", "Eventos", "Obras"],
    },
    {
      name: "Lona Perfurada",
      description:
        "Permite passagem de vento, ideal para vedações e fachadas.",
      applications: ["Andaimes", "Vedações", "Fachadas"],
    },
  ];

  // Processo simplificado (3 passos), igual em estilo ao de Design Gráfico
  const process = [
    {
      step: "01",
      title: "Análise do Ficheiro",
      description:
        "Verificamos resolução, cores e preparamos o ficheiro para garantir a melhor qualidade de impressão.",
    },
    {
      step: "02",
      title: "Seleção de Material",
      description:
        "Aconselhamos e escolhemos consigo o material mais adequado à aplicação pretendida.",
    },
    {
      step: "03",
      title: "Impressão e Entrega",
      description:
        "Produção, acabamentos finais e entrega ou instalação, conforme combinado.",
    },
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
      alt: "Impressão digital em vinil",
      title: "Vinil Autocolante",
    },
    {
      src: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80",
      alt: "Lona publicitária impressa",
      title: "Lona Publicitária",
    },
    {
      src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
      alt: "Impressão grande formato",
      title: "Grande Formato",
    },
    {
      src: "https://images.unsplash.com/photo-1605289355680-75fb41239154?w=800&q=80",
      alt: "Decoração de montra",
      title: "Decoração de Montras",
    },
    {
      src: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80",
      alt: "Material promocional impresso",
      title: "Material Promocional",
    },
    {
      src: "https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=800&q=80",
      alt: "Sinalética comercial",
      title: "Sinalética",
    },
  ];

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "impressao-digital"],
  });

  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* ⬇️ DESCE A SECÇÃO DO HERO */}
      <section className="pt-12 md:pt-16">
        <ServiceHeroTwoColumn
          badge="Impressão Digital Profissional"
          badgeIcon={<Printer className="w-4 h-4" />}
          title="Impressão Digital de grande formato"
          subtitle="Qualidade profissional"
          description="Tecnologia de impressão digital de última geração para projetos de grande impacto. Qualidade fotográfica em materiais resistentes e duradouros."
          imageSrc="/public-objects/servicos/impressao-digital.webp"
          imageAlt="Impressão Digital DOMREALCE"
          imageClassName="translate-y-10 md:translate-y-16"
        />
      </section>

      <main>
        {/* TECNOLOGIA AVANÇADA */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-yellow">Tecnologia</span>{" "}
                <span className="text-white">Avançada</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Equipamentos de impressão digital que garantem qualidade
                excecional em todos os projetos.
              </p>
            </div>

            {/* Cartão grande: Materiais e Acabamentos */}
            <div className="max-w-5xl mx-auto mb-10">
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-2xl font-semibold mb-3 text-white">
                    Materiais e Acabamentos
                  </h3>
                  <p className="text-gray-400 text-base mb-4">
                    Trabalhamos com uma seleção de materiais profissionais e
                    acabamentos técnicos pensados para durar. Cada projeto é
                    preparado de acordo com o local de aplicação, exposição ao
                    exterior e objetivo de comunicação, garantindo sempre boa
                    reprodução de cor, estabilidade e durabilidade.
                  </p>

                  <details className="group mt-2">
                    <summary className="cursor-pointer flex items-center justify-between text-sm text-brand-yellow select-none">
                      <span>Ver materiais e suportes utilizados</span>
                      <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">
                            Vinis de várias gamas
                          </span>{" "}
                          (monoméricos, poliméricos e cast) para montras,
                          viaturas e sinalética interior e exterior.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">
                            Lonas publicitárias
                          </span>{" "}
                          (frontlit, backlit e perfuradas) para fachadas,
                          eventos, vedações e grandes formatos.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">
                            Vinil decorativo e jateado
                          </span>{" "}
                          para interiores, privacidade em vidro e ambientes mais
                          acolhedores.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">
                            Suportes rígidos
                          </span>{" "}
                          como PVC e acrílico, ideais para placas, sinalética e
                          comunicação permanente.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">
                            Proteção e acabamentos
                          </span>{" "}
                          com laminação mate ou brilho, proteção UV e corte de
                          contorno para maior durabilidade e melhor acabamento
                          visual.
                        </p>
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>

            {/* Linha de 3 cartões: Tintas, Produção, Prazos */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
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
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PORQUÊ ESCOLHER A NOSSA IMPRESSÃO DIGITAL */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Porquê escolher a nossa</span>{" "}
                <span className="text-brand-yellow">Impressão Digital?</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Três pilares orientam cada projeto: durabilidade, qualidade de
                impressão e respeito absoluto pelos prazos combinados.
              </p>
            </div>

            {/* Selos de qualidade */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-wrap justify-center gap-4">
                {/* Durabilidade Garantida */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-yellow/40 bg-gray-900/70">
                  <Shield className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm text-gray-100">
                    Durabilidade garantida
                  </span>
                </div>

                {/* Qualidade de Impressão Profissional */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-yellow/40 bg-gray-900/70">
                  <Award className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm text-gray-100">
                    Qualidade de impressão profissional
                  </span>
                </div>

                {/* Pontualidade nos prazos */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-yellow/40 bg-gray-900/70">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm text-gray-100">
                    Pontualidade nos prazos
                  </span>
                </div>
              </div>
            </div>

            {/* Argumentos / razões */}
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Cores fiéis e consistentes
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Trabalhamos com perfis de cor calibrados (ICC) e controlo de
                  prova, para que o resultado final corresponda ao que foi
                  aprovado em design.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Pensado para interior e exterior
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Selecionamos materiais de acordo com a exposição ao sol, chuva
                  e desgaste, garantindo durabilidade adequada a cada contexto.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Preparação técnica dos ficheiros
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Verificamos resolução, margens, cortes e cores antes de
                  produzir, reduzindo retrabalho e surpresas indesejadas.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Aconselhamento personalizado
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Ajudamos a escolher o material e acabamento ideais para o
                  objetivo do projeto, seja montra, viatura, interior ou
                  sinalética.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Acabamentos profissionais
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Laminação mate ou brilho, proteção UV e corte de contorno
                  preciso, para um resultado final mais resistente e valorizado.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Acompanhamento até à instalação
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Sempre que necessário, acompanhamos o projeto até à
                  instalação, garantindo que tudo fica aplicado com o rigor que
                  planeámos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA – cartões simples, sem clique/zoom */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-yellow">Trabalhos</span>{" "}
                <span className="text-white">em Impressão Digital</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Alguns exemplos de projetos de impressão digital em grande
                formato realizados para os nossos clientes.
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

        {/* MATERIAIS DISPONÍVEIS – mantida */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Materiais</span>{" "}
                <span className="text-brand-yellow">Disponíveis</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Selecionamos materiais que garantem durabilidade, boa
                reprodução de cor e resistência às condições de utilização.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {materials.map((material, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                      {material.name}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {material.description}
                    </p>
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">
                        Aplicações:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {material.applications.map((app, appIndex) => (
                          <Badge
                            key={appIndex}
                            variant="outline"
                            className="border-brand-yellow text-brand-yellow"
                          >
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESSO – versão minimalista, agora com 3 colunas em desktop */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Como</span>{" "}
                <span className="text-brand-yellow">Trabalhamos</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Um processo simples e claro, que garante qualidade, prazos
                cumpridos e o resultado que tinha em mente.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid gap-6 md:grid-cols-3">
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

        {/* ESPECIFICAÇÕES / CONFIANÇA */}
        <section className="py-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Especificações</span>{" "}
                  <span className="text-white">Técnicas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Equipamentos de última geração que permitem impressões de
                  qualidade excecional em grandes formatos, com cores fiéis e
                  elevada durabilidade.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Tintas látex sem odor.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Resolução até 1440 DPI.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">
                      Perfis de cor calibrados (ICC).
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">
                      Opções de laminação e proteção adicional.
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-10 h-10 text-brand-yellow mx-auto mb-3" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Experiência e Qualidade
                  </h3>
                  <p className="text-gray-400">
                    Com décadas de experiência em comunicação visual, ajudamos a
                    definir a melhor solução para cada projeto, do desenho à
                    instalação.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Durabilidade exterior</span>
                    <span className="text-brand-yellow font-semibold">
                      Até 5–7 anos
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-brand-yellow font-semibold">
                      2–5 dias úteis
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tipo de projetos</span>
                    <span className="text-brand-yellow font-semibold">
                      Pontuais ou recorrentes
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Apoio técnico</span>
                    <span className="text-brand-yellow font-semibold">
                      Incluído em todos os trabalhos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para imprimir o seu</span>{" "}
              <span className="text-brand-yellow">próximo projeto?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Envie-nos os detalhes do seu projeto e ajudamos a escolher os
              materiais e formatos ideais para obter o melhor resultado.
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
                  href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20impressão%20digital."
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
