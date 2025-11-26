import { Palette, Printer, Scissors, Lightbulb, Shield, Car, Sparkles, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Palette,
    title: "Design Gráfico",
    description: "Criação e desenvolvimento de identidade visual completa",
    color: "from-brand-yellow to-brand-coral",
    titleColor: "text-brand-yellow",
    link: "/servico-design-grafico"
  },
  {
    icon: Printer,
    title: "Impressão Digital",
    description: "Em vinil, lona, canvas e papel de parede com alta definição e cores vibrantes",
    color: "from-brand-turquoise to-brand-blue",
    titleColor: "text-brand-turquoise",
    link: "/servico-impressao-digital"
  },
  {
    icon: Scissors,
    title: "Corte de Vinil",
    description: "Para decoração de espaços e viaturas",
    color: "from-brand-blue to-brand-coral",
    titleColor: "text-brand-blue",
    link: "/servico-autocolantes"
  },
  {
    icon: Lightbulb,
    title: "Reclames Luminosos e Painéis",
    description: "Sinalização interior e exterior profissional para o seu negócio",
    color: "from-brand-coral to-brand-yellow",
    titleColor: "text-brand-coral",
    link: "/servico-espacos-comerciais"
  },
  {
    icon: Shield,
    title: "Películas de Proteção Solar",
    description: "Reduzem o calor, protegem dos raios UV e proporcionam privacidade, mantendo a luminosidade natural",
    color: "from-brand-yellow to-brand-turquoise",
    titleColor: "text-brand-yellow",
    link: "/servico-peliculas-protecao-solar"
  },
  {
    icon: Car,
    title: "Decoração de Viaturas",
    description: "Destacamo-nos em decoração de camiões, máquinas de obras e viaturas de competição",
    color: "from-brand-turquoise to-brand-coral",
    titleColor: "text-brand-turquoise",
    link: "/servico-decoracao-viaturas"
  }
];

export default function ServicesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section ref={sectionRef} id="servicos" className="py-20 bg-black scroll-animate">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate-left">
          <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-yellow animate-pulse-brand">Nossos Principais</span> <span className="text-white">Serviços</span>
          </h3>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Soluções completas em comunicação visual para destacar sua marca no mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isHovered = hoveredCard === index;
            const rotateX = isHovered ? (mousePosition.y - 0.5) * 20 : 0;
            const rotateY = isHovered ? (mousePosition.x - 0.5) * 20 : 0;
            
            return (
              <Link href={service.link} key={index}>
                <div 
                  className="gradient-border mouse-track transform-3d scroll-animate cursor-pointer"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="gradient-border-inner p-6 h-full relative overflow-hidden">
                    {/* Floating background effect */}
                    <div 
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, var(--brand-yellow) 0%, transparent 50%)`,
                        transform: isHovered ? 'scale(1.2)' : 'scale(0.8)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mb-4 ${isHovered ? 'animate-bounce-subtle' : ''}`}>
                      <service.icon className="text-black text-2xl" size={24} />
                    </div>
                    <h4 className={`text-xl font-heading font-semibold mb-3 ${service.titleColor} ${isHovered ? 'animate-glow' : ''}`}>
                      {service.title}
                    </h4>
                    <p className="text-white/80 mb-4">{service.description}</p>
                    
                    <div className="text-brand-turquoise hover:text-brand-turquoise font-semibold transition-colors hover-lift group">
                      Ver mais <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline" size={16} />
                    </div>
                    
                    {/* Hover accent */}
                    {isHovered && (
                      <div className="absolute top-2 right-2 text-brand-coral animate-float">
                        <Sparkles size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
