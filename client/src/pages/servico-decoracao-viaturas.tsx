import ScrollToTop from "@/components/scroll-to-top";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceGallery from "@/components/service-gallery";
import ServiceHero from "@/components/service-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Car, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Truck,
  Bike,
  Bus,
  Settings,
  Shield,
  Palette
} from "lucide-react";

const defaultImages = [
  {
    src: "/attached_assets/generated_images/Mercedes_Sprinter_wrapped_with_vinyl_wrap_9cccf2a1.png",
    alt: "Mercedes Sprinter com decoração em vinil",
    title: "Decoração de Frotas Comerciais"
  },
  {
    src: "/attached_assets/generated_images/Race_car_with_sponsor_decals_4569063c.png",
    alt: "Viatura de competição com autocolantes de patrocinadores",
    title: "Viaturas de Competição"
  },
  {
    src: "/attached_assets/generated_images/Vehicle_wrap_installation_process_e3a59c09.png",
    alt: "Processo de instalação de vinil",
    title: "Instalação Profissional"
  }
];

export default function ServicoDecoracaoViaturas() {
  useScrollAnimation();
  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ['/api/service-galleries', 'decoracao-viaturas'],
  });
  const galleryImages = galleryData?.images || defaultImages;
  const vehicleTypes = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas Particulares",
      description: "Personalização completa de carros pessoais",
      features: ["Mudança de cor", "Protecção da pintura", "Designs personalizados", "Efeitos especiais"]
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Veículos Comerciais",
      description: "Publicidade móvel para o seu negócio",
      features: ["Branding empresarial", "Informações de contacto", "Promoções", "Logótipos"]
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas de Competição",
      description: "Decoração para desportos motorizados",
      features: ["Patrocinadores", "Numeração", "Designs aerodinâmicos", "Materiais especiais"]
    },
    {
      icon: <Bus className="w-8 h-8" />,
      title: "Camiões e Pesados",
      description: "Decoração para veículos de grande porte",
      features: ["Publicidade de grande impacto", "Identificação de frota", "Regulamentações", "Visibilidade"]
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Motociclos",
      description: "Personalização para motocicletas",
      features: ["Designs únicos", "Protecção do tanque", "Detalhes cromados", "Efeitos especiais"]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Máquinas de Obras",
      description: "Identificação e personalização de equipamentos",
      features: ["Numeração", "Logótipos da empresa", "Informações de segurança", "Cores corporativas"]
    }
  ];

  const materials = [
    {
      name: "Vinil Cast Premium",
      description: "Material de conformação superior para curvas complexas",
      durability: "7-10 anos",
      applications: ["Wrapping completo", "Mudança de cor", "Protecção"]
    },
    {
      name: "Vinil Promocional", 
      description: "Económico para aplicações de média duração",
      durability: "3-5 anos",
      applications: ["Publicidade", "Rotulação", "Detalhes"]
    },
    {
      name: "PPF (Paint Protection Film)",
      description: "Película transparente de protecção da pintura",
      durability: "10+ anos",
      applications: ["Protecção frontal", "Portas", "Espelhos"]
    },
    {
      name: "Vinil de Texturas",
      description: "Texturas realistas para decoração de viaturas",
      durability: "5-7 anos",
      applications: ["Detalhes interiores", "Spoilers", "Capôs"]
    }
  ];

  const services = [
    {
      title: "Wrapping Completo",
      description: "Mudança completa da cor ou aplicação de design em toda a viatura",
      benefits: ["Protege a pintura original", "Reversível", "Infinitas opções de cor", "Valor de revenda mantido"]
    },
    {
      title: "Wrapping Parcial",
      description: "Decoração de áreas específicas da viatura",
      benefits: ["Custo reduzido", "Impacto visual", "Fácil manutenção", "Flexibilidade de design"]
    },
    {
      title: "Rotulação Publicitária",
      description: "Aplicação de logótipos e informações comerciais",
      benefits: ["Publicidade móvel", "Profissionalismo", "Alcance geográfico", "Custo-benefício"]
    },
    {
      title: "Película de Proteção",
      description: "Aplicação de película protetora transparente",
      benefits: ["Protege de riscos", "Invisível", "Auto-regeneração", "Longa duração"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consulta e Medição",
      description: "Avaliação da viatura e definição do projeto personalizado"
    },
    {
      step: "02", 
      title: "Design e Aprovação",
      description: "Criação do design e visualização 3D do resultado final"
    },
    {
      step: "03",
      title: "Preparação da Viatura", 
      description: "Limpeza profunda e preparação das superfícies"
    },
    {
      step: "04",
      title: "Aplicação Especializada",
      description: "Instalação por técnicos certificados com ferramentas profissionais"
    },
    {
      step: "05",
      title: "Controlo de Qualidade",
      description: "Inspeção final e orientações de manutenção"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      
      {/* Hero Section - Dynamic from backend */}
      <ServiceHero
        serviceId="decoracao-viaturas"
        badge="Decoração de Viaturas"
        badgeIcon={<Car className="w-4 h-4 mr-2" />}
        title="Transforme a Sua Viatura"
        subtitle="numa Obra de Arte"
        description="Especialistas em car wrapping e decoração de viaturas. Desde mudanças de cor completas até publicidade móvel para o seu negócio. Qualidade profissional garantida."
        overlayOpacity="0"
        primaryCta={{
          text: "Transformar Minha Viatura",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Contactar",
          href: "/contactos#formulario"
        }}
      />

      {/* Vehicle Types Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-orange-400">Tipos de</span> <span className="text-white">Veículos</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Especializados em todos os tipos de veículos, desde carros particulares até frotas comerciais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-orange-400 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-orange-400 mb-4">
                    {vehicle.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{vehicle.title}</h3>
                  <p className="text-gray-400 mb-4">{vehicle.description}</p>
                  <div className="space-y-2">
                    {vehicle.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ServiceGallery
        title="Galeria de Trabalhos"
        description="Veja alguns dos nossos projetos de decoração de viaturas"
        images={galleryImages}
      />

      {/* Services Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Nossos</span> <span className="text-brand-coral">Serviços</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Soluções completas para transformar e proteger a sua viatura
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-coral">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Benefícios:</span>
                    <div className="space-y-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-coral flex-shrink-0" />
                          <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Materials Section */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Materiais</span> <span className="text-brand-yellow">Premium</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Utilizamos apenas materiais de marcas reconhecidas mundialmente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {materials.map((material, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">{material.name}</h3>
                  <p className="text-gray-400 mb-4">{material.description}</p>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Durabilidade:</span>
                    <span className="text-orange-400 font-semibold ml-2">{material.durability}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Aplicações:</span>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app, appIndex) => (
                        <Badge key={appIndex} variant="outline" className="border-orange-400 text-orange-400">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo</span> <span className="text-orange-400">Profissional</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia comprovada que garante resultados excecionais e duradouros
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-full flex border-2 border-white items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="w-px h-8 bg-gray-700 ml-8 mt-4"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section data-scroll className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-orange-400">Garantia e</span> <span className="text-white">Qualidade</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Todos os nossos trabalhos incluem garantia contra defeitos de aplicação 
                  e utilizamos apenas materiais certificados pelos fabricantes.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-white">Garantia de aplicação: 2 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-white">Materiais certificados Hexis, Oracal e Mactac</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-white">Técnicos certificados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-white">Seguro de responsabilidade civil</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-white">Suporte pós-venda</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Excelência Comprovada</h3>
                  <p className="text-gray-400">
                    40 anos de experiência em decoração de viaturas
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Viaturas decoradas</span>
                    <span className="text-orange-400 font-semibold">1000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-orange-400 font-semibold">2-5 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Satisfação</span>
                    <span className="text-orange-400 font-semibold">99%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-orange-400 font-semibold">2 anos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Transformar a Sua</span> <span className="text-orange-400">Viatura?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco e descubra como podemos dar uma nova vida 
            à sua viatura com qualidade e profissionalismo únicos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-brand-yellow text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Solicitar Orçamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20decoração%20de%20viaturas." target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
}