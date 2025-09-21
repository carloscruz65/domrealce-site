import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Package, Sparkles, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

interface TextureImage {
  name: string;
  path: string;
}

interface CartItem {
  textureName: string;
  textureImage: string;
  acabamento: 'brilho' | 'mate';
  laminacao: boolean;
  preco: number;
  precoTotal: number;
}

export default function LojaTexturaDetalhes() {
  const { textura } = useParams();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Navigation functions for preview modal
  const getCurrentIndex = () => {
    return textureImages.findIndex(texture => texture.path === selectedTexture);
  };

  const goToPrevious = () => {
    const currentIndex = getCurrentIndex();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : textureImages.length - 1;
    setSelectedTexture(textureImages[prevIndex].path);
  };

  const goToNext = () => {
    const currentIndex = getCurrentIndex();
    const nextIndex = currentIndex < textureImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedTexture(textureImages[nextIndex].path);
  };

  const { data: images, isLoading } = useQuery({
    queryKey: ["/api/loja/images"],
  });

  // Filter textures for the specific category
  // Convert textura param to match folder structure (3d -> 3D)
  const categoryName = textura === '3d' ? '3D' : 
                      textura === 'baby-2.0' ? 'Baby-2.0' :
                      textura === 'baby-colors' ? 'Baby-Colors' :
                      textura === 'baby-colors-1' ? 'Baby-Colors-1' :
                      textura === 'baby-colors-2' ? 'Baby-Colors-2' :
                      textura === 'baby-colors-3' ? 'Baby-Colors-3' :
                      textura === 'baby-paineis' ? 'Baby-Paineis' :
                      textura === 'baby-pantone' ? 'Baby-Pantone' :
                      textura === 'baby-pantone-1' ? 'Baby-Pantone-1' :
                      textura === 'baby-pantone-2' ? 'Baby-Pantone-2' :
                      textura === 'baby-pantone-3' ? 'Baby-Pantone-3' :
                      textura ? textura.charAt(0).toUpperCase() + textura.slice(1) : '';

  // Check if this is a Baby-Pantone or Baby-Colors category to show subcategory navigation
  const isPantoneCategory = textura?.includes('baby-pantone') || false;
  const isColorsCategory = textura?.includes('baby-colors') || false;
  
  // Helper function to extract number from filename for sorting
  const extractNumber = (filename: string): number => {
    const match = filename.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const textureImages: TextureImage[] = (images as { images: string[] })?.images
    ?.filter((path: string) => 
      path.includes(`loja/papel-de-parede/texturas/${categoryName}/`) &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(path)
    )
    ?.map((path: string) => ({
      name: path.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || '',
      path: `/public-objects/${path}`
    }))
    // Sort by numeric value extracted from filename (001, 002, 003...)
    ?.sort((a, b) => {
      const numA = extractNumber(a.name);
      const numB = extractNumber(b.name);
      return numA - numB;
    }) || [];
  
  const basePrice = 20;

  const handleAddToCart = () => {
    if (!selectedTexture) {
      toast({
        title: "Selecione uma textura",
        description: "Por favor, escolha uma textura antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      id: Date.now().toString(),
      type: 'papel-parede' as const,
      textureName: `${textura?.toUpperCase()} - ${selectedTexture.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || ''}`,
      textureImage: selectedTexture,
      category: textura || '',
      preco: basePrice,
      acabamento: 'mate' as const,
      laminacao: false,
      tipoCola: 'com-cola' as const,
      largura: 0,
      altura: 0,
      larguraCm: 0,
      alturaCm: 0,
      area: 0.01,
      precoTotal: basePrice,
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));

    toast({
      title: "Produto adicionado!",
      description: "Redirecionando para o carrinho para personalizar...",
    });

    // Redirecionar automaticamente para o carrinho
    setTimeout(() => {
      setLocation('/carrinho');
    }, 1000);
  };

  const handlePreview = () => {
    if (!selectedTexture) {
      toast({
        title: "Selecione uma textura",
        description: "Por favor, escolha uma textura para ver a pré-visualização.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const textureName = textura?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-gray-300">A carregar texturas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/loja/papel-parede">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Voltar às Texturas
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Texturas <span className="text-[#FFD700]">{textureName}</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Escolha a sua textura favorita e personalize o acabamento
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Texture Gallery */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-6">
              Texturas Disponíveis
            </h2>
            
            {textureImages.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Nenhuma textura disponível para {textureName} no momento.
                </p>
                <p className="text-gray-500 mt-2">
                  Entre em contacto connosco para mais opções.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {textureImages.map((texture) => (
                  <div
                    key={texture.name}
                    className={`cursor-pointer group ${
                      selectedTexture === texture.path ? 'ring-2 ring-[#FFD700]' : ''
                    }`}
                    onClick={() => setSelectedTexture(texture.path)}
                  >
                    <div 
                      className="relative rounded-lg overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTexture(texture.path);
                        setShowPreview(true);
                      }}
                    >
                      <img
                        src={texture.path}
                        alt={texture.name}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Hover overlay "Ver Maior" */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="bg-[#FFD700] text-black px-3 py-1 rounded text-sm font-semibold">
                          Ver Maior
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-2 text-xs text-gray-300 group-hover:text-[#FFD700] transition-colors">
                      {texture.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-[#111111] border-[#333] sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#FFD700] mb-6">
                  Ações
                </h3>

                {/* Selected Texture Preview */}
                {selectedTexture && (
                  <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
                    <h4 className="text-sm font-semibold text-[#FFD700] mb-3">Textura Selecionada:</h4>
                    <img
                      src={selectedTexture}
                      alt="Textura selecionada"
                      className="w-full aspect-square object-cover rounded mb-3"
                    />
                    <p className="text-xs text-gray-300 text-center">
                      {selectedTexture.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                    </p>
                  </div>
                )}

                {/* Price Display */}
                <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFD700] font-bold">Preço base:</span>
                    <span className="text-[#FFD700] font-bold text-xl">€{basePrice}/m²</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    *Medidas e personalização no carrinho
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!selectedTexture}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 hover:opacity-90 disabled:opacity-50"
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    Ou clique numa textura e depois "Ver Maior" para ver detalhes
                  </p>
                </div>

                {/* Continue Shopping Message */}
                <div className="mt-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
                  <p className="text-sm text-gray-300 text-center">
                    💡 Adicione mais produtos ao carrinho para otimizar o envio!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal with Actions */}
      {showPreview && selectedTexture && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] rounded-lg max-w-5xl max-h-[95vh] overflow-auto border border-[#333]">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#FFD700]">
                  Pré-visualização da Textura
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar Atrás
                </Button>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Large Image with Navigation */}
                <div className="lg:col-span-2 relative">
                  {/* Previous Arrow */}
                  {textureImages.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black w-10 h-10 p-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}

                  <img
                    src={selectedTexture}
                    alt="Pré-visualização da textura"
                    className="w-full rounded-lg border border-[#333]"
                  />

                  {/* Next Arrow */}
                  {textureImages.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black w-10 h-10 p-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  )}

                  {/* Image Counter */}
                  {textureImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {getCurrentIndex() + 1} de {textureImages.length}
                    </div>
                  )}
                </div>
                
                {/* Actions Panel */}
                <div className="lg:col-span-1">
                  <Card className="bg-[#0a0a0a] border-[#333]">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-[#FFD700] mb-4">
                        {selectedTexture.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}
                      </h4>

                      {/* Navigation Info */}
                      {textureImages.length > 1 && (
                        <div className="mb-4 p-3 bg-[#111111] rounded border border-[#333]">
                          <p className="text-sm text-gray-300 text-center">
                            Use as setas para navegar entre texturas
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
                            <ChevronLeft className="w-4 h-4" />
                            <span>Anterior</span>
                            <span>•</span>
                            <span>Seguinte</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                      
                      {/* Category */}
                      <div className="mb-4">
                        <Badge className="bg-[#FFD700] text-black">
                          {textura?.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-6 p-4 bg-[#111111] rounded-lg border border-[#333]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#FFD700] font-bold">Preço base:</span>
                          <span className="text-[#FFD700] font-bold text-xl">€{basePrice}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          *Personalização disponível no carrinho
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          onClick={handleAddToCart}
                          className="w-full bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 hover:opacity-90"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Adicionar ao Carrinho
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="w-full border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-black"
                          onClick={() => {
                            // Navigate to cart - we'll implement this
                            window.location.href = '/carrinho';
                          }}
                        >
                          Ver Carrinho
                        </Button>
                      </div>
                      
                      {/* Continue Shopping Message */}
                      <div className="mt-6 p-4 bg-[#111111] rounded-lg border border-[#333]">
                        <p className="text-sm text-gray-300 text-center">
                          💡 Adicione mais produtos ao carrinho para otimizar o envio!
                        </p>
                      </div>
                      
                      {/* Product Info */}
                      <div className="mt-6 pt-6 border-t border-[#333]">
                        <h5 className="text-white font-semibold mb-3">Informações</h5>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Produto personalizado</li>
                          <li>• Sem trocas ou devoluções</li>
                          <li>• Prazo: 5-7 dias úteis</li>
                          <li>• Instalação disponível</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baby-Pantone Subcategories Navigation */}
      {isPantoneCategory && (
        <div className="bg-[#111111] border-t border-[#333]">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
              Ver Texturas Seguintes - Baby Pantone
            </h2>
            <p className="text-center text-gray-300 mb-6">
              Navegue entre as diferentes partes da coleção Baby Pantone
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {['Baby-Pantone', 'Baby-Pantone-1', 'Baby-Pantone-2', 'Baby-Pantone-3'].map((subcategory: string, index: number) => {
                const isCurrentCategory = subcategory.toLowerCase().replace(/-/g, '-') === textura;
                const subcategoryUrl = subcategory.toLowerCase().replace(/-/g, '-');
                
                // Check if subcategory has images
                const hasImages = (images as { images: string[] })?.images?.some((path: string) => 
                  path.includes(`texturas/${subcategory}/`)
                ) || false;
                
                return (
                  <div key={subcategory}>
                    {hasImages ? (
                      <Link href={`/loja/papel-parede/textura/${subcategoryUrl}`}>
                        <Card className={`text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isCurrentCategory 
                            ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                            : 'bg-[#0a0a0a] border-[#333] hover:border-[#FFD700]'
                        }`}>
                          <CardContent className="p-4">
                            <div className="text-4xl mb-2">
                              {index + 1}
                            </div>
                            <h3 className={`font-bold text-sm ${
                              isCurrentCategory ? 'text-black' : 'text-[#FFD700]'
                            }`}>
                              Parte {index + 1}
                            </h3>
                            <p className={`text-xs mt-1 ${
                              isCurrentCategory ? 'text-black/70' : 'text-gray-400'
                            }`}>
                              {index === 0 ? '001-100' : index === 1 ? '101-200' : index === 2 ? '201-300' : '301-400'}
                            </p>
                            {isCurrentCategory && (
                              <div className="mt-2 text-xs font-bold">
                                ← ESTÁ AQUI
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ) : (
                      <Card className="text-center bg-gray-800 border-gray-600 opacity-50">
                        <CardContent className="p-4">
                          <div className="text-4xl mb-2 text-gray-500">
                            {index + 1}
                          </div>
                          <h3 className="font-bold text-sm text-gray-500">
                            Parte {index + 1}
                          </h3>
                          <p className="text-xs mt-1 text-gray-500">
                            Em breve
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Info about uploading missing parts */}
            <div className="mt-8 p-4 bg-[#0a0a0a] rounded-lg border border-[#333] text-center">
              <p className="text-gray-300 text-sm">
                💡 Novas texturas serão adicionadas em breve. Fique atento às atualizações!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Baby-Colors Subcategories Navigation */}
      {isColorsCategory && (
        <div className="bg-[#111111] border-t border-[#333]">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
              Ver Texturas Seguintes - Baby Colors
            </h2>
            <p className="text-center text-gray-300 mb-6">
              Navegue entre as diferentes partes da coleção Baby Colors
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {['Baby-Colors', 'Baby-Colors-1', 'Baby-Colors-2', 'Baby-Colors-3'].map((subcategory: string, index: number) => {
                const isCurrentCategory = subcategory.toLowerCase().replace(/-/g, '-') === textura;
                const subcategoryUrl = subcategory.toLowerCase().replace(/-/g, '-');
                
                // Check if subcategory has images
                const hasImages = (images as { images: string[] })?.images?.some((path: string) => 
                  path.includes(`texturas/${subcategory}/`)
                ) || false;
                
                return (
                  <div key={subcategory}>
                    {hasImages ? (
                      <Link href={`/loja/papel-parede/textura/${subcategoryUrl}`}>
                        <Card className={`text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isCurrentCategory 
                            ? 'bg-[#FFD700] text-black border-[#FFD700]' 
                            : 'bg-[#0a0a0a] border-[#333] hover:border-[#FFD700]'
                        }`}>
                          <CardContent className="p-4">
                            <div className="text-4xl mb-2">
                              {index + 1}
                            </div>
                            <h3 className={`font-bold text-sm ${
                              isCurrentCategory ? 'text-black' : 'text-[#FFD700]'
                            }`}>
                              Parte {index + 1}
                            </h3>
                            <p className={`text-xs mt-1 ${
                              isCurrentCategory ? 'text-black/70' : 'text-gray-400'
                            }`}>
                              {index === 0 ? '001-100' : index === 1 ? '101-200' : index === 2 ? '201-300' : '301-400'}
                            </p>
                            {isCurrentCategory && (
                              <div className="mt-2 text-xs font-bold">
                                ← ESTÁ AQUI
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ) : (
                      <Card className="text-center bg-gray-800 border-gray-600 opacity-50">
                        <CardContent className="p-4">
                          <div className="text-4xl mb-2 text-gray-500">
                            {index + 1}
                          </div>
                          <h3 className="font-bold text-sm text-gray-500">
                            Parte {index + 1}
                          </h3>
                          <p className="text-xs mt-1 text-gray-500">
                            Em breve
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Info about uploading missing parts */}
            <div className="mt-8 p-4 bg-[#0a0a0a] rounded-lg border border-[#333] text-center">
              <p className="text-gray-300 text-sm">
                💡 Novas texturas serão adicionadas em breve. Fique atento às atualizações!
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}