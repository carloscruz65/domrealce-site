import React from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const item = "border-b border-gray-800 last:border-b-0";

const summary =
  "flex items-center justify-between w-full py-4 px-4 md:px-6 " +
  "text-sm md:text-base font-semibold text-brand-yellow cursor-pointer " +
  "bg-gray-900/30 hover:bg-gray-900/55 transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/40 " +
  "group-open:bg-gray-900/60 list-none";

const content =
  "px-4 md:px-6 pb-6 pt-4 text-sm text-gray-300 leading-relaxed " +
  "bg-black/40 border-t border-gray-800";

interface HeroApiResponse {
  hero: {
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
  } | null;
}

interface MachinesSectionProps {
  serviceId?: string;
  heroImage?: string;
  heroAlt?: string;
}

/**
 * Logos (Object Storage) - mantém fora do componente para não recriar em cada render.
 * NOTA: se algum logo não aparecer por ser .svg (headers), troca para .svg.
 */
const brandLogos = [
  {
    name: "Volvo",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-01-v2.svg",
  },
  {
    name: "Komatsu",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-02-v2.svg",
  },
  {
    name: "Haulotte",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-03-v2.svg",
  },
  {
    name: "JCB",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-04-v2.svg",
  },
  {
    name: "CAT",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-05-v2.svg",
  },
  {
    name: "Manitou",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-06-v2.svg",
  },
  {
    name: "Toyota (empilhadores)",
    src: "/public-objects/assets/Marcas_maquinas/marcas_maquina-07-v2.svg",
  },
];

// ✅ Imagens Antes/Planeamento/Depois (Object Storage)
const beforeAfterImages = {
  before:
    "/public-objects/assets/antes_depois_volvo_a30g/1_volvo_a30g_velha.webp",
  plan:
    "/public-objects/assets/antes_depois_volvo_a30g/2_Kit_vinil_Volvo_A30G.webp",
  after: "/public-objects/assets/antes_depois_volvo_a30g/3_Volvo_A30G.webp",
};

