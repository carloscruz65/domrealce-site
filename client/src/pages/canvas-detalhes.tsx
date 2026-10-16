import { useShopCatalog } from "@/hooks/use-shop-catalog";
import { canvasOptions } from "@shared/shop-pricing";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Package, Sparkles, Eye, ChevronLeft, ChevronRight, Euro, Ruler } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo-head";

interface CanvasImage {
  name: string;
  path: string;
}

interface SizeOption {
  size: string;
  width: number;
  height: number;
  price: number;
}

// Preços por tamanho (baseado em Telas Artísticas)


export default function LojaCanvasDetalhes() {
  const { data: catalog } = useShopCatalog();
  const sizeOptions = canvasOptions(catalog?.settings);
  const { categoria } = useParams();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [selectedCanvas, setSelectedCanvas] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Navigation functions for preview modal
  const getCurrentIndex = () => {
    return canvasImages.findIndex(canvas => canvas.path === selectedCanvas);
  };

  const goToPrevious = () => {
    const currentIndex = getCurrentIndex();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : canvasImages.length - 1;
    setSelectedCanvas(canvasImages[prevIndex].path);
  };

  const goToNext = () => {
    const currentIndex = getCurrentIndex();
    const nextIndex = currentIndex < canvasImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedCanvas(canvasImages[nextIndex].path);
  };

  const { data: images, isLoading } = useQuery({
    queryKey: ["/api/loja/images"],
  });

  // Filter canvas images for the specific category
  const canvasImages: CanvasImage[] = (images as { images: string[] })?.images
    ?.filter((path: string) => 
      path.includes(`Quadros-em-canvas/${categoria}/`) &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(path)
    )
    ?.map((path: string) => ({
      name: path.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || '',
      path: `/public-objects/${path}`
    }))
    ?.sort((a, b) => a.name.localeCompare(b.name)) || [];

  const selectedSizeOption = sizeOptions.find(s => s.size === selectedSize);

  const handleAddToCart = () => {
    if (!selectedCanvas) {
      toast({
        title: "Selecione um quadro",
        description: "Por favor, escolha um quadro antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, escolha um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    const sizeOption = sizeOptions.find(s => s.size === selectedSize);
    if (!sizeOption) return;

    // Calculate area and pricing
    const area = (sizeOption.width * sizeOption.height) / 10000; // m²
    const precoBase = sizeOption.price;
    const precoTotal = precoBase; // Unit price before IVA; checkout applies IVA once.

    const cartItem = {
      id: Date.now().toString(),
      type: 'quadros-canvas',
      canvasName: `${categoria?.toUpperCase()} - ${selectedCanvas.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || ''}`,
      canvasImage: selectedCanvas,
      tamanho: selectedSize,
      larguraCm: sizeOption.width,
      alturaCm: sizeOption.height,
      area: area,
      precoBase: precoBase,
      precoTotal: precoTotal,
      quantity: 1,
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));

    toast({
      title: "Produto adicionado!",
      description: `Quadro ${selectedSize}cm adicionado ao carrinho - €${precoTotal.toFixed(2)} sem IVA`,
    });

    // Redirecionar automaticamente para o carrinho
    setTimeout(() => {
      setLocation('/carrinho');
    }, 1000);
  };

  const handlePreview = () => {
    if (!selectedCanvas) {
      toast({
        title: "Selecione um quadro",
        description: "Por favor, escolha um quadro para ver a pré-visualização.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const categoryName = categoria?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20B2AA] mx-auto"></div>
            <p className="mt-4 text-gray-300">A carregar quadros...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead 
        title={`${categoryName} - Quadros em Canvas | DOMREALCE`}
        description={`Quadros em canvas da categoria ${categoryName}. Várias opções de tamanho e preços competitivos. Qualidade premium.`}
        keywords={`quadros canvas ${categoryName}, arte impressa, decoração parede`}
        canonicalUrl={`/loja/quadros-canvas/categoria/${categoria}`}
      />
      
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/loja/quadros-canvas" 
            className="inline-flex items-center gap-2 text-[#20B2AA] hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar às Categorias
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-[#20B2AA]">{categoryName}</span> em Canvas
              </h1>
              <p className="text-gray-400">
                {canvasImages.length} {canvasImages.length === 1 ? 'quadro disponível' : 'quadros disponíveis'}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-[#20B2AA]" />
                <span className="text-sm text-gray-300">Canvas Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span className="text-sm text-gray-300">Alta Qualidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Clique numa imagem para visualizar em tamanho maior</h2>
          
          {canvasImages.length === 0 ? (
            <div className="text-center py-12 bg-[#111111] rounded-lg border border-[#333]">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Nenhum quadro encontrado
              </h3>
              <p className="text-gray-500">
                Os quadros desta categoria estão sendo preparados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {canvasImages.map((canvas) => (
                    <div
                      key={canvas.name}
                      className={`cursor-pointer group ${
                        selectedCanvas === canvas.path ? 'ring-2 ring-[#20B2AA]' : ''
                      }`}
                      onClick={() => setSelectedCanvas(canvas.path)}
                    >
                      <div 
                        className="relative rounded-lg overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCanvas(canvas.path);
                          setShowPreview(true);
                        }}
                      >
                        <img
                          src={canvas.path}
                          alt={canvas.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover overlay "Ver Maior" */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="bg-[#20B2AA] text-white px-3 py-1 rounded text-sm font-semibold">
                            Ver Maior
                          </div>
                        </div>
                      </div>
                      <p className="text-center mt-2 text-xs text-gray-300 group-hover:text-[#20B2AA] transition-colors">
                        {canvas.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

      {/* Preview Modal with Actions */}
      {showPreview && selectedCanvas && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-lg max-w-5xl max-h-[95vh] overflow-auto border border-[#333]">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#20B2AA]">
                  Pré-visualização do Quadro
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar Atrás
                </Button>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Large Image with Navigation */}
                <div className="lg:col-span-2 relative">
                  {/* Previous Arrow */}
                  {canvasImages.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-white w-10 h-10 p-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}

                  <img
                    src={selectedCanvas}
                    alt="Pré-visualização do quadro"
                    className="w-full rounded-lg border border-[#333]"
                  />

                  {/* Next Arrow */}
                  {canvasImages.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-white w-10 h-10 p-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  )}

                  {/* Image Counter */}
                  {canvasImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {getCurrentIndex() + 1} de {canvasImages.length}
                    </div>
                  )}
                </div>

                {/* Preview Sidebar */}
                <div>
                  <h4 className="font-bold mb-4 text-[#FFD700]">Detalhes do Quadro</h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Categoria:</span>
                      <span>{categoryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Material:</span>
                      <span>Canvas Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chassi:</span>
                      <span>Madeira</span>
                    </div>
                  </div>

                  {/* Produção (valor percebido) */}
                  <div className="mb-6 p-4 bg-[#0a0a0a] border border-[#333] rounded-lg">
                    <h5 className="font-semibold mb-2 text-[#FFD700]">Produção</h5>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Impressão profissional com cores consistentes</li>
                      <li>• Controlo de qualidade antes do envio</li>
                      <li>• Pronto a pendurar</li>
                    </ul>
                  </div>

                  {/* Quick Size Selection */}
                  <div className="mb-6">
                    <h5 className="font-semibold mb-2">Tamanho:</h5>

                    <p className="text-xs text-gray-400 mb-3">
                      Produzido sob encomenda após confirmação do tamanho.
                    </p>

                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="bg-[#0a0a0a] border-[#333]">
                        <SelectValue placeholder="Escolha o tamanho" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-[#333] text-white">
                        {sizeOptions.map((option) => (
                          <SelectItem
                            key={option.size}
                            value={option.size}
                            className="text-white data-[highlighted]:bg-[#20B2AA] data-[highlighted]:text-black"
                          >
                            {option.size}cm - €{option.price.toFixed(2)} + IVA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Add to Cart */}
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      handleAddToCart();
                    }}
                    disabled={!selectedSize}
                    className="w-full bg-[#20B2AA] hover:bg-[#4169E1] text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}