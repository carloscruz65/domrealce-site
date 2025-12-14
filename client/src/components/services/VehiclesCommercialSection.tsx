import React from "react";
import { ChevronDown } from "lucide-react";

const item = "border-b border-gray-800 last:border-b-0";
const summary =
  "flex items-center justify-between w-full py-3 px-4 md:px-6 text-sm md:text-base font-semibold text-brand-yellow cursor-pointer";
const content =
  "pb-4 px-4 md:px-6 text-sm text-gray-300 leading-relaxed";

export function VehiclesCommercialSection() {
  return (
    <section className="py-16 bg-gray-900/40 border-t border-gray-900" id="comerciais">
      <div className="container mx-auto px-4">
        {/* Cabeçalho estilo HERO */}
        <div className="mb-10 md:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-black/40 px-3 py-1 text-sm text-brand-yellow">
            <span className="inline-block w-5 h-5 rounded-full border border-brand-yellow/40 flex items-center justify-center text-[10px]">
              🚚
            </span>
            Veículos comerciais
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                <span className="text-white">Frotas e carrinhas</span>{" "}
                <span className="text-brand-yellow">com imagem profissional</span>
              </h2>

              <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                Publicidade móvel com leitura clara e durabilidade
              </p>

              <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                Criamos e aplicamos rotulagem e decoração para viaturas de trabalho,
                com foco em legibilidade à distância, consistência de marca e materiais
                adequados ao uso diário.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href="/contactos#formulario"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-yellow text-black font-bold px-6 py-3 hover:bg-brand-yellow/90 transition"
                >
                  Pedir orçamento para frota <span className="ml-2">→</span>
                </a>

                <a
                  href="/portfolio"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-700 text-white font-semibold px-6 py-3 hover:border-brand-yellow/70 hover:text-brand-yellow transition"
                >
                  Ver exemplos
                </a>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Nota: damos prioridade a veículos comerciais e projetos de frota.
              </p>
            </div>

            {/* Imagem */}
            <div className="w-full">
              <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
                <img
                  src="/public-objects/servicos/comerciais/hero.webp"
                  alt="Viatura comercial com rotulagem profissional"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dropdowns em cartão único */}
        <p className="mt-12 md:mt-16 text-sm md:text-base text-gray-400 max-w-4xl">
          Detalhes do serviço para frotas e viaturas comerciais.
        </p>

        <div className="bg-black/60 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Tipos de trabalhos */}
          <details className={`${item} group`} open>
            <summary className={summary}>
              <span className="text-brand-yellow">Tipos de trabalhos que fazemos</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className={content}>
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">Rotulagem de frota</span>
                  <br />
                  Identificação consistente em várias viaturas (cores, layout, medidas).
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Decoração parcial</span>
                  <br />
                  Laterais, traseira, portas, capô, faixa superior, etc.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Reprodução por referência</span>
                  <br />
                  A partir de fotos/medidas para manter a imagem antiga.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Criação de raiz</span>
                  <br />
                  Layout pensado para leitura rápida e impacto (sem ruído).
                </li>
              </ul>
            </div>
          </details>

          {/* O que pedimos ao cliente */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">O que precisamos para começar</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className={content}>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">Logótipo e contactos</span>{" "}
                  (ou indicação do site/redes para recolha).
                </li>
                <li>
                  Fotos da viatura (laterais, traseira, frente) e se possível modelo/ano.
                </li>
                <li>
                  Objetivo principal: <span className="text-brand-yellow font-semibold">identificação</span>,{" "}
                  <span className="text-brand-yellow font-semibold">promoção</span> ou ambos.
                </li>
                <li>
                  Se é frota: quantas viaturas e se precisam de padronização.
                </li>
              </ul>
            </div>
          </details>

          {/* Materiais e durabilidade */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">Materiais e durabilidade</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className={content}>
              <p className="mb-3">
                Escolhemos o vinil e laminação conforme o uso, a cor, a exposição solar e a complexidade da superfície.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">Vinil de rotulagem</span> – ideal para publicidade e identificação.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Vinil cast</span> – quando há curvas/dobra e exigência superior.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Laminação</span> – protege e aumenta a vida útil quando necessário.
                </li>
              </ul>
            </div>
          </details>

          {/* Processo */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">Processo (rápido e controlado)</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className={content}>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <span className="font-semibold text-brand-yellow">Briefing</span> – objetivos, mensagens e zonas de aplicação.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Design</span> – layout com leitura clara e prova para aprovação.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Produção</span> – impressão/corte no nosso espaço.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Aplicação</span> – agendada para minimizar paragens da viatura.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">Entrega</span> – verificação final e recomendações.
                </li>
              </ol>
            </div>
          </details>

          {/* Antes/Depois */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">Antes e depois (como mostramos)</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className={content}>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">1. Estado atual</h4>
                  <p className="text-xs text-gray-400 mb-2">Fotos reais antes da intervenção.</p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto "ANTES"
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">2. Simulação</h4>
                  <p className="text-xs text-gray-400 mb-2">Prova visual do layout aprovado.</p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Mockup / simulação
                  </div>
                </div>
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">3. Resultado final</h4>
                  <p className="text-xs text-gray-400 mb-2">Entrega pronta para estrada.</p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto "DEPOIS"
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