function HeroSkeleton() {
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <div className="h-12 md:h-16 w-3/4 rounded-xl bg-gray-800/40 animate-pulse" />
        <div className="mt-4 h-7 md:h-9 w-2/3 rounded-xl bg-gray-800/35 animate-pulse" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-800/25 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-gray-800/25 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-gray-800/25 animate-pulse" />
        </div>
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="h-12 w-56 rounded-xl bg-gray-800/30 animate-pulse" />
          <div className="h-12 w-40 rounded-xl bg-gray-800/20 animate-pulse" />
        </div>
      </div>

      <div className="w-full">
        <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
          <div className="w-full h-full bg-gray-800/25 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MachinesSection({
  serviceId = "decoracao-viaturas-maquinas",
  heroImage: propHeroImage = "/public-objects/servicos/maquinas/hero.webp",
  heroAlt = "Máquina industrial com decoração finalizada",
}: MachinesSectionProps) {
  const { data: apiData, isLoading, isFetching, isError } =
    useQuery<HeroApiResponse>({
      queryKey: ["/api/service-heroes", serviceId],
      enabled: !!serviceId,
      // ✅ evita cache “fantasma” e garante que usa o que está na DB
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });

  const heroData = apiData?.hero ?? null;

  // ✅ Defaults só entram SE a query já terminou e não veio nada do editor/DB.
  const heroImage =
    heroData?.backgroundImage ||
    (!isLoading && !isFetching ? propHeroImage : "");
  const heroTitle =
    heroData?.title || (!isLoading && !isFetching ? "Máquinas industriais" : "");
  const heroSubtitle =
    heroData?.subtitle ||
    (!isLoading && !isFetching
      ? "Identificação técnica e decoração funcional"
      : "");
  const heroDescription =
    heroData?.description ||
    (!isLoading && !isFetching
      ? "Planeamento técnico e decoração funcional para máquinas de construção, elevação e logística, com base no modelo real da máquina e no trabalho que faz todos os dias."
      : "");

  return (
    <section className="py-16 bg-black border-t border-gray-900">
      <div className="container mx-auto px-4">
        {/* Cabeçalho estilo HERO (como a secção principal) */}
        <div className="mb-10 md:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-black/40 px-3 py-1 text-sm text-brand-yellow">
            <span className="inline-block w-5 h-5 rounded-full border border-brand-yellow/40 flex items-center justify-center text-[10px]">
              ⚙️
            </span>
            Máquinas industriais
          </div>

          {/* ✅ Enquanto carrega: skeleton (em vez de mostrar defaults e trocar depois) */}
          {isLoading || isFetching ? (
            <HeroSkeleton />
          ) : (
            <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
              {/* Texto */}
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                  <span className="text-white">{heroTitle}</span>{" "}
                  <span className="text-brand-yellow">
                    & equipamentos pesados
                  </span>
                </h2>

                <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                  {heroSubtitle}
                </p>

                <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                  {heroDescription}
                </p>

                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href="/contactos-maquinas#formulario"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-yellow text-black font-bold px-6 py-3 hover:bg-brand-yellow/90 transition"
                  >
                    Pedir orçamento para máquina <span className="ml-2">→</span>
                  </a>

                  <a
                    href="/portfolio"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-700 text-white font-semibold px-6 py-3 hover:border-brand-yellow/70 hover:text-brand-yellow transition"
                  >
                    Ver exemplos
                  </a>
                </div>
              </div>

              {/* Imagem */}
              <div className="w-full">
                <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={heroAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800/20" />
                  )}
                </div>

                {/* ✅ Debug visual discreto (remove se não quiseres) */}
                {isError ? (
                  <p className="mt-2 text-xs text-red-400">
                    Erro a carregar Hero do editor (serviceId: {serviceId})
                  </p>
                ) : null}
                {!heroData ? (
                  <p className="mt-2 text-xs text-gray-500">
                    A usar valores por defeito (hero não definido no editor para:{" "}
                    {serviceId})
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Dropdowns em cartão único */}
        <p className="mt-12 md:mt-16 text-sm md:text-base text-gray-400 max-w-4xl">
          Explore os detalhes técnicos abaixo para compreender o nosso método de
          trabalho em máquinas industriais.
        </p>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Tipos de máquinas */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Tipos de máquinas que trabalhamos
              </span>
              <ChevronDown
                className={
                  "w-5 h-5 text-brand-yellow transition-all duration-300 " +
                  "group-open:rotate-180 " +
                  "rounded-full border border-gray-700 bg-black/20 p-0.5 " +
                  "group-hover:border-brand-yellow/60 group-hover:bg-black/40"
                }
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                A decoração é pensada para o tipo de trabalho da máquina e para
                o ambiente onde opera: obra, armazém, exterior, interior.
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Terraplenagem e construção
                  </span>
                  <br />
                  Escavadoras, retroescavadoras, bulldozers, dumpers,
                  motoniveladoras.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Elevação e acesso
                  </span>
                  <br />
                  Gruas, plataformas elevatórias e equipamentos de acesso.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Logística e armazém
                  </span>
                  <br />
                  Empilhadores e equipamentos de movimentação de cargas.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Outros equipamentos industriais
                  </span>
                  <br />
                  Máquinas especiais e projetos que exigem estudo à parte.
                </li>
              </ul>
            </div>
          </details>

          {/* Processo técnico */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Processo técnico de trabalho
              </span>
              <ChevronDown
                className={
                  "w-5 h-5 text-brand-yellow transition-all duration-300 " +
                  "group-open:rotate-180 " +
                  "rounded-full border border-gray-700 bg-black/20 p-0.5 " +
                  "group-hover:border-brand-yellow/60 group-hover:bg-black/40"
                }
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                O objetivo é reduzir improvisos, evitar surpresas e garantir um
                resultado consistente em cada máquina.
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Levantamento no local
                  </span>{" "}
                  – análise da máquina no estado real, zonas críticas e
                  condições de aplicação.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Registo fotográfico detalhado
                  </span>{" "}
                  – fotografamos todos os lados e pontos importantes.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Medidas sobre as imagens
                  </span>{" "}
                  – utilizamos registo de medidas diretamente nas fotos para
                  planear à escala (ImageMeter Pro / método equivalente).
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Planeamento em estúdio
                  </span>{" "}
                  – desenho técnico, organização dos autocolantes por zonas e
                  leitura à distância.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Produção e aplicação controlada
                  </span>{" "}
                  – impressão nas nossas instalações e aplicação nas
                  instalações do cliente
                </li>
              </ol>
            </div>
          </details>

          {/* Planeamento por modelo */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Planeamento por modelo de máquina
              </span>
              <ChevronDown
                className={
                  "w-5 h-5 text-brand-yellow transition-all duration-300 " +
                  "group-open:rotate-180 " +
                  "rounded-full border border-gray-700 bg-black/20 p-0.5 " +
                  "group-hover:border-brand-yellow/60 group-hover:bg-black/40"
                }
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Ao longo dos anos foi criada uma base técnica de modelos de
                máquinas, que permite acelerar o trabalho sem perder rigor.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  Muitos modelos comuns já têm esquemas e planos de autocolantes
                  preparados, o que reduz o tempo de resposta.
                </li>
                <li>
                  Quando surge um modelo novo, o levantamento passa a fazer
                  parte dessa biblioteca para futuros projetos.
                </li>
                <li>
                  O foco está sempre em proporções corretas, leitura funcional e
                  compatibilidade com a realidade da máquina.
                </li>
              </ul>
            </div>
          </details>

          {/* Antes / Planeamento / Depois */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Antes, planeamento e resultado final
              </span>
              <ChevronDown
                className={
                  "w-5 h-5 text-brand-yellow transition-all duration-300 " +
                  "group-open:rotate-180 " +
                  "rounded-full border border-gray-700 bg-black/20 p-0.5 " +
                  "group-hover:border-brand-yellow/60 group-hover:bg-black/40"
                }
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Sempre que possível, enviamos uma maquete para que o cliente compreenda exatamente o que está a ser feito.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    1. Máquina no estado atual
                  </h4>

                  {/* ✅ IMAGEM ANTES */}
                  <div className="aspect-[4/3] rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden">
                    <img
                      src={beforeAfterImages.before}
                      alt='Máquina "antes" da decoração'
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    2. Kit de autocolantes. 
                  </h4>

                  {/* ✅ IMAGEM PLANEAMENTO */}
                  <div className="aspect-[4/3] rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden">
                    <img
                      src={beforeAfterImages.plan}
                      alt="Planeamento técnico da decoração"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    3. Máquina pronta para trabalhar
                  </h4>

                  {/* ✅ IMAGEM DEPOIS */}
                  <div className="aspect-[4/3] rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden">
                    <img
                      src={beforeAfterImages.after}
                      alt='Máquina "depois" da decoração'
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* Marcas / logos */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Marcas e equipamentos frequentes
              </span>
              <ChevronDown
                className={
                  "w-5 h-5 text-brand-yellow transition-all duration-300 " +
                  "group-open:rotate-180 " +
                  "rounded-full border border-gray-700 bg-black/20 p-0.5 " +
                  "group-hover:border-brand-yellow/60 group-hover:bg-black/40"
                }
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Trabalhamos com máquinas de várias marcas reconhecidas na
                construção e indústria.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brandLogos.map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center justify-center h-20 md:h-24 rounded-md border border-gray-800 bg-black px-4 py-3"
                    title={b.name}
                  >
                    <img
                      src={b.src}
                      alt={b.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}

                <div className="flex items-center justify-center h-20 md:h-24 rounded-md border border-gray-800 bg-black px-4 text-center text-xs md:text-sm text-gray-300">
                  Outros modelos sob consulta
                </div>
              </div>
            </div>
          </details>

          {/* Notas importantes */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Notas importantes antes de iniciar
              </span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Algumas condições são essenciais para garantir qualidade,
                segurança e um planeamento rigoroso.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Não remover vinis antigos antes do levantamento técnico.
                  </span>{" "}
                  Os autocolantes existentes servem de referência para dimensões
                  e posicionamento.
                </li>
                <li>
                  A máquina deve estar acessível para medição, fotografia e
                  análise das zonas de aplicação.
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
