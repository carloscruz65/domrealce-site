import React from "react";
import ServiceCardAccordion, {
  ServiceAccordionCard,
} from "@/components/services/ServiceCardAccordion";

type Props = {
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  cards: ServiceAccordionCard[];
  defaultOpenKey?: string | null;
};

export default function ServiceCardsSection({
  titleTop = "Serviços",
  titleBottom = "Incluídos",
  subtitle,
  cards,
  defaultOpenKey = null,
}: Props) {
  const [openKey, setOpenKey] = React.useState<string | null>(defaultOpenKey);

  function toggleCard(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <section className="pt-8 pb-16 bg-gray-900/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">{titleTop}</span>{" "}
            <span className="text-white">{titleBottom}</span>
          </h2>

          {subtitle ? (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
          ) : null}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {cards.map((item) => (
            <ServiceCardAccordion
              key={item.key}
              isOpen={openKey === item.key}
              onToggle={() => toggleCard(item.key)}
              icon={item.icon}
              title={item.title}
              intro={item.intro}
              content={item.content}
              body={item.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
