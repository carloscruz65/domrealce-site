import ScrollToTop from "@/components/scroll-to-top";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import ServiceGallery from "@/components/service-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Building, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Store,
  Lightbulb,
  Flag,
  Info,
  Eye,
  Zap
} from "lucide-react";

export default function ServicoEspacosComerciais() {
  useScrollAnimation();
  const services = [
    {
      icon: <Store className="w-8 h-8" />,
      title: "Montras Atrativas",
      description: "Vitrines que chamam a atenção e convertem visitantes em clientes",
      features: ["Displays promocionais", "Sinalização de ofertas", "Branding visual", "Iluminação LED"]
    },
    {
      icon: <Info className="w-8 h-8" />,
      title: "Painéis Informativos",
      description: "Comunicação clara e profissional para os seus clientes",
      features: ["Horários", "Serviços", "Preçários", "Direções"]
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Reclames Luminosos",
      description: "Sinalização LED que destaca o seu negócio dia e noite",
      features: ["LED eficiente", "Controlo remoto", "Programação", "Baixo consumo"]
    },
    {
      icon: <Flag className="w-8 h-8" />,
      title: "Bandeiras e Totens",
      description: "Sinalização vertical para máxima visibilidade",
      features: ["Resistentes ao vento", "Bases estáveis", "Fácil montagem", "Designs personalizados"]
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Sinalização Interior",
      description: "Orientação e informação dentro do estabelecimento",
      features: ["Direcionais", "Setorização", "Segurança", "Acessibilidade"]
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Fachadas Comerciais",
      description: "Transformação completa da frente do estabelecimento",
      features: ["Identidade visual", "Materiais duráveis", "Iluminação", "Impacto visual"]
    }
  ];

  const sectors = [
    {
      name: "Restauração",
      description: "Menus, promoções e sinalização gastronómica",
      solutions: ["Menus exteriores", "Displays de pratos", "Sinalização de terraços", "Reclames luminosos"]
    },
    {
      name: "Retalho",
      description: "Montras e sinalização para lojas",
      solutions: ["Vitrines promocionais", "Etiquetas de preços", "Sinalização de liquidações", "Branding"]
    },
    {
      name: "Serviços",
      description: "Sinalização profissional para empresas de serviços",
      solutions: ["Placas de identificação", "Horários", "Informações de contacto", "Certificações"]
    },
    {
      name: "Hotéis",
      description: "Sinalização elegante para hospitalidade",
      solutions: ["Receção", "Direcionais", "Numeração de quartos", "Áreas comuns"]
    },
    {
      name: "Escritórios",
      description: "Ambiente profissional e corporativo",
      solutions: ["Logótipos corporativos", "Direcionais", "Salas de reuniões", "Recepções"]
    },
    {
      name: "Clínicas",
      description: "Sinalização para áreas de saúde",
      solutions: ["Especialidades", "Horários", "Direcionais", "Informações médicas"]
    }
  ];

  const materials = [
    {
      name: "ACM (Alumínio Composto)",
      description: "Material premium para fachadas e painéis exteriores",
      benefits: ["Resistente a intempéries", "Acabamento profissional", "Longo prazo", "Fácil manutenção"]
    },
    {
      name: "Acrílico",
      description: "Versatilidade e elegância para interiores",
      benefits: ["Transparência cristalina", "Fácil limpeza", "Resistente a UV", "Múltiplas cores"]
    },
    {
      name: "PVC Expandido",
      description: "Solução económica e eficaz",
      benefits: ["Leve e resistente", "Fácil instalação", "Boa relação qualidade-preço", "Versátil"]
    },
    {
      name: "LED",
      description: "Iluminação eficiente e moderna",
      benefits: ["Baixo consumo", "Longa duração", "Múltiplas cores", "Programável"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Análise do Espaço",
      description: "Visita ao local para avaliar necessidades e oportunidades"
    },
    {
      step: "02", 
      title: "Proposta Personalizada",
      description: "Desenvolvimento de soluções adequadas ao seu negócio"
    },
    {
      step: "03",
      title: "Design e Aprovação", 
      description: "Criação de mockups e visualizações 3D do projeto"
    },
    {
      step: "04",
      title: "Produção e Instalação",
      description: "Fabrico dos elementos e montagem profissional"
    },
    {
      step: "05",
      title: "Manutenção e Suporte",
      description: "Assistência técnica e manutenção preventiva"
    }
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      alt: "Loja com sinalização moderna",
      title: "Sinalização Comercial"
    },
    {
      src: "https://images.unsplash.com/photo-1567016546367-3bf8c0e89d41?w=800&q=80",
      alt: "Montra de loja atrativa",
      title: "Montras Criativas"
    },
    {
      src: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80",
      alt: "Espaço comercial moderno",
      title: "Ambientes Profissionais"
    },
    {
      src: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80",
      alt: "Reclame luminoso de loja",
      title: "Reclames LED"
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
      alt: "Interior de loja com branding",
      title: "Branding Interior"
    },
    {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
      alt: "Fachada comercial decorada",
      title: "Fachadas Profissionais"
    }
  ];

  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ['/api/service-galleries', 'espacos-comerciais'],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      
      <ServiceHero
        serviceId="espacos-comerciais"
        badge="Espaços Comerciais Premium"
        badgeIcon={<Building className="w-4 h-4 mr-2" />}
        title="Transforme o Seu"
        subtitle="Espaço Comercial"
        description="Soluções completas de sinalização e decoração para espaços comerciais. Desde montras atrativas até reclames luminosos que destacam o seu negócio."
        overlayOpacity="0"
        primaryCta={{
          text: "Transformar Meu Espaço",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Contactar",
          href: "/contactos#formulario"
        }}
      />

      {/* Services Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-blue-400">Soluções</span> <span className="text-white">Completas</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tudo o que precisa para criar um espaço comercial que impressiona e converte
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333] hover:border-blue-400 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
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

      <ServiceGallery images={galleryImages} />

      {/* Sectors Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Setores</span> <span className="text-brand-coral">Especializados</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experiência comprovada em diversos setores comerciais e empresariais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-coral">{sector.name}</h3>
                  <p className="text-gray-400 mb-4">{sector.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Soluções típicas:</span>
                    <div className="space-y-2">
                      {sector.solutions.map((solution, solutionIndex) => (
                        <div key={solutionIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-coral flex-shrink-0" />
                          <span className="text-sm text-gray-300">{solution}</span>
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
      <section className="pt-8 pb-8 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Materiais</span> <span className="text-brand-yellow">Premium</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Selecionamos materiais de qualidade superior para garantir durabilidade e impacto visual
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {materials.map((material, index) => (
              <Card key={index} className="bg-[#0a0a0a] border-[#333] hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">{material.name}</h3>
                  <p className="text-gray-400 mb-4">{material.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Benefícios:</span>
                    <div className="space-y-2">
                      {material.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
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

      {/* Process Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Nosso</span> <span className="text-blue-400">Processo</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia testada que garante resultados que superam expectativas
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-brand-turquoise rounded-full flex items-center justify-center text-white font-bold text-xl">
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

      {/* Benefits Section */}
      <section data-scroll className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-blue-400">Impacto</span> <span className="text-white">Comprovado</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  A sinalização profissional pode aumentar significativamente 
                  a visibilidade e as vendas do seu negócio.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Aumento de visibilidade até 70%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Melhoria da imagem profissional</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Orientação eficaz dos clientes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Redução de custos publicitários</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">ROI mensurável e duradouro</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-[#333]">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Resultados Garantidos</h3>
                  <p className="text-gray-400">
                    Projetos que transformam espaços em ferramentas de vendas
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Projetos realizados</span>
                    <span className="text-blue-400 font-semibold">500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Satisfação clientes</span>
                    <span className="text-blue-400 font-semibold">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-blue-400 font-semibold">5-10 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-blue-400 font-semibold">3 anos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceGallery images={galleryImages} />

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Destacar o Seu</span> <span className="text-blue-400">Negócio?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco e descubra como a sinalização profissional 
            pode transformar o seu espaço comercial numa poderosa ferramenta de vendas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-brand-yellow text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Solicitar Visita Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20sinalização%20comercial." target="_blank" rel="noopener noreferrer">
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