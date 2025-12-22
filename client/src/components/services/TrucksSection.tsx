        import React from "react";
        import { Truck, ChevronDown } from "lucide-react";
        import { Button } from "@/components/ui/button";
        import { Link } from "wouter";
        import { useQuery } from "@tanstack/react-query";

        /* ====== estilos reutilizáveis (iguais às Máquinas) ====== */

        const item = "border-b border-gray-800 last:border-b-0";

        const summary =
          "flex items-center justify-between w-full py-4 px-4 md:px-6 " +
          "text-sm md:text-base font-semibold text-brand-yellow cursor-pointer " +
          "bg-gray-900/30 hover:bg-gray-900/55 transition-colors " +
          "focus:outline-none list-none";

        const content =
          "px-4 md:px-6 pb-6 pt-4 text-sm text-gray-300 leading-relaxed " +
          "bg-black/40 border-t border-gray-800";

        const chevron =
          "w-5 h-5 text-brand-yellow transition-all duration-300 " +
          "group-open:rotate-180 rounded-full border border-gray-700 " +
          "bg-black/20 p-0.5 group-hover:border-brand-yellow/60 group-hover:bg-black/40";

        interface HeroApiResponse {
          hero: {
            badge?: string;
            title?: string;
            subtitle?: string;
            description?: string;
            backgroundImage?: string;
          } | null;
        }

        /* ======================================================= */

        interface TrucksSectionProps {
          serviceId?: string;
          heroImage?: string;
          heroAlt?: string;
        }

        export function TrucksSection({ 
          serviceId = "decoracao-viaturas-camioes",
          heroImage: propHeroImage = "/public-objects/servicos/decoracao-viaturas/camioes.webp",
          heroAlt = "Decoração de camiões e atrelados DOMREALCE"
        }: TrucksSectionProps) {
          const { data: apiData } = useQuery<HeroApiResponse>({
            queryKey: ["/api/service-heroes", serviceId],
            enabled: !!serviceId,
            staleTime: 0,
            refetchOnMount: true,
          });

          const heroData = apiData?.hero;
          const heroImage = heroData?.backgroundImage || propHeroImage;
          const heroTitle = heroData?.title || "Camiões &";
          const heroSubtitle = heroData?.subtitle || "Grande formato com leitura à distância";
          const heroDescription = heroData?.description || "Rotulagem e decoração para transporte e logística: projetos criados de raiz ou reprodução/renovação de decorações existentes. Pensado para superfícies grandes, durabilidade e impacto visual diário na estrada.";
          return (
            <section className="py-16 bg-black border-t border-gray-900">
              <div className="container mx-auto px-4">

                {/* ===== HERO ===== */}
                <div className="mb-10 md:mb-12">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-black/40 px-3 py-1 text-sm text-brand-yellow">
                    <Truck className="w-4 h-4" />
                    Camiões e atrelados
                  </div>

                  <div className="mt-6 grid lg:grid-cols-2 gap-10 items-center">
                    {/* Texto */}
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-[1.05]">
                        <span className="text-white">{heroTitle}</span>{" "}
                        <span className="text-brand-yellow">atrelados</span>
                      </h2>

                      <p className="mt-5 text-brand-yellow text-xl md:text-2xl font-semibold">
                        {heroSubtitle}
                      </p>

                      <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                        {heroDescription}
                      </p>

                      <div className="mt-7 flex flex-col sm:flex-row gap-3">
                        <Button asChild className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                          <Link href="/contactos#formulario">Pedir orçamento</Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          className="border-gray-700 text-white hover:border-brand-yellow/70 hover:text-brand-yellow"
                        >
                          <Link href="/portfolio">Ver exemplos</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Imagem */}
                    <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/60">
                      <img
                        src={heroImage}
                        alt={heroAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* ===== DROPDOWNS ===== */}
                <p className="mt-12 md:mt-16 text-sm md:text-base text-gray-400 max-w-4xl">
                  Explore os detalhes abaixo para perceber como planeamos e executamos decoração de grande formato.
                </p>

                <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">

                  {/* Tipos de trabalhos */}
                  <details className={`${item} group`}>
                    <summary className={summary}>
                      <span>Tipos de trabalhos</span>
                      <ChevronDown className={chevron} />
                    </summary>

                    <div className={content}>
                      <ul className="grid md:grid-cols-2 gap-3">
                        <li>
                          <span className="font-semibold text-brand-yellow">Camiões rígidos</span><br />
                          Laterais, traseira, portas e detalhes.
                        </li>
                        <li>
                          <span className="font-semibold text-brand-yellow">Semirreboques, atrelados e estruturas especiais</span><br />
                          Cisternas, galeras, contentores, camiões palco e projetos de alteração total de cor.
                        </li>
                        <li>
                          <span className="font-semibold text-brand-yellow">Lonas e painéis</span><br />
                          Elementos removíveis e peças por substituição.
                        </li>
                        <li>
                          <span className="font-semibold text-brand-yellow">Renovação</span><br />
                          Substituição de vinil antigo e atualização de imagem.
                        </li>
                      </ul>
                    </div>
                  </details>

                  {/* Processo técnico */}
                  <details className={`${item} group`}>
                    <summary className={summary}>
                      <span>Processo técnico de trabalho</span>
                      <ChevronDown className={chevron} />
                    </summary>

                    <div className={content}>
                      <ol className="space-y-2 list-decimal list-inside">
                        <li>Definição do objetivo e da mensagem</li>
                        <li>Levantamento fotográfico e técnico</li>
                        <li>Planeamento visual e maquetes</li>
                        <li>Produção e preparação</li>
                        <li>Aplicação controlada</li>
                      </ol>
                    </div>
                  </details>

                  {/* Criação */}
                  <details className={`${item} group`}>
                    <summary className={summary}>
                      <span>Criação de raiz vs. criação por referência</span>
                      <ChevronDown className={chevron} />
                    </summary>

                    <div className={content}>
                      <ul className="space-y-2">
                        <li>Criação de raiz quando é necessário definir imagem e hierarquia.</li>
                        <li>Reprodução ou renovação com base em referências reais.</li>
                        <li>Ajustes sempre pensados para garantir boa leitura à distância.</li>
                      </ul>
                    </div>
                  </details>

                  {/* Antes / Depois */}
                  <details className={`${item} group`}>
                    <summary className={summary}>
                      <span>Antes, planeamento e resultado final</span>
                      <ChevronDown className={chevron} />
                    </summary>

                    <div className={content}>
                      <p>
                        Sempre que possível, o trabalho é apresentado em fases para
                        clarificar todo o processo ao cliente.
                      </p>
                    </div>
                  </details>

                  {/* Notas */}
                  <details className={`${item} group`}>
                    <summary className={summary}>
                      <span>Notas importantes antes de iniciar</span>
                      <ChevronDown className={chevron} />
                    </summary>

                    <div className={content}>
                      <p>
                        O cliente deve confirmar previamente as condições de acesso,
                        espaço disponível, segurança e tempo de paragem da viatura.
                      </p>
                    </div>
                  </details>

                </div>
              </div>
            </section>
          );
        }

        export default TrucksSection;
