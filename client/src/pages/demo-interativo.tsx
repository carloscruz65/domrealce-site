import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { Play, Pause, ShoppingCart, Star, ArrowRight, Facebook, Instagram, Linkedin, ExternalLink, CheckCircle, CreditCard, Truck, Award } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  component: JSX.Element;
}

export default function DemoInterativo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState(0);
  
  // Buscar dados reais da API
  const { data: productsData } = useQuery({ queryKey: ['/api/products/featured'] });
  const { data: galleryData } = useQuery({ queryKey: ['/api/gallery/images'] });
  
  const products = (productsData as any[]) || [];
  const portfolioImages = ((galleryData as any)?.images || []).slice(0, 6).map((img: string) => `/public-objects/${img}`);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Bem-vindos à DOMREALCE",
      description: "Descobra a nossa empresa de comunicação visual e impressão digital em Portugal",
      duration: 3000,
      component: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-[#e84b5e] to-[#4dabf7] bg-clip-text text-transparent">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">DOMREALCE</h1>
            <p className="text-xl md:text-2xl text-white">Comunicação Visual & Impressão Digital</p>
          </div>
          <div className="flex justify-center items-center gap-4 text-[#00d4aa]">
            <Award className="h-8 w-8" />
            <span className="text-lg">Mais de 10 anos de experiência</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Loja Online - Nossos Produtos",
      description: "Explore nossa variedade de produtos de alta qualidade",
      duration: 4000,
      component: (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Produtos em Destaque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product: any) => (
              <Card key={product.id} className="bg-gray-800 border-gray-600 hover:border-[#4dabf7] transition-colors">
                <CardContent className="p-4">
                  <img 
                    src={(product as any).images?.[0] || '/placeholder-product.jpg'}
                    alt={(product as any).name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h4 className="text-white font-bold">{(product as any).name}</h4>
                  <p className="text-gray-300 text-sm mb-3">{(product as any).description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00d4aa] font-bold">€{(product as any).price}</span>
                    <Badge variant="secondary" className="bg-[#e84b5e] text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Nossos Serviços",
      description: "Conheça todos os serviços que oferecemos",
      duration: 3500,
      component: (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Serviços Especializados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Design Gráfico",
                description: "Criação de logótipos, cartões de visita, brochuras e material promocional",
                color: "#e84b5e"
              },
              {
                title: "Impressão Digital",
                description: "Impressão de alta qualidade para todos os tipos de material",
                color: "#4dabf7"
              },
              {
                title: "Papel de Parede",
                description: "Instalação profissional de papel de parede personalizado",
                color: "#00d4aa"
              },
              {
                title: "Decoração de Viaturas",
                description: "Personalização completa de veículos comerciais e particulares",
                color: "#ffd43b"
              }
            ].map((service, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 mt-2"
                  style={{ backgroundColor: service.color }}
                />
                <div>
                  <h4 className="text-white font-bold mb-2">{service.title}</h4>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Portfólio - Nossos Trabalhos",
      description: "Veja alguns dos projetos que realizamos",
      duration: 4000,
      component: (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Projetos Realizados</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((img: string, index: number) => (
              <div key={index} className="relative group">
                <img 
                  src={img}
                  alt={`Projeto ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-600 group-hover:border-[#4dabf7] transition-colors"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Badge className="bg-[#00d4aa] text-black">
              +100 Projetos Concluídos
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Simulação de Compra",
      description: "Veja como é fácil comprar connosco",
      duration: 5000,
      component: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Processo de Compra Simples</h3>
          
          {/* Produto selecionado */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center gap-4">
              <img 
                src={(products[0] as any)?.images?.[0] || '/placeholder-product.jpg'}
                alt="Produto"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-white font-bold">{(products[0] as any)?.name || 'Papel de Parede Premium'}</h4>
                <p className="text-gray-300 text-sm">Quantidade: 1</p>
                <p className="text-[#00d4aa] font-bold">€{(products[0] as any)?.price || '25.99'}</p>
              </div>
              <Button 
                onClick={() => setCartItems(prev => prev + 1)}
                className="bg-[#e84b5e] hover:bg-[#d63951] text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ({cartItems})
              </Button>
            </div>
          </div>

          {/* Opções de pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#4dabf7]" />
                  Pagamentos
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">MB WAY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">Multibanco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">Payshop</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardContent className="p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#00d4aa]" />
                  Entrega
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">Envio gratuito {'>'}€50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">Entrega 24-48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#00d4aa]" />
                    <span className="text-gray-300 text-sm">Instalação incluída</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Conecte-se Connosco",
      description: "Siga-nos nas redes sociais e visite nosso site",
      duration: 3000,
      component: (
        <div className="text-center space-y-8">
          <h3 className="text-2xl font-bold text-white">Siga-nos nas Redes Sociais</h3>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://facebook.com/domrealce" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-[#1877f2] rounded-lg hover:bg-[#166fe5] transition-colors"
            >
              <Facebook className="h-8 w-8 text-white" />
              <span className="text-white text-sm">Facebook</span>
            </a>
            
            <a 
              href="https://instagram.com/domrealce" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] rounded-lg hover:opacity-80 transition-opacity"
            >
              <Instagram className="h-8 w-8 text-white" />
              <span className="text-white text-sm">Instagram</span>
            </a>
            
            <a 
              href="https://linkedin.com/company/domrealce" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-[#0077b5] rounded-lg hover:bg-[#005a8b] transition-colors"
            >
              <Linkedin className="h-8 w-8 text-white" />
              <span className="text-white text-sm">LinkedIn</span>
            </a>
          </div>

          <div className="space-y-4">
            <Link href="/loja">
              <Button className="bg-gradient-to-r from-[#e84b5e] to-[#d63951] hover:from-[#d63951] hover:to-[#c02d42] text-white text-lg px-8 py-3 mr-4">
                Visite Nossa Loja
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/contactos#formulario">
              <Button variant="outline" className="border-[#4dabf7] text-[#4dabf7] hover:bg-[#4dabf7] hover:text-white text-lg px-8 py-3">
                Entre em Contacto
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-gray-400">
            Obrigado por conhecer a DOMREALCE! 🎉
          </p>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (demoSteps[currentStep].duration / 100));
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Demonstração Interativa - DOMREALCE
            </h1>
            <p className="text-gray-400 text-lg">
              Descubra todos os nossos produtos e serviços numa apresentação guiada
            </p>
          </div>

          {/* Video Controls */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handlePlay}
                  className="bg-[#e84b5e] hover:bg-[#d63951] text-white"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <span className="text-white font-medium">
                  Passo {currentStep + 1} de {demoSteps.length}: {demoSteps[currentStep].title}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-[#e84b5e] to-[#4dabf7] h-2 rounded-full transition-all duration-100"
                style={{ width: `${(currentStep / (demoSteps.length - 1)) * 100 + (progress / demoSteps.length)}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {demoSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    index === currentStep 
                      ? 'bg-[#e84b5e] text-white' 
                      : index < currentStep 
                        ? 'bg-[#00d4aa] text-black'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-gray-900 rounded-lg p-8 min-h-[500px]">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {demoSteps[currentStep].title}
              </h2>
              <p className="text-gray-400">
                {demoSteps[currentStep].description}
              </p>
            </div>
            
            <div className="mt-8">
              {demoSteps[currentStep].component}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              onClick={() => goToStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Passo Anterior
            </Button>
            
            <Button 
              onClick={() => goToStep(Math.min(demoSteps.length - 1, currentStep + 1))}
              disabled={currentStep === demoSteps.length - 1}
              className="bg-[#4dabf7] hover:bg-[#339af0] text-white"
            >
              Próximo Passo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}