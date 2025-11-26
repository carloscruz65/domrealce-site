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
  Printer, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Zap, 
  Shield,
  Maximize,
  Palette,
  Clock,
  Award
} from "lucide-react";

export default function ServicoImpressaoDigital() {
  useScrollAnimation();
  const features = [
    {
      icon: <Maximize className="w-6 h-6" />,
      title: "Tintas Látex Premium",
      description: "Impressões com tintas látex de alta qualidade, sem odor e resistentes ao desbotamento"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Materiais Resistentes",
      description: "Vinil, lona e materiais que resistem a intempéries e UV"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Cores Vibrantes",
      description: "Tecnologia de impressão que garante cores vivas e duradouras"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Produção Rápida",
      description: "Prazos de entrega reduzidos sem comprometer a qualidade"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Acabamentos Premium",
      description: "Laminação, corte de contorno e outros acabamentos profissionais"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Disponibilidade 24h",
      description: "Produção contínua para cumprir prazos apertados"
    }
  ];

  const materials = [
    {
      name: "Vinil Autocolante",
      description: "Para aplicação em superfícies lisas e curvas",
      applications: ["Montras", "Viaturas", "Sinalização"]
    },
    {
      name: "Vinil Decorativo", 
      description: "Acabamento mate para decoração interior",
      applications: ["Paredes", "Móveis", "Vidros"]
    },
    {
      name: "Lona Publicitária",
      description: "Resistente para exterior com ilhós incluídos",
      applications: ["Fachadas", "Eventos", "Obras"]
    },
    {
      name: "Lona Perfurada",
      description: "Permite passagem de vento, ideal para vedações e fachadas",
      applications: ["Andaimes", "Vedações", "Fachadas"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Análise do Ficheiro",
      description: "Verificamos resolução, cores e preparamos o ficheiro para impressão"
    },
    {
      step: "02", 
      title: "Seleção do Material",
      description: "Escolhemos o material ideal para a aplicação pretendida"
    },
    {
      step: "03",
      title: "Impressão Digital", 
      description: "Impressão com tecnologia de ponta e controlo de qualidade rigoroso"
    },
    {
      step: "04",
      title: "Acabamentos",
      description: "Laminação, corte e preparação final do produto"
    },
    {
      step: "05",
      title: "Entrega ou Aplicação",
      description: "Entrega do produto ou aplicação no local pelo nosso técnico"
    }
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
      alt: "Impressão digital em vinil",
      title: "Vinil Autocolante"
    },
    {
      src: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80",
      alt: "Lona publicitária impressa",
      title: "Lona Publicitária"
    },
    {
      src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
      alt: "Impressão grande formato",
      title: "Grande Formato"
    },
    {
      src: "https://images.unsplash.com/photo-1605289355680-75fb41239154?w=800&q=80",
      alt: "Decoração de montra",
      title: "Decoração de Montras"
    },
    {
      src: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=800&q=80",
      alt: "Material promocional impresso",
      title: "Material Promocional"
    },
    {
      src: "https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=800&q=80",
      alt: "Sinalética comercial",
      title: "Sinalética"
    }
  ];

  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ['/api/service-galleries', 'impressao-digital'],
  });
  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section - Dynamic from backend */}
      <ServiceHero
        serviceId="impressao-digital"
        badge="Impressão Digital Profissional"
        badgeIcon={<Printer className="w-4 h-4 mr-2" />}
        title="Impressão Digital"
        subtitle="de Grande Formato"
        description="Tecnologia de impressão digital de última geração para projetos de grande impacto. Qualidade fotográfica em materiais resistentes e duradouros."
        portfolioButton={true}
      />

      {/* Features Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-turquoise">Tecnologia</span> <span className="text-white">Avançada</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Equipamentos de impressão digital que garantem qualidade excepcional em todos os projetos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-brand-turquoise transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-brand-turquoise mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ServiceGallery
        title="Trabalhos em Impressão Digital"
        description="Exemplos de projetos de impressão digital de grande formato realizados para os nossos clientes"
        images={galleryImages}
        columns={3}
      />

      {/* Materials Section */}
      <section className="pt-8 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Materiais</span> <span className="text-brand-coral">Disponíveis</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Selecionamos os melhores materiais para garantir durabilidade e qualidade visual
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {materials.map((material, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-coral">{material.name}</h3>
                  <p className="text-gray-400 mb-4">{material.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Aplicações:</span>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app, appIndex) => (
                        <Badge key={appIndex} variant="outline" className="border-brand-turquoise text-brand-turquoise">
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
      <section data-scroll className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo de</span> <span className="text-brand-yellow">Produção</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia rigorosa que garante qualidade consistente em cada impressão
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-turquoise to-brand-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
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

      {/* Specs Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-turquoise">Especificações</span> <span className="text-white">Técnicas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Equipamentos de última geração que permitem impressões de qualidade excepcional 
                  em grandes formatos.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                    <span className="text-white">Tintas látex sem odor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                    <span className="text-white">Resolução: 1440 DPI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                    <span className="text-white">Resistência superior ao desbotamento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                    <span className="text-white">Perfil de cores ICC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                    <span className="text-white">Acabamentos especiais</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-turquoise mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Garantia de Qualidade</h3>
                  <p className="text-gray-400">
                    Controlo rigoroso em todas as fases da produção
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Durabilidade exterior</span>
                    <span className="text-brand-turquoise font-semibold">5-7 anos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Resolução mínima</span>
                    <span className="text-brand-turquoise font-semibold">150 DPI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-brand-turquoise font-semibold">2-5 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-brand-turquoise font-semibold">1 ano</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-brand-turquoise/10 via-brand-blue/10 to-brand-coral/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Imprimir o Seu</span> <span className="text-brand-turquoise">Projeto?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco e descubra como a nossa impressão digital pode 
            dar vida aos seus projetos de comunicação visual.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-brand-turquoise to-brand-blue text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Solicitar Orçamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20impressão%20digital." target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}