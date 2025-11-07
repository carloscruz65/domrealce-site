import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Palette, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Zap, 
  Target, 
  Layers,
  MousePointer,
  Eye,
  Smartphone,
  Monitor,
  FileImage
} from "lucide-react";

export default function ServicoDesignGrafico() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Identidade Visual Completa",
      description: "Criamos logótipos únicos e desenvolvemos toda a identidade visual da sua marca"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Design Vectorial",
      description: "Desenhos escaláveis em qualquer tamanho sem perda de qualidade"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Maquetes",
      description: "Visualização realista dos seus projetos antes da produção final"
    },
    {
      icon: <FileImage className="w-6 h-6" />,
      title: "Material Publicitário",
      description: "Criação de design de identidade visual e material promocional"
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Design Digital",
      description: "Páginas web, e plataformas digitais"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Estratégia Visual",
      description: "Alinhamento do design com os objetivos do seu negócio"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Briefing Detalhado",
      description: "Reunião para entender os seus objetivos, público-alvo e preferências visuais"
    },
    {
      step: "02", 
      title: "Pesquisa e Conceito",
      description: "Análise da concorrência e desenvolvimento de conceitos criativos únicos"
    },
    {
      step: "03",
      title: "Criação e Desenvolvimento", 
      description: "Desenho dos elementos visuais e desenvolvimento da identidade"
    },
    {
      step: "04",
      title: "Apresentação e Revisões",
      description: "Apresentação das propostas com possibilidade de ajustes e melhorias"
    },
    {
      step: "05",
      title: "Finalização e Entrega",
      description: "Entrega dos ficheiros finais em todos os formatos necessários"
    }
  ];

  const benefits = [
    "Marca profissional e memorável",
    "Diferenciação da concorrência", 
    "Maior credibilidade no mercado",
    "Comunicação visual consistente",
    "Ficheiros em múltiplos formatos",
    "Suporte técnico contínuo"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-brand-yellow text-black mb-6">
              <Palette className="w-4 h-4 mr-2" />
              Design Gráfico Profissional
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              <span className="text-brand-yellow">Identidade Visual</span>
              <br />
              <span className="text-white">que Marca Diferença</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Criamos designs únicos e memoráveis que comunicam a essência da sua marca. 
              Com 40 anos de experiência, transformamos ideias em identidades visuais poderosas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-bold px-8 py-6 text-lg">
                <Link href="/contactos#formulario">Iniciar Meu Projeto</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black px-8 py-6 text-lg">
                <Link href="/contactos#formulario">Contactar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pt-8 pb-8 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-turquoise">Serviços</span> <span className="text-white">Incluídos</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Oferecemos um serviço completo de design gráfico para todas as suas necessidades visuais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/50 border-gray-800 hover:border-brand-yellow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">
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

      {/* Process Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Nosso</span> <span className="text-brand-coral">Processo</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Um método comprovado que garante resultados excepcionais em cada projeto
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-brand-coral rounded-full flex items-center justify-center text-black font-bold text-xl">
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
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Benefícios</span> <span className="text-white">do Nosso Design</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Investir em design profissional traz retornos mensuráveis para o seu negócio. 
                  Veja como podemos ajudar a sua marca a destacar-se.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-turquoise flex-shrink-0" />
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">Garantia de Qualidade</h3>
                  <p className="text-gray-400">
                    Com 40 anos no mercado, garantimos designs que superam expectativas
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Revisões incluídas</span>
                    <span className="text-brand-yellow font-semibold">Até 3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Formatos entregues</span>
                    <span className="text-brand-yellow font-semibold">Todos os necessários</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Suporte pós-entrega</span>
                    <span className="text-brand-yellow font-semibold">3 meses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Prazo médio</span>
                    <span className="text-brand-yellow font-semibold">5-10 dias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-8 pb-8 bg-gradient-to-r from-brand-yellow/10 via-brand-turquoise/10 to-brand-coral/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para Criar a Sua</span> <span className="text-brand-yellow">Identidade Visual?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto connosco hoje e descubra como podemos transformar a sua marca 
            numa presença visual poderosa e memorável.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black font-bold px-8 py-6 text-lg">
              <Link href="/contactos#formulario">
                Solicitar Orçamento Gratuito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise hover:text-black px-8 py-6 text-lg">
              <a href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20design%20gráfico." target="_blank" rel="noopener noreferrer">
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