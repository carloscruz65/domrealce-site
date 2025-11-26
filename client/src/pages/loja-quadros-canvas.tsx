import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Ruler, Euro } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo-head";

interface CanvasCover {
  name: string;
  path: string;
  fileName: string;
  canvasCount?: number;
}

interface SizeOption {
  size: string;
  width: number;
  height: number;
  price: number;
}

// Preços por tamanho (baseado em Telas Artísticas)
const sizeOptions: SizeOption[] = [
  { size: '20x30', width: 20, height: 30, price: 25.00 },
  { size: '30x40', width: 30, height: 40, price: 35.00 },
  { size: '40x50', width: 40, height: 50, price: 45.00 },
  { size: '50x70', width: 50, height: 70, price: 65.00 },
  { size: '60x80', width: 60, height: 80, price: 85.00 },
  { size: '70x100', width: 70, height: 100, price: 125.00 },
  { size: '80x120', width: 80, height: 120, price: 165.00 },
  { size: '100x150', width: 100, height: 150, price: 245.00 },
];

export default function LojaQuadrosCanvas() {
  const { toast } = useToast();

  const { data: images, isLoading, error } = useQuery({
    queryKey: ["/api/loja/images"],
  });

  // Custom display names for categories - EDITA AQUI OS NOMES QUE APARECEM NA LOJA
  const displayNameOverrides: { [key: string]: string } = {
    'Mármore_geométrico': 'Mármore Geométrico',
    'Textura_mármore': 'Textura Mármore',
    'Geometrico_Minimalista': 'Geométrico Minimalista',
    'Animais_Cores': 'Animais Cores',
    'Plantas_abstratas': 'Plantas Abstratas',
    'Arte_Contemporânea': 'Arte Contemporânea',
    'Geométricos': 'Geométricos',
    // Adiciona mais categorias aqui se precisares personalizar os nomes
  };

  // Filter and format canvas cover images
  const canvasCovers: CanvasCover[] = (images as { images: string[] })?.images
    ?.filter((path: string) => path.includes('Quadros-em-canvas/Capas-quadros-em-canvas'))
    ?.map((path: string) => {
      const fileName = path.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || '';
      
      // Use custom display name if available, otherwise auto-generate
      const displayName = displayNameOverrides[fileName] || fileName
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      
      // Count canvas images in this category
      // Special mapping for categories with name variations
      const categoryMappings: { [key: string]: string[] } = {
        'Arte_Contemporânea': ['Arte_Contemporânia', 'Arte_Contemporánea'],
      };
      
      // Normalize for case-insensitive and accent-insensitive matching
      const normalizeStr = (str: string) => str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
      
      const normalizedFileName = normalizeStr(fileName);
      const possibleNames = categoryMappings[fileName] || [fileName];
      const normalizedPossibleNames = possibleNames.map(normalizeStr);
      
      const categoryImages = (images as { images: string[] })?.images
        ?.filter((imgPath: string) => {
          const pathParts = imgPath.split('/');
          if (pathParts.length < 4) return false;
          const folderName = pathParts[3];
          const normalizedFolderName = normalizeStr(folderName);
          return (normalizedFolderName === normalizedFileName || 
                  normalizedPossibleNames.includes(normalizedFolderName)) &&
                 /\.(jpg|jpeg|png|gif|webp)$/i.test(imgPath);
        }) || [];
      
      return {
        name: displayName,
        path: `/public-objects/${path}`,
        fileName: fileName,
        canvasCount: categoryImages.length
      };
    })
    // Only show categories that have at least 1 canvas
    ?.filter((canvas: CanvasCover & { canvasCount: number }) => canvas.canvasCount > 0) || [];

  const handleCanvasSelect = (canvas: CanvasCover) => {
    // Navigate to canvas details page
    window.location.href = `/loja/quadros-canvas/categoria/${canvas.fileName}`;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#20B2AA] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Erro ao carregar imagens</h2>
          <p className="text-gray-400">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead 
        title="Quadros em Canvas - Loja DOMREALCE"
        description="Quadros personalizados em canvas de alta qualidade. Vários tamanhos disponíveis com preços competitivos. Entrega rápida em Portugal."
        keywords="quadros canvas, arte impressa, decoração parede, quadros personalizados, canvas"
        canonicalUrl="/loja/quadros-canvas"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#20B2AA]/10 via-[#4169E1]/5 to-[#FF6347]/10 py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/loja" className="inline-flex items-center gap-2 text-[#20B2AA] hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar à Loja
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-[#20B2AA]">Quadros</span> em Canvas
            </h1>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Arte impressa em canvas de alta qualidade. Vários tamanhos e acabamentos premium.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-[#20B2AA]">✓</span>
                <span className="text-sm">Canvas Premium</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-[#4169E1]">✓</span>
                <span className="text-sm">8 Tamanhos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-[#FF6347]">✓</span>
                <span className="text-sm">Qualidade Profissional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section data-scroll className="py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Escolha sua <span className="text-[#20B2AA]">Categoria</span>
            </h2>
            
            {canvasCovers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">
                  Nenhuma categoria encontrada
                </h3>
                <p className="text-gray-500">
                  As categorias de quadros estão sendo preparadas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {canvasCovers.map((canvas) => (
                  <Card 
                    key={canvas.fileName}
                    className="bg-[#111111] border-[#333] hover:border-[#20B2AA] transition-all duration-300 group cursor-pointer"
                    onClick={() => handleCanvasSelect(canvas)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4">
                        <img 
                          src={canvas.path} 
                          alt={canvas.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <h3 className="text-lg font-bold group-hover:text-[#20B2AA] transition-colors text-center mb-2">
                        {canvas.name}
                      </h3>
                      
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {canvas.canvasCount} {canvas.canvasCount === 1 ? 'opção' : 'opções'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Size Guide Section */}
      <section data-scroll className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-8">
              <Ruler className="inline w-6 h-6 mr-2" />
              Tamanhos e Preços
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sizeOptions.map((option) => (
                <Card key={option.size} className="bg-[#0a0a0a] border-[#333]">
                  <CardContent className="p-4 text-center">
                    <div className="text-[#20B2AA] font-bold text-lg mb-1">
                      {option.size}cm
                    </div>
                    <div className="text-gray-400 text-sm mb-2">
                      {option.width}×{option.height}
                    </div>
                    <div className="text-[#FFD700] font-bold">
                      <Euro className="inline w-4 h-4" />
                      {option.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      + IVA (23%)
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              Preços incluem impressão em canvas premium com chassi em madeira.
            </p>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}