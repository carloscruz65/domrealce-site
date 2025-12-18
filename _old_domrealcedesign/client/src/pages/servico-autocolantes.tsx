import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sticker, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Scissors,
  Shield,
  Palette,
  Settings,
  Zap,
  Award
} from "lucide-react";

export default function ServicoAutocolantes() {
  const features = [
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Corte de Contorno Preciso",
      description: "Tecnologia de corte digital que segue perfeitamente as formas do seu design"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Materiais Duradouros",
      description: "Vinil de alta qualidade resistente a água, UV e intempéries"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Personalizado",
      description: "Criação de designs únicos ou adaptação dos seus logótipos e imagens"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Aplicação Fácil",
      description: "Autocolantes preparados para aplicação simples e sem bolhas"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Produção Rápida",
      description: "Prazos de entrega reduzidos para projetos urgentes"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Acabamento Profissional",
      description: "Cortes limpos e precisos com acabamento de qualidade comercial"
    }
  ];

  const materials = [
    {
      name: "Vinil Autocolante Brilhante",
      description: "Acabamento brilhante para máximo impacto visual",
      durability: "5-7 anos exterior",
      applications: ["Montras", "Viaturas", "Sinalização"]
    },
    {
      name: "Vinil Autocolante Mate", 
      description: "Acabamento mate elegante e discreto",
      durability: "5-7 anos exterior",
      applications: ["Decoração", "Etiquetas premium", "Equipamentos"]
    },
    {
      name: "Vinil Removível",
      description: "Para aplicações temporárias sem deixar resíduos",
      durability: "1-2 anos",
      applications: ["Eventos", "Promoções", "Decoração temporária"]
    },
    {
      name: "Vinil Transparente",
      description: "Para aplicação sobre superfícies coloridas",
      durability: "3-5 anos",
      applications: ["Vidros", "Acrílicos", "Superfícies transparentes"]
    }
  ];

  const applications = [
    {
      category: "Identificação Comercial",
      items: ["Logótipos de empresa", "Horários de funcionamento", "Informações de contacto", "QR codes"]
    },
    {
      category: "Sinalização",
      items: ["Placas direcionais", "Numeração", "Avisos de segurança", "Símbolos informativos"]
    },
    {
      category: "Decoração",
      items: ["Elementos decorativos", "Frases motivacionais", "Padrões geométricos", "Ilustrações"]
    },
    {
      category: "Produtos e Embalagens",
      items: ["Etiquetas de produto", "Códigos de barras", "Selos de qualidade", "Informações técnicas"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Design e Preparação",
      description: "Criamos ou preparamos o seu design para corte de contorno"
    },
    {
      step: "02", 
      title: "Seleção do Material",
      description: "Escolhemos o vinil ideal para a aplicação pretendida"
    },
    {
      step: "03",
      title: "Impressão Digital", 
      description: "Impressão em alta resolução com cores vibrantes e duradouras"
    },
    {
      step: "04",
      title: "Corte de Contorno",
      description: "Corte de precisão seguindo perfeitamente as formas do design"
    },
    {
      step: "05",
      title: "Acabamento e Entrega",
      description: "Aplicação de transfer e preparação para aplicação final"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-black via-green-900/20 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-green-600 text-white mb-6">
              <Sticker className="w-4 h-4 mr-2" />
              Autocolantes Profissionais
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              <span className="text-green-400">Autocolantes e Etiquetas</span>
              <br />
              <span className="text-white">com Corte de Contorno</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Tecnologia de corte digital de precisão para criar autocolantes únicos. 
              Desde etiquetas simples até designs complexos com formas personalizadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-green-600 to-brand-turquoise text-white font-bold px-8 py-6 text-lg">
                <Link href="/contactos#formulario">Criar Autocolantes</Link>
              </Button>
              <Button variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
                Ver Materiais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pt-0 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-green-400">Tecnologia</span> <span className="text-white">de Precisão</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Equipamentos de corte digital que garantem precisão milimétrica em cada autocolante
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-green-400 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-green-400 mb-4">
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

      {/* Materials Section */}
      <section className="pt-0 pb-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Tipos de</span> <span className="text-brand-coral">Material</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Materiais de alta qualidade para diferentes aplicações e durabilidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {materials.map((material, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-brand-coral transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-coral">{material.name}</h3>
                  <p className="text-gray-400 mb-4">{material.description}</p>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Durabilidade:</span>
                    <span className="text-green-400 font-semibold ml-2">{material.durability}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">Aplicações:</span>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app, appIndex) => (
                        <Badge key={appIndex} variant="outline" className="border-green-400 text-green-400">
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

      {/* Applications Section */}
      <section className="pt-0 pb-8 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Aplicações</span> <span className="text-brand-yellow">Comuns</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Infinitas possibilidades de uso para autocolantes e etiquetas personalizadas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applications.map((application, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-brand-yellow">{application.category}</h3>
                  <div className="space-y-2">
                    {application.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
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
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo de</span> <span className="text-green-400">Produção</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Metodologia que garante qualidade e precisão em cada autocolante produzido
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-brand-turquoise rounded-full flex items-center justify-center text-white font-bold text-xl">
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
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-green-400">Especificações</span> <span className="text-white">Técnicas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Equipamentos de corte de última geração que permitem criar autocolantes 
                  com detalhes impossíveis de conseguir manualmente.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">Corte de precisão até 0.1mm</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">Largura máxima: 1.37m</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">Formas complexas e detalhadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">Vários materiais compatíveis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-white">Produção em série</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Qualidade Garantida</h3>
                  <p className="text-gray-400">
                    Cada autocolante é inspecionado antes da entrega
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Espessura do vinil</span>
                    <span className="text-green-400 font-semibold">80-100 microns</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Resistência UV</span>
                    <span className="text-green-400 font-semibold">5-7 anos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-green-400 font-semibold">1-3 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quantidade mínima</span>
                    <span className="text-green-400 font-semibold">1 unidade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-0 pb-8 bg-gradient-to-r from-green-600/10 via-brand-turquoise/10 to-brand-yellow/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Criar os Seus</span> <span className="text-green-400">Autocolantes?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto e descubra como os nossos autocolantes personalizados 
            podem dar uma nova dimensão ao seu projeto ou negócio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-green-600 to-brand-turquoise text-white font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Solicitar Orçamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20autocolantes." target="_blank" rel="noopener noreferrer">
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