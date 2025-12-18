import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Settings } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import wallpaperSamplesImage from "@assets/box_amostras_prodeccor_plus_1755963100331.webp";
import quadrosCanvasCover from "@assets/image_1756920896021.png";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
  status: 'available' | 'promotion' | 'new' | 'sold-out';
}

const products: Product[] = [
  // Produtos removidos - apenas Papel de Parede disponível por agora
];

const categories = [
  { id: 'papel-parede', name: 'Papel de Parede', href: '/loja/papel-parede' },
  { id: 'quadros-canvas', name: 'Quadros em Canvas', href: '/loja/quadros-canvas' }
  // Outras categorias serão adicionadas conforme necessário
];

export default function Loja() {
  // Simplified - only Papel de Parede category available

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'promotion':
        return <Badge className="bg-[#FF6347] text-white">Promoção</Badge>;
      case 'new':
        return <Badge className="bg-[#20B2AA] text-white">Novo</Badge>;
      case 'sold-out':
        return <Badge variant="secondary">Esgotado</Badge>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-400'}`} 
          />
        ))}
        <span className="text-sm text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-yellow/10 via-brand-turquoise/5 to-brand-coral/10 py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Nossa <span className="text-brand-yellow">Loja</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Produtos personalizáveis prontos para entrega. Qualidade profissional com a comodidade de compra online.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-brand-yellow">✓</span>
                <span className="text-sm">Entrega rápida</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-brand-turquoise">✓</span>
                <span className="text-sm">Qualidade garantida</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-brand-coral">✓</span>
                <span className="text-sm">Personalização total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Category Section */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-[#FFD700]">
              Categorias Disponíveis
            </h2>
            
            {/* Grid responsivo: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {/* Papel de Parede */}
              <Link href="/loja/papel-parede">
                <Card className="bg-[#111111] border-[#333] hover:border-[#FFD700] transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-full h-24 rounded-lg mx-auto mb-4 overflow-hidden">
                      <img 
                        src={wallpaperSamplesImage} 
                        alt="Papel de Parede Samples" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold group-hover:text-[#FFD700] transition-colors text-center">
                      Papel de Parede
                    </h3>
                  </CardContent>
                </Card>
              </Link>

              {/* Quadros em Canvas */}
              <Link href="/loja/quadros-canvas">
                <Card className="bg-[#111111] border-[#333] hover:border-[#20B2AA] transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-full h-24 rounded-lg mx-auto mb-4 overflow-hidden">
                      <img 
                        src={quadrosCanvasCover} 
                        alt="Quadros em Canvas" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold group-hover:text-[#20B2AA] transition-colors text-center">
                      Quadros em Canvas
                    </h3>
                  </CardContent>
                </Card>
              </Link>

              {/* Placeholders para outras categorias */}
              {[1, 2].map((i) => (
                <Card key={i} className="bg-[#111111] border-[#333] opacity-50">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xl">📦</span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-gray-400 text-center">
                      Em Breve
                    </h3>
                    
                    <p className="text-gray-500 text-sm text-center">
                      Mais produtos brevemente
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Info about more categories */}
            <div className="mt-12 p-6 bg-[#111111] rounded-lg border border-[#333]">
              <h4 className="text-lg font-semibold mb-3 text-[#20B2AA]">
                Mais Categorias em Breve
              </h4>
              <p className="text-gray-300">
                Outras categorias como Placas Decorativas, Autocolantes, Quadros e Sinalização 
                serão adicionadas progressivamente conforme necessário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#20B2AA] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#FFD700]">Personalização Gratuita</h3>
              <p className="text-gray-300">
                Todos os produtos podem ser personalizados sem custos adicionais.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#20B2AA] to-[#4169E1] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#20B2AA]">Envio Rápido</h3>
              <p className="text-gray-300">
                Entregas em 3-5 dias úteis para todo o país.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6347] to-[#FFD700] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#FF6347]">Qualidade Garantida</h3>
              <p className="text-gray-300">
                40 anos de experiência garantem a melhor qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}