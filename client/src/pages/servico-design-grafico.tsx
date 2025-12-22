import React from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Palette,
  CheckCircle,
  Star,
  ArrowRight,
  Target,
  Layers,
  Eye,
  Monitor,
  FileImage,
  Play,
} from "lucide-react";

/* ======================================================
   Card Accordion
====================================================== */

type DesignCard = {
  key: string;
  icon: React.ReactNode;
  title: string;
  intro?: string;
  content: string[];
};

function CardAccordion({
  isOpen,
  onToggle,
  icon,
  title,
  intro,
  content,
}: {
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  intro?: string;
  content: string[];
}) {
  return (
    <Card
      className={`h-full bg-black border transition-all duration-300 ${
        isOpen
          ? "border-brand-yellow"
          : "border-gray-800 hover:border-brand-yellow"
      }`}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* HEADER */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="text-left w-full cursor-pointer group focus:outline-none"
        >
          <div className="flex items-start justify-between gap-4 rounded-xl p-2 -m-2 group-hover:bg-white/5 transition-colors">
            <div>
              <div className="text-brand-yellow mb-4">{icon}</div>

              <h3 className="text-xl font-semibold text-white">{title}</h3>

              {intro && (
                <p className="mt-2 text-gray-400 text-sm">{intro}</p>
              )}
            </div>

            {/* TRIÂNGULO */}
            <Play
              className={`w-5 h-5 text-brand-yellow transition-transform duration-300 ${
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
            isOpen ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0",
          ].join(" ")}
        >
          <div className="pt-4 border-t border-white/5">
            <ul className="space-y-3 text-sm text-gray-300">
              {content.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-brand-yellow">•</span>
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-auto" />
      </CardContent>
    </Card>
  );
}

/* ======================================================
   Página
====================================================== */

export default function ServicoDesignGrafico() {
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  function toggleCard(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  const designCards: DesignCard[] = [
    {
      key: "marca",
      icon: <Palette className="w-6 h-6" />,
      title: "Aplicação e Desenvolvimento Visual da Marca",
      intro: "Coerência visual pronta para produção.",
      content: [
        "Preparação e adaptação de elementos gráficos para viaturas, montras, interiores e materiais impressos.",
        "Garantia de coerência visual, qualidade técnica e preparação correta para produção.",
      ],
    },
    {
      key: "vectorial",
      icon: <Layers className="w-6 h-6" />,
      title: "Design Vectorial",
      intro: "Ficheiros limpos, escaláveis e profissionais.",
      content: [
        "Produção de gráficos vetoriais preparados para impressão digital e vinil de recorte.",
        "Trabalho em Adobe Illustrator para máxima fidelidade e qualidade.",
      ],
    },
    {
      key: "maquetes",
      icon: <Eye className="w-6 h-6" />,
      title: "Maquetes",
      intro: "Visualização realista antes da produção.",
      content: [
        "Criação de maquetes realistas para antecipar o resultado final.",
        "Permite ao cliente validar o projeto antes da produção e instalação.",
      ],
    },
    {
      key: "publicitario",
      icon: <FileImage className="w-6 h-6" />,
      title: "Material Publicitário",
      intro: "Comunicação visual em todos os formatos.",
      content: [
        "Criação de material promocional e identidade visual para múltiplos suportes.",
      ],
    },
    {
      key: "digital",
      icon: <Monitor className="w-6 h-6" />,
      title: "Design Digital",
      intro: "Presença visual no digital.",
      content: ["Layouts para páginas web e plataformas digitais."],
    },
    {
      key: "estrategia",
      icon: <Target className="w-6 h-6" />,
      title: "Estratégia Visual",
      intro: "Design alinhado com objetivos.",
      content: [
        "Alinhamento da comunicação visual com a mensagem e objetivos do negócio.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        serviceId="design-grafico"
        badge="Design Gráfico Profissional"
        badgeIcon={<Palette className="w-4 h-4" />}
        title="Identidade Visual que marca a diferença"
        subtitle="Design que comunica"
        description="Criamos identidades visuais sólidas, coerentes e preparadas para aplicação real."
        imageSrc="/public-objects/servicos/design-grafico.webp"
        imageAlt="Design Gráfico DOMREALCE"
      />

      <main>
        <section className="pt-10 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-brand-yellow">Serviços</span>{" "}
                <span className="text-white">Incluídos</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {designCards.map((item) => (
                <CardAccordion
                  key={item.key}
                  isOpen={openKey === item.key}
                  onToggle={() => toggleCard(item.key)}
                  icon={item.icon}
                  title={item.title}
                  intro={item.intro}
                  content={item.content}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
