import ScrollToTop from "@/components/scroll-to-top";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Shield, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Sun,
  Home,
  Building,
  Thermometer,
  Eye,
  Zap,
  Award
} from "lucide-react";

export default function ServicoPeliculasProtecaoSolar() {
  useScrollAnimation();
  const benefits = [
    {
      icon: <Sun className="w-6 h-6" />,
      title: "Proteção UV",
      description: "Bloqueia até 99% dos raios UV prejudiciais, protegendo móveis e pessoas"
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      title: "Controlo Térmico",
      description: "Reduz o calor interior até 78%, diminuindo custos de climatização"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Privacidade",
      description: "Oferece privacidade sem bloquear completamente a luz natural"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Economia de Energia",
      description: "Reduz significativamente os custos com ar condicionado e aquecimento"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Proteção de Mobiliário",
      description: "Evita o desbotamento de móveis, tapetes e obras de arte"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Maior Conforto",
      description: "Elimina reflexos e pontos de calor excessivo no interior"
    }
  ];


  const peliculaEspelhada = {
    name: "Película Espelhada",
    description: "Efeito espelho exterior mantendo visibilidade interior",
    protecao: "99% UV",
    reducaoCalor: "60-70%",
    privacidade: "Alta (dia)",
    applications: ["Escritórios", "Lojas", "Hospitais", "Edifícios comerciais", "Fachadas"]
  };

  const aplicacoes = [
    {
      category: "Residencial",
      icon: <Home className="w-6 h-6" />,
      items: ["Janelas de sala", "Quartos", "Cozinhas", "Casas de banho", "Marquises"]
    },
    {
      category: "Comercial",
      icon: <Building className="w-6 h-6" />,
      items: ["Escritórios", "Lojas", "Restaurantes", "Hotéis", "Hospitais"]
    },
    {
      category: "Industrial",
      icon: <Shield className="w-6 h-6" />,
      items: ["Armazéns", "Fábricas", "Centros logísticos", "Laboratórios", "Salas de servidores"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Avaliação no Local",
      description: "Visitamos o local para avaliar as necessidades e medir as superfícies"
    },
    {
      step: "02", 
      title: "Seleção da Película",
      description: "Recomendamos a película ideal baseada na orientação solar e necessidades"
    },
    {
      step: "03",
      title: "Preparação das Superfícies", 
      description: "Limpeza profissional dos vidros para garantir aderência perfeita"
    },
    {
      step: "04",
      title: "Aplicação Profissional",
      description: "Instalação por técnicos certificados com ferramentas especializadas"
    },
    {
      step: "05",
      title: "Controlo Final",
      description: "Inspeção de qualidade e orientações de manutenção"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <ServiceHero
        serviceId="peliculas-protecao-solar"
        badge="Películas de Proteção Solar"
        badgeIcon={<Shield className="w-4 h-4 mr-2" />}
        title="Proteção Solar"
        subtitle="Inteligente"
        description="Películas de proteção solar para interior e exterior que reduzem o calor, protegem dos raios UV e proporcionam privacidade mantendo a luminosidade natural."
        overlayOpacity="0"
        primaryCta={{
          text: "Solicitar Avaliação",
          href: "/contactos#formulario"
        }}
        secondaryCta={{
          text: "Ver Benefícios",
          href: "#beneficios"
        }}
      />

      {/* Benefits Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-blue-400">Benefícios</span> <span className="text-white">Comprovados</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tecnologia avançada que oferece proteção, conforto e economia de energia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-blue-400 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Película Espelhada Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <img 
                  src="/public-objects/essenciais/1758147555446_Building_with_solar_films_981bb10c.png" 
                  alt="Edifício com películas de proteção solar aplicadas" 
                  className="w-full h-[400px] object-cover rounded-2xl border border-gray-800"
                />
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-white">Película</span> <span className="text-orange-400">Espelhada</span>
                </h2>
                
                <p className="text-gray-400 text-lg mb-8">
                  {peliculaEspelhada.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <span className="text-gray-300">Proteção UV:</span>
                    <span className="text-orange-400 font-semibold text-lg">{peliculaEspelhada.protecao}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <span className="text-gray-300">Redução de calor:</span>
                    <span className="text-orange-400 font-semibold text-lg">{peliculaEspelhada.reducaoCalor}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <span className="text-gray-300">Privacidade:</span>
                    <span className="text-orange-400 font-semibold text-lg">{peliculaEspelhada.privacidade}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-white font-semibold mb-4">Ideal para:</h4>
                  <div className="flex flex-wrap gap-2">
                    {peliculaEspelhada.applications.map((app, index) => (
                      <Badge key={index} variant="outline" className="border-orange-400 text-orange-400">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button asChild className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold px-8 py-6 text-lg">
                  <Link href="/contactos#formulario">
                    Solicitar Orçamento
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Aplicações</span> <span className="text-brand-yellow">Mais Comuns</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Soluções adaptadas para diferentes tipos de espaços e necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aplicacoes.map((aplicacao, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">
                    {aplicacao.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-brand-yellow">{aplicacao.category}</h3>
                  <div className="space-y-2">
                    {aplicacao.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section data-scroll className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo de</span> <span className="text-blue-400">Instalação</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia profissional que garante resultados duradouros e de qualidade
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

      {/* Warranty Section */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-blue-400">Garantia e</span> <span className="text-white">Qualidade</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Utilizamos apenas películas de marcas reconhecidas mundialmente 
                  com garantia de fábrica e instalação profissional certificada.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Garantia de instalação: 2 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Películas com garantia de fábrica: 5-15 anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Marcas premium: 3M, SolarGard, LLumar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Instaladores certificados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-white">Avaliação e orçamento gratuitos</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Economia Comprovada</h3>
                  <p className="text-gray-400">
                    Redução imediata nos custos de climatização
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Proteção UV</span>
                    <span className="text-blue-400 font-semibold">Até 99%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Redução do calor</span>
                    <span className="text-blue-400 font-semibold">Até 78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Economia energia</span>
                    <span className="text-blue-400 font-semibold">30-50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo instalação</span>
                    <span className="text-blue-400 font-semibold">1-3 dias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-blue-600/10 via-brand-turquoise/10 to-brand-yellow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Economizar com</span> <span className="text-blue-400">Proteção Solar?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Solicite uma avaliação gratuita e descubra quanto pode economizar 
            com as nossas películas de proteção solar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-brand-turquoise text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Avaliação Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20películas%20de%20proteção%20solar." target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ScrollToTop />
      <ScrollToTop />
      <Footer />
    </div>
  );
}
