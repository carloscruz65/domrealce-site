import React from "react";
import { ChevronDown } from "lucide-react";

const item = "border-b border-gray-800 last:border-b-0";

const summary =
  "flex items-center justify-between w-full py-3 px-4 md:px-6 text-sm md:text-base font-semibold text-brand-yellow cursor-pointer";

const content =
  "pb-4 px-4 md:px-6 text-sm text-gray-300 leading-relaxed";

export function TrucksSection() {
  return (
    <section className="py-16 bg-black border-t border-gray-900">
      <div className="container mx-auto px-4">
        {/* Cabeçalho estilo HERO */}
        <div className="mb-10 md:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-black/40 px-3 py-1 text-sm text-brand-yellow">
            <span className="inline-block w-5 h-5 rounded-full border border-brand-yellow/40 flex items-center justify-center text-[10px]">
              🚛
            </span>
            Camiões e atrelados
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                <span className="text-white">Camiões</span>{" "}
                <span className="text-brand-yellow">& atrelados</span>
              </h2>

              <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                Grande formato com leitura à distância
              </p>

              <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                Decoração e rotulagem para transporte e logística, desde projetos
                desenvolvidos de raiz até à reprodução e renovação de decorações
                existentes. Pensado para grandes superfícies, durabilidade e
                impacto diário na estrada.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href="/contactos#formulario"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-yellow text-black font-bold px-6 py-3 hover:bg-brand-yellow/90 transition"
                >
                  Pedir orçamento <span className="ml-2">→</span>
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
                <img
                  src="/public-objects/servicos/camioes/hero.webp"
                  alt="Camião e atrelado com decoração aplicada"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dropdowns */}
        <p className="mt-12 md:mt-16 text-sm md:text-base text-gray-400 max-w-4xl">
          Explore os detalhes abaixo para compreender como planeamos e executamos
          decoração de grande formato em camiões e atrelados.
        </p>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Tipos de trabalhos */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">Tipos de trabalhos</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Em grandes formatos o objetivo é simples: leitura clara, identidade
                consistente e um acabamento durável, mesmo com uso intensivo.
              </p>
              <ul className="grid md:grid-cols-2 gap-3 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Atrelados (lona, painel, caixa)
                  </span>
                  <br />
                  Laterais e traseiras, grandes áreas de comunicação e mensagens
                  legíveis à distância.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Cabines e viaturas de serviço
                  </span>
                  <br />
                  Rotulagem, branding e elementos de identificação da empresa.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Frotas e padronização
                  </span>
                  <br />
                  Regras de aplicação consistentes para várias viaturas, com
                  repetição de layouts e medidas.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Renovação / reprodução
                  </span>
                  <br />
                  Recriação a partir de fotos e referências quando o ficheiro
                  original já não existe.
                </li>
              </ul>
            </div>
          </details>

          {/* Criação de raiz vs por referência */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Criação de raiz vs. criação por referência
              </span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Trabalhamos de duas formas, consoante exista ou não base gráfica
                anterior.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Projeto desenvolvido de raiz
                  </span>{" "}
                  – criamos o layout, hierarquia de informação e identidade visual
                  para a sua marca.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Criação por referência
                  </span>{" "}
                  – reconstruímos a decoração a partir de fotos e medidas, mantendo
                  proporções e posicionamentos.
                </li>
                <li>
                  O foco é sempre legibilidade em estrada, consistência de marca e
                  adaptação às superfícies reais.
                </li>
              </ul>
            </div>
          </details>

          {/* Planeamento e aplicação */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">Planeamento e aplicação</span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Em viaturas grandes, o planeamento reduz falhas e acelera a
                execução.
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Definição de superfícies e zonas críticas
                  </span>{" "}
                  – análise de reforços, cantos, recortes, juntas e zonas de maior desgaste.
                </li>

                <li>
                  <span className="font-semibold text-brand-yellow">
                    Composição e pré-visualização
                  </span>{" "}
                  – adaptação do layout à viatura, com desenho à escala e hierarquia de leitura.
                </li>

                <li>
                  <span className="font-semibold text-brand-yellow">
                    Produção no nosso espaço
                  </span>{" "}
                  – impressão e preparação dos materiais com controlo de cor e acabamento.
                </li>

                <li>
                  <span className="font-semibold text-brand-yellow">
                    Aplicação no local do cliente
                  </span>{" "}
                  – aplicação profissional adequada à dimensão do camião ou atrelado.
                </li>
              </ol>
            </div>
          </details>

          {/* Antes / planeamento / depois */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Antes, planeamento e resultado final
              </span>
              <ChevronDown className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Sempre que possível mostramos o trabalho em fases para que o cliente
                veja exatamente o que vai mudar.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    1. Antes
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Registo do camião/atrelado no estado atual e pontos críticos.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto &quot;ANTES&quot; – substituir por imagem real
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    2. Planeamento
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Layout à escala, posicionamento e organização por painéis.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Imagem / vídeo do PLANEAMENTO (Adobe Express)
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    3. Depois
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Resultado final pronto para circular, com impacto e leitura.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto &quot;DEPOIS&quot; – substituir por imagem real
                  </div>
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
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Fotos ajudam muito quando é reprodução.
                  </span>{" "}
                  Enviar vistas laterais, traseira e detalhes de logótipos/textos.
                </li>
                <li>
                  Grandes superfícies exigem alinhamento e juntas bem pensadas. O
                  design deve respeitar portas, reforços e recortes.
                </li>
                <li>
                  Se existirem vinis antigos a remover, avaliamos o estado da cola
                  e da superfície para evitar surpresas na aplicação.
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
