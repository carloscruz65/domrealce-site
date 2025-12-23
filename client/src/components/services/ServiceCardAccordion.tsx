import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export type ServiceAccordionCard = {
  key: string;
  icon: React.ReactNode;
  title: string;
  intro?: string;
  content?: string[];
  body?: React.ReactNode;
};

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  intro?: string;
  content?: string[];
  body?: React.ReactNode;
};

export default function ServiceCardAccordion({
  isOpen,
  onToggle,
  icon,
  title,
  intro,
  content,
  body,
}: Props) {
  return (
    <Card
      className={`h-full bg-black border transition-all duration-300 ${
        isOpen
          ? "border-brand-yellow"
          : "border-gray-800 hover:border-brand-yellow"
      }`}
    >
      <CardContent className="p-6 h-full flex flex-col">
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

              {intro && <p className="mt-2 text-gray-400 text-sm">{intro}</p>}
            </div>

            <Play
              className={`w-5 h-5 text-brand-yellow transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
              fill="currentColor"
            />
          </div>
        </button>

        <div
          className={[
            "overflow-hidden transition-all duration-300 ease-out",
            isOpen
              ? "max-h-[900px] opacity-100 mt-5"
              : "max-h-0 opacity-0 mt-0",
          ].join(" ")}
        >
          <div className="pt-4 border-t border-white/5">
            {body ? (
              <div className="text-sm text-gray-300 leading-relaxed">
                {body}
              </div>
            ) : content?.length ? (
              <ul className="space-y-3 text-sm text-gray-300">
                {content.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-yellow">•</span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Conteúdo em breve.</p>
            )}
          </div>
        </div>

        <div className="mt-auto" />
      </CardContent>
    </Card>
  );
}
