import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Printer, Wallpaper, Image, Sticker, Car, Building, Shield, Zap } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  detailsLink?: string;
}

const services: Service[] = [
  {
    id: "design-grafico",
    title: "Design Gráfico",
    description: "Criação e desenvolvimento de identidade visual completa",
    features: [
      "Desenho vectorial",
      "Maquetes 3D",
      "Imagem corporativa",
      "Logótipos únicos",
      "Tratamento de imagens",
      "Material publicitário"
    ],
    icon: <Palette className="w-8 h-8" />,
    color: "from-[#FFD700] to-[#FFA500]",
    detailsLink: "/servico-design-grafico"
  },
  {
    id: "impressao-digital",
    title: "Impressão Digital",
    description: "Impressão de alta qualidade em diversos materiais como vinil e lona",
    features: [
      "Vinil autocolante e decorativo",
      "Lona publicitária",
      "Impressão em grande formato",
      "Materiais resistentes",
      "Acabamentos profissionais"
    ],
    icon: <Printer className="w-8 h-8" />,
    color: "from-[#20B2AA] to-[#4169E1]",
    detailsLink: "/servico-impressao-digital"
  },
  {
    id: "papel-parede",
    title: "Papel de Parede",
    description: "Catálogo interativo com mais de 3000 texturas em 28 categorias",
    features: [
      "Mais de 3000 texturas",
      "28 categorias diferentes",
      "Visualização em tamanho real",
      "Seleção múltipla",
      "Medidas personalizadas"
    ],
    icon: <Wallpaper className="w-8 h-8" />,
    color: "from-[#FF6347] to-[#FFD700]",
    detailsLink: "/servico-papel-parede"
  },
  {
    id: "telas-artisticas",
    title: "Telas Artísticas",
    description: "Telas canvas personalizadas para decoração e arte",
    features: [
      "Canvas de alta qualidade",
      "Impressão artística",
      "Diversos tamanhos",
      "Molduras incluídas",
      "Resistente ao tempo"
    ],
    icon: <Image className="w-8 h-8" />,
    color: "from-[#9370DB] to-[#FF6347]",
    detailsLink: "/servico-telas-artisticas"
  },
  {
    id: "autocolantes",
    title: "Autocolantes e Etiquetas",
    description: "Autocolantes e etiquetas com corte de contorno personalizado",
    features: [
      "Corte de contorno preciso",
      "Materiais duradouros",
      "Design personalizado",
      "Aplicação fácil",
      "Resistentes a intempéries"
    ],
    icon: <Sticker className="w-8 h-8" />,
    color: "from-[#32CD32] to-[#20B2AA]",
    detailsLink: "/servico-autocolantes"
  },
  {
    id: "decoracao-viaturas",
    title: "Decoração de Viaturas",
    description: "Personalização completa de veículos particulares e comerciais",
    features: [
      "Viaturas particulares",
      "Veículos comerciais",
      "Máquinas de obras",
      "Camiões e pesados",
      "Motociclos",
      "Viaturas de competição"
    ],
    icon: <Car className="w-8 h-8" />,
    color: "from-[#FFD700] to-[#FF6347]",
    detailsLink: "/servico-decoracao-viaturas"
  },
  {
    id: "espacos-comerciais",
    title: "Decoração de Espaços Comerciais",
    description: "Decoração e sinalização para espaços comerciais e empresariais",
    features: [
      "Montras atrativas",
      "Painéis informativos",
      "Reclames luminosos",
      "Bandeiras e totens",
      "Sinalização interior",
      "Fachadas comerciais"
    ],
    icon: <Building className="w-8 h-8" />,
    color: "from-[#4169E1] to-[#9370DB]",
    detailsLink: "/servico-espacos-comerciais"
  },
  {
    id: "peliculas-protecao-solar",
    title: "Películas de Proteção Solar",
    description: "Películas para vidros que proporcionam conforto térmico e proteção UV",
    features: [
      "Proteção UV até 99%",
      "Redução de calor até 78%",
      "Economia de energia",
      "Maior privacidade",
      "Proteção de mobiliário",
      "Conforto térmico"
    ],
    icon: <Shield className="w-8 h-8" />,
    color: "from-[#FFA500] to-[#FFD700]",
    detailsLink: "/servico-peliculas-protecao-solar"
  }
];

export default function Servicos() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      
      {/* Hero Section - Dynamic from backend */}
      <ServiceHero
        serviceId="servicos"
        badge="40 Anos de Experiência"
        badgeIcon={<Zap className="w-4 h-4 mr-2" />}
        title="Nossos Serviços"
        subtitle="Soluções Completas em Comunicação Visual"
        description="Com 40 anos de experiência, oferecemos soluções completas em comunicação visual e publicidade, desde impressão digital até decoração de espaços comerciais."
        backgroundTexture="repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 2px, #2a2a2a 2px, #2a2a2a 4px), repeating-linear-gradient(-45deg, #1a1a1a 0px, #1a1a1a 2px, #2a2a2a 2px, #2a2a2a 4px)"
        backgroundColor="#0a0a0a"
        gradientOverlay="from-black/0 via-transparent to-transparent"
        overlayOpacity="0.0"
        primaryCta={{
          text: "Solicitar Orçamento",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Ver Portfolio",
          href: "/portfolio"
        }}
      />

      {/* Services Grid */}
      <section className="pt-8 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="bg-[#111111] border-[#333] hover:border-[#FFD700] transition-all duration-300 group">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-black flex-shrink-0`}>
                      {service.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-[#FFD700] transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4 leading-relaxed text-sm sm:text-base">
                        {service.description}
                      </p>
                      
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-xs sm:text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full mr-3 flex-shrink-0 mt-2"></div>
                            <span className="break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="bg-brand-yellow text-black font-bold">
                          <Link href="/contactos#formulario">Solicitar Orçamento</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-[#333] text-gray-300 hover:border-[#FFD700] hover:text-[#FFD700]">
                          <Link href={service.detailsLink || "#"}>
                            Ver Mais
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para dar vida ao seu projeto?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Entre em contacto connosco e descubra como podemos transformar as suas ideias em realidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-brand-yellow text-black font-bold">
              <Link href="/contactos#formulario">Iniciar Meu Projeto</Link>
            </Button>
            <Button asChild variant="outline" className="border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-black">
              <Link href="/contactos#formulario">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}