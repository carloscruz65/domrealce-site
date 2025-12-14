import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

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
};

export default function ServicesAvailableSection({
  title = "Serviços disponíveis",
  subtitle = "Soluções para comunicação visual, rotulagem e acabamentos.",
  services,
  className = "",
}: Props) {
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

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-4">{service.description}</p>

                <span className="text-sm text-gray-500 mb-2 block">Benefícios:</span>
                <div className="space-y-2">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
