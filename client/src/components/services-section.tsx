import { Palette, Printer, Scissors, Lightbulb, Shield, Car, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Palette,
    title: "Design Gráfico",
    description: "Criação e desenvolvimento de identidade visual completa",
    color: "bg-brand-yellow",
    titleColor: "text-brand-yellow",
    link: "/servico-design-grafico"
  },
  {
    icon: Printer,
    title: "Impressão Digital",
    description: "Em vinil, lona, canvas e papel de parede com alta definição e cores vibrantes",
    color: "bg-brand-turquoise",
    titleColor: "text-brand-turquoise",
    link: "/servico-impressao-digital"
  },
  {
    icon: Scissors,
    title: "Corte de Vinil",
    description: "Para decoração de espaços e viaturas",
    color: "bg-brand-red",
    titleColor: "text-brand-red",
    link: "/servico-autocolantes"
  },
  {
    icon: Lightbulb,
    title: "Reclames Luminosos e Painéis",
    description: "Sinalização interior e exterior profissional para o seu negócio",
    color: "bg-brand-red",
    titleColor: "text-brand-red",
    link: "/servico-espacos-comerciais"
  },
  {
    icon: Shield,
    title: "Películas de Proteção Solar",
    description: "Reduzem o calor, protegem dos raios UV e proporcionam privacidade, mantendo a luminosidade natural",
    color: "bg-brand-yellow",
    titleColor: "text-brand-yellow",
    link: "/servico-peliculas-protecao-solar"
  },
  {
    icon: Car,
    title: "Decoração de Viaturas",
    description: "Destacamo-nos em decoração de camiões, máquinas de obras e viaturas de competição",
    color: "bg-brand-turquoise",
    titleColor: "text-brand-turquoise",
    link: "/servico-decoracao-viaturas"
  }
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">Nossos Principais</span> <span className="text-white">Serviços</span>
          </h3>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Soluções completas em comunicação visual para destacar sua marca no mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <div className="gradient-border cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <div className="gradient-border-inner p-6 h-full">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="text-black text-xl" size={24} />
                  </div>
                  <h4 className={`text-lg font-heading font-semibold mb-3 ${service.titleColor}`}>
                    {service.title}
                  </h4>
                  <p className="text-white/80 mb-4">{service.description}</p>

                  <div className="text-brand-turquoise font-semibold text-sm">
                    Ver mais
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
