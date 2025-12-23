import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Play } from "lucide-react";

type ServiceItem = {
  title: string;
  description: string;
  benefits: string[];
};

type Props = {
  title?: string;
  subtitle?: string;
  services: ServiceItem[];
  className?: string;

  // Mobile: ao abrir um, esconde os outros (menos confuso)
  focusModeOnMobile?: boolean;

  // Desktop: ao abrir um, ocupa a linha toda (evita “mistura” em 2 colunas)
  fullWidthOpenOnDesktop?: boolean;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return isMobile;
}

export default function ServicesAvailableSection({
  title = "Serviços disponíveis",
  subtitle = "Soluções para comunicação visual, rotulagem e acabamentos.",
  services,
  className = "",
  focusModeOnMobile = true,
  fullWidthOpenOnDesktop = true,
}: Props) {
  const isMobile = useIsMobile();
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  function toggleCard(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  const visibleServices =
    focusModeOnMobile && isMobile && openKey
      ? services.filter((s) => s.title === openKey)
      : services;

  return (
    <section className={`pt-8 pb-16 bg-black border-t border-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-white">Serviços</span>{" "}
            <span className="text-brand-yellow">disponíveis</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {visibleServices.map((service, index) => {
            const key = service.title; // chave estável (título)
            const isOpen = openKey === key;

            // ✅ FIX PRINCIPAL:
            // No desktop, quando abre, ocupa as 2 colunas e começa sempre na coluna 1
            // (evita o bug visual quando o cartão aberto estava na coluna da direita)
            const wrapperClass =
              fullWidthOpenOnDesktop && isOpen && !isMobile
                ? "md:col-start-1 md:col-span-2"
                : "";

            return (
              <div key={`${key}-${index}`} className={wrapperClass}>
                <Card
                  className={`h-full bg-gray-900/60 border transition-all duration-300 ${
                    isOpen
                      ? "border-brand-yellow"
                      : "border-gray-800 hover:border-brand-yellow"
                  }`}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* HEADER */}
                    <button
                      type="button"
                      onClick={() => toggleCard(key)}
                      aria-expanded={isOpen}
                      className="text-left w-full cursor-pointer group focus:outline-none"
                    >
                      <div className="flex items-start justify-between gap-4 rounded-xl p-2 -m-2 group-hover:bg-white/5 transition-colors">
                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold mb-2 text-brand-yellow">
                            {service.title}
                          </h3>
                          <p className="text-gray-400">{service.description}</p>
                        </div>

                        <Play
                          className={`w-5 h-5 text-brand-yellow transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? "rotate-90" : "rotate-0"
                          }`}
                          fill="currentColor"
                        />
                      </div>
                    </button>

                    {/* BODY */}
                    <div
                      className={[
                        "overflow-hidden transition-all duration-300 ease-out",
                        isOpen
                          ? "max-h-[900px] opacity-100 mt-5"
                          : "max-h-0 opacity-0 mt-0",
                      ].join(" ")}
                    >
                      <div className="pt-4 border-t border-white/5">
                        <span className="text-sm text-gray-500 mb-3 block">
                          Benefícios:
                        </span>

                        <div className="space-y-2">
                          {service.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                              <span className="text-sm text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        {/* Botão Fechar ajuda no desktop */}
                        {!isMobile ? (
                          <div className="pt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleCard(key)}
                              className="text-xs text-brand-yellow hover:text-brand-yellow/80 underline"
                            >
                              Fechar
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-auto" />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* “Voltar” no mobile quando está em modo foco */}
        {focusModeOnMobile && isMobile && openKey ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setOpenKey(null)}
              className="text-sm text-brand-yellow hover:text-brand-yellow/80 underline"
            >
              Ver todos os serviços
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}