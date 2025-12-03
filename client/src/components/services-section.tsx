import { Palette, Printer, Scissors, Lightbulb, Shield, Car, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    icon: Palette,
    title: "Design Gráfico",
    description: "Criação e desenvolvimento de identidade visual completa",
    link: "/servico-design-grafico"
  },
  {
    icon: Printer,
    title: "Impressão Digital",
    description: "Em vinil, lona, canvas e papel de parede com alta definição e cores vibrantes",
    link: "/servico-impressao-digital"
  },
  {
    icon: Scissors,
    title: "Corte de Vinil",
    description: "Para decoração de espaços e viaturas",
    link: "/servico-autocolantes"
  },
  {
    icon: Lightbulb,
    title: "Reclames Luminosos e Painéis",
    description: "Sinalização interior e exterior profissional para o seu negócio",
    link: "/servico-espacos-comerciais"
  },
  {
    icon: Shield,
    title: "Películas de Proteção Solar",
    description: "Reduzem o calor, protegem dos raios UV e proporcionam privacidade mantendo a luminosidade natural",
    link: "/servico-peliculas-protecao-solar"
  },
  {
    icon: Car,
    title: "Decoração de Viaturas",
    description: "Destacamo-nos em decoração de camiões, máquinas de obras e viaturas de competição",
    link: "/servico-decoracao-viaturas"
  }
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="py-20 bg-black">
      <div className="container mx-auto px-4">

        {/* TÍTULO */}
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-yellow">Nossos Principais</span>{" "}
            <span className="text-white">Serviços</span>
          </h3>

          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Soluções completas em comunicação visual para destacar sua marca no mercado
          </p>
        </div>

        {/* LISTA DE SERVIÇOS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <div className="p-6 bg-[#111] rounded-xl border border-white/10 cursor-pointer transition-transform hover:scale-[1.02]">

                {/* ÍCONE FIXO AMARELO */}
                <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center mb-4">
                  <service.icon className="text-black" size={28} />
                </div>

                {/* TÍTULO */}
                <h4 className="text-xl font-heading font-semibold text-white mb-3">
                  {service.title}
                </h4>

                {/* DESCRIÇÃO */}
                <p className="text-white/70 mb-4">
                  {service.description}
                </p>

                {/* LINK */}
                <div className="text-brand-yellow font-semibold flex items-center gap-2">
                  Ver mais 
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
