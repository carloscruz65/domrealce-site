import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Truck } from "lucide-react";
import { Link } from "wouter";
import {
  detailPanel,
  detailItem,
  detailSummary,
  detailContent,
} from "@/components/services/serviceDetailStyles";

export function TrucksSection() {
  return (
    <section className="py-16 bg-black border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Texto */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 text-sm text-gray-200 mb-5">
              <Truck className="w-4 h-4 text-brand-yellow" />
              <span className="text-brand-yellow font-semibold">Camiões e atrelados</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
              <span className="text-white">Camiões &</span>{" "}
              <span className="text-brand-yellow">atrelados</span>
            </h2>

            <p className="mt-3 text-xl font-semibold text-brand-yellow">
              Grande formato com leitura à distância
            </p>

            <p className="mt-5 text-gray-300 leading-relaxed max-w-xl">
              Rotulagem e decoração para transporte e logística: projetos criados de raiz ou
              reprodução/renovação de decorações existentes. Pensado para superfícies grandes,
              durabilidade e impacto visual diário na estrada.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                <Link href="/contactos#formulario">Pedir orçamento</Link>
              </Button>

              <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-900">
                <Link href="/portfolio">Ver exemplos</Link>
              </Button>
            </div>

            <p className="mt-10 text-sm text-gray-400">
              Explore os detalhes abaixo para perceber como planeamos e executamos decoração de grande formato.
            </p>

            <div className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tipos">
                  <AccordionTrigger className="text-left">
                    Tipos de trabalhos
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed">
                    Laterais, traseiras, portas, lonas, painéis e conjuntos completos (conforme o veículo e as superfícies).
                    Ajustamos sempre a leitura a distância e o contexto real (estrada, estaleiro, logística).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="referencia">
                  <AccordionTrigger className="text-left">
                    Criação de raiz vs. criação por referência
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed">
                    Podemos criar um layout novo ou reproduzir uma decoração existente com base em fotos e medidas,
                    mantendo coerência de marca e proporções corretas no veículo real.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planeamento">
                  <AccordionTrigger className="text-left">
                    Planeamento e aplicação
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed">
                    Produção no nosso espaço com controlo de qualidade e aplicação conforme o cenário.
                    Em grande formato, muitas vezes faz sentido aplicar no local do cliente (quando o veículo não pode parar).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="antesdepois">
                  <AccordionTrigger className="text-left">
                    Antes, planeamento e resultado final
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed">
                    Quando possível, organizamos o trabalho em etapas (levantamento, design, aprovação, produção, aplicação),
                    para reduzir paragens e garantir um resultado limpo e durável.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notas">
                  <AccordionTrigger className="text-left">
                    Notas importantes antes de iniciar
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed">
                    Se existir vinil antigo, idealmente não remover antes do levantamento.
                    Isso ajuda-nos a medir e planear corretamente, evitando surpresas na aplicação.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Bloco “imagem” / placeholder */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl min-h-[320px] lg:min-h-[420px] flex items-center justify-center">
            <div className="text-center px-6">
              <div className="text-brand-yellow font-semibold mb-2">Imagem / exemplo</div>
              <p className="text-gray-400 text-sm">
                Aqui podemos colocar uma foto real (ou um mockup) de camião/atrelado com decoração DOMREALCE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// (opcional) para evitar chatices de import no futuro
export default TrucksSection;
