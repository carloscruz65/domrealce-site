import React from "react";
import { ChevronDown } from "lucide-react";

const item =
  "border-b border-gray-800 last:border-b-0";

const summary =
  "flex items-center justify-between w-full py-3 px-4 md:px-6 text-sm md:text-base font-semibold text-brand-yellow cursor-pointer";

const content =
  "pb-4 px-4 md:px-6 text-sm text-gray-300 leading-relaxed";

export function MachinesSection() {
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

          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
            {/* Texto */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                <span className="text-white">Máquinas industriais</span>{" "}
                <span className="text-brand-yellow">& equipamentos pesados</span>
              </h2>

              <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                Identificação técnica e decoração funcional
              </p>

              <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                Planeamento técnico e decoração funcional para máquinas de construção,
                elevação e logística, com base no modelo real da máquina e no trabalho
                que faz todos os dias.
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
                {/* Troca para a tua imagem real */}
                <img
                  src="/public-objects/servicos/maquinas/hero.webp"
                  alt="Máquina industrial com decoração finalizada"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>



        {/* Dropdowns em cartão único */}
        <p className="mt-12 md:mt-16 text-sm md:text-base text-gray-400 max-w-4xl">
          Explore os detalhes técnicos abaixo para compreender o nosso método de trabalho em máquinas industriais.
        </p>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Tipos de máquinas */}
          <details className={`${item} group`}>
            <summary className={summary}>
              <span className="text-brand-yellow">
                Tipos de máquinas que trabalhamos
              </span>
              <ChevronDown
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Em máquinas industriais, a intervenção é sobretudo técnica: reproduzimos vinis existentes ou reconstruímos a identificação original na ausência de referências, garantindo proporções corretas, leitura funcional e compatibilidade com a máquina.
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
                  Gruas, estações elevatórias e
                  equipamentos de acesso.
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
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                O objetivo é reduzir improvisos, evitar surpresas e garantir
                um resultado consistente em cada máquina.
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
                  planear à escala.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Planeamento em estúdio
                  </span>{" "}
                  – desenho técnico e organização dos autocolantes por zonas, respeitando dimensões e posicionamento original.
                </li>
                <li>
                  <span className="font-semibold text-brand-yellow">
                    Produção e aplicação controlada
                  </span>{" "}
                  – impressão no nosso espaço e aplicação realizada no local do cliente.
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
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Ao longo dos anos foi criada uma base técnica de modelos de
                máquinas, que permite acelerar o trabalho sem perder rigor.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  Muitos modelos comuns já têm esquemas e planos de
                  autocolantes preparados, o que reduz o tempo de resposta.
                </li>
                <li>
                  Quando surge um modelo novo, o levantamento passa a fazer
                  parte dessa biblioteca para futuros projetos.
                </li>
                <li>
                  O foco está sempre em proporções corretas, leitura
                  funcional e compatibilidade com a realidade da máquina.
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
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Sempre que possível, mostramos o projeto em três fases para
                que o cliente perceba exatamente o que está a ser feito.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {/* Antes */}
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    1. Máquina no estado atual
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Registo da máquina tal como está, com vinis antigos,
                    desgaste e alterações anteriores.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto &quot;ANTES&quot; – substituir por imagem real
                  </div>
                </div>

                {/* Planeamento */}
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    2. Desenho técnico e plano
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Esquemas com posicionamento, medidas à escala e
                    distribuição dos autocolantes por zonas.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Imagem / vídeo do PLANEAMENTO (Adobe Express)
                  </div>
                </div>

                {/* Depois */}
                <div className="rounded-xl border border-gray-800 bg-black/70 p-3">
                  <h4 className="text-sm font-semibold text-brand-yellow mb-1">
                    3. Máquina pronta para trabalhar
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    Resultado final com a decoração aplicada e pronta para o
                    dia a dia de obra ou armazém.
                  </p>
                  <div className="aspect-video rounded-lg border border-gray-800 bg-gray-900/70 flex items-center justify-center text-[11px] text-gray-400">
                    Foto &quot;DEPOIS&quot; – substituir por imagem real
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
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
            </summary>

            <div className={content}>
              <p className="mb-3">
                Trabalhamos com máquinas de várias marcas reconhecidas na
                construção e indústria.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  Volvo
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  Komatsu
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  Haulotte
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  JCB
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  CAT
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  Manitou
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
                  Toyota (empilhadores)
                </div>
                <div className="rounded-md border border-gray-800 bg-black/80 px-3 py-2 text-center">
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
              <ChevronDown
                className="w-5 h-5 text-brand-yellow transition-transform duration-300 group-open:rotate-180"
              />
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
                  Os autocolantes existentes servem de referência para
                  dimensões e posicionamento.
                </li>
                <li>
                  A máquina deve estar acessível para medição, fotografia e
                  análise das zonas de aplicação.
                </li>
                <li>
                  Alterações feitas à máquina depois do levantamento podem
                  obrigar a ajustes no projeto e nos materiais.
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
