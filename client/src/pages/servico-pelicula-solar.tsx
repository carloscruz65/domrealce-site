import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Sun, 
  Thermometer, 
  Eye, 
  Car, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "wouter";

export default function ServicoPeliculaSolar() {
  useScrollAnimation();
  const benefits = [
    {
      icon: Sun,
      title: "Proteção UV",
      description: "Bloqueia até 99% dos raios ultravioleta nocivos"
    },
    {
      icon: Thermometer,
      title: "Controlo Térmico",
      description: "Reduz o calor interior em até 60%"
    },
    {
      icon: Eye,
      title: "Privacidade",
      description: "Mantém o interior do veículo privado"
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Reforça o vidro contra impactos e quebras"
    }
  ];

  const services = [
    {
      title: "Película Solar Residencial",
      description: "Aplicação profissional em janelas de habitações",
      features: ["Várias tonalidades", "Garantia de 5 anos", "Aplicação sem bolhas"]
    },
    {
      title: "Película Arquitetónica",
      description: "Para janelas de escritórios e residências",
      features: ["Eficiência energética", "Redução de reflexos", "Privacidade controlada"]
    },
    {
      title: "Película de Segurança",
      description: "Proteção anti-vandalismo e explosões",
      features: ["Extra resistente", "Transparente", "Certificada"]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Avaliação",
      description: "Análise dos vidros e necessidades específicas"
    },
    {
      step: "2", 
      title: "Escolha",
      description: "Seleção da película ideal para o seu projeto"
    },
    {
      step: "3",
      title: "Aplicação",
      description: "Instalação profissional com técnicas especializadas"
    },
    {
      step: "4",
      title: "Garantia",
      description: "Acompanhamento e garantia de qualidade"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFD700]/10 via-[#00d4aa]/5 to-[#4dabf7]/10 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10">
              <Sun className="w-4 h-4 mr-2" />
              Proteção Solar Residencial
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#00d4aa] to-[#4dabf7] bg-clip-text text-transparent">
              Película de Proteção Solar
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Proteja a sua habitação e economize energia com as melhores películas de proteção solar. 
              Aplicação profissional com garantia de qualidade para janelas residenciais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button size="lg" className="bg-[#FFD700] text-black hover:bg-yellow-400 font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  Pedir Orçamento
                </Button>
              </Link>
              <Button asChild size="lg" variant="outline" className="border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa] hover:text-black">
                <Link href="/contactos#formulario">
                  <Eye className="w-5 h-5 mr-2" />
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section data-scroll className="py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Benefícios da <span className="text-[#FFD700]">Película Solar</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Descubra como a película solar pode transformar o conforto e eficiência energética da sua habitação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="bg-[#222] border-[#333] hover:border-[#FFD700] transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="bg-[#FFD700]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section data-scroll className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Nossos <span className="text-[#00d4aa]">Serviços</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Soluções completas em película solar para diferentes necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-[#111111] border-[#333] hover:border-[#00d4aa] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Car className="w-6 h-6 text-[#00d4aa]" />
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-[#00d4aa] flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section data-scroll className="py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Processo de <span className="text-[#4dabf7]">Aplicação</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia profissional para resultados perfeitos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-[#4dabf7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-black">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
                
                {index < process.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-6 h-6 text-[#4dabf7]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section data-scroll className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Especificações <span className="text-[#FFD700]">Técnicas</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-[#FFD700]">Características</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proteção UV:</span>
                      <span className="text-white font-semibold">99%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Redução de Calor:</span>
                      <span className="text-white font-semibold">Até 60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Garantia:</span>
                      <span className="text-white font-semibold">5 Anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Espessura:</span>
                      <span className="text-white font-semibold">1.5-2 mil</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-[#00d4aa]">Tonalidades</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">5% (Escura):</span>
                      <span className="text-white font-semibold">Máxima privacidade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">20% (Média):</span>
                      <span className="text-white font-semibold">Equilibrio ideal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">35% (Clara):</span>
                      <span className="text-white font-semibold">Visibilidade ótima</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">70% (Incolor):</span>
                      <span className="text-white font-semibold">Proteção UV apenas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-scroll className="py-20 bg-gradient-to-r from-[#FFD700]/10 to-[#00d4aa]/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para <span className="text-[#FFD700]">Proteger</span> a sua Habitação?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contacto connosco e descubra a solução ideal de película de proteção solar para a sua casa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button size="lg" className="bg-[#FFD700] text-black hover:bg-yellow-400 font-semibold">
                  <Phone className="w-5 h-5 mr-2" />
                  Contactar Agora
                </Button>
              </Link>
              <a href="https://wa.me/351912345678" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-[#00d4aa] text-[#00d4aa] hover:bg-[#00d4aa] hover:text-black">
                  <Mail className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
