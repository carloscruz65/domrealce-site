import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface GalleryImage {
  filename: string;
  url: string;
  category?: string;
  title?: string;
  description?: string;
}

function categorizeImage(filename: string): string {
  const lower = filename.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  const pathParts = filename.split('/');
  
  if (pathParts.length >= 3) {
    if (pathParts[0].toLowerCase().includes('domrealce') && 
        pathParts[1].toLowerCase().includes('portf')) {
      return pathParts[2].toLowerCase();
    }
  }
  
  if (pathParts.length >= 2) {
    if (pathParts[0].toLowerCase().includes('portf')) {
      return pathParts[1].toLowerCase();
    }
  }
  
  if (lower.includes('camiao') || lower.includes('camião') || lower.includes('truck') || lower.includes('viatura')) {
    return 'camioes';
  }
  
  return 'outros';
}

function generateTitle(filename: string): string {
  const name = filename.replace(/\.[^/.]+$/, "").split('/').pop() || filename;
  const words = name.split(/[-_\s]+/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return words.join(' ');
}

const categoryCards = [
  { id: "autocolantes", name: "Autocolantes", image: "/public-objects/portfolio/categorias/autocolantes.webp", service: "/servico-autocolantes" },
  { id: "comerciais", name: "Comerciais", image: "/public-objects/portfolio/categorias/comerciais.webp", service: "/servico-decoracao-viaturas" },
  { id: "competição", name: "Competição", image: "/public-objects/portfolio/categorias/competicao.webp", service: "/servico-decoracao-viaturas" },
  { id: "fachadas", name: "Fachadas", image: "/public-objects/portfolio/categorias/fachadas.webp", service: "/servico-espacos-comerciais" },
  { id: "interiores", name: "Interiores", image: "/public-objects/portfolio/categorias/interiores.webp", service: "/servico-espacos-comerciais" },
  { id: "lonas", name: "Lonas", image: "/public-objects/portfolio/categorias/lonas.webp", service: "/servico-impressao-digital" },
  { id: "montras", name: "Montras", image: "/public-objects/portfolio/categorias/montras.webp", service: "/servico-espacos-comerciais" },
  { id: "máquinas", name: "Máquinas", image: "/public-objects/portfolio/categorias/maquinas.webp", service: "/servico-decoracao-viaturas" },
  { id: "reclames", name: "Reclames", image: "/public-objects/portfolio/categorias/reclames.webp", service: "/servico-espacos-comerciais" },
  { id: "camiões", name: "Camiões", image: "/public-objects/portfolio/categorias/camioes.webp", service: "/servico-decoracao-viaturas" },
];

export default function PortfolioV2() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: imagesData, isLoading } = useQuery({
    queryKey: ['/api/gallery/images'],
    retry: false,
  });

  const images: GalleryImage[] = ((imagesData as any)?.images || []).map((filename: string) => ({
    filename,
    url: `/public-objects/${filename}`,
    category: categorizeImage(filename),
    title: generateTitle(filename),
    description: `Projeto realizado pela DOMREALCE - ${generateTitle(filename)}`
  }));

  const filteredImages = selectedCategory === 'todos' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const currentService = categoryCards.find(c => c.id === selectedCategory)?.service || "/servicos";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navigation />

      <section className="pt-28 pb-12 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                O nosso <span className="text-brand-yellow">portfólio</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Projetos reais, do conceito à aplicação no terreno. Cada imagem representa estudo, produção e execução completa.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/70 p-4 text-center">
                <p className="text-2xl font-bold text-brand-yellow">40+</p>
                <p className="text-xs text-gray-400">anos experiência</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/70 p-4 text-center">
                <p className="text-2xl font-bold text-brand-turquoise">200+</p>
                <p className="text-xs text-gray-400">projetos</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/70 p-4 text-center">
                <p className="text-2xl font-bold text-brand-coral">Porto</p>
                <p className="text-xs text-gray-400">Grande Porto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Explore por <span className="text-brand-yellow">categoria</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div 
              onClick={() => handleCategoryClick("todos")}
              className="md:row-span-2 cursor-pointer group"
            >
              <div className="h-full min-h-[200px] md:min-h-full rounded-2xl bg-[#F5C518] flex flex-col items-center justify-center p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-yellow/20">
                <span className="text-black font-bold text-xl md:text-2xl text-center mb-2">
                  Ver Todos os Projetos
                </span>
                <span className="text-black/70 text-sm">+200 projetos realizados</span>
              </div>
            </div>

            {categoryCards.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/400x400/1a1a1a/FFD700?text=${encodeURIComponent(cat.name)}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                  <span className="text-white font-semibold text-lg">{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="py-12 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                {selectedCategory === 'todos' ? 'Todos os projetos' : `Projetos: ${categoryCards.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {filteredImages.length} {filteredImages.length === 1 ? 'projeto' : 'projetos'} encontrados
              </p>
            </div>
            {selectedCategory !== 'todos' && (
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory('todos')}
                className="text-brand-yellow hover:text-brand-yellow/80"
              >
                Limpar filtro
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto"></div>
              <p className="mt-4 text-muted-foreground">A carregar galeria...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
              <Button
                onClick={() => setSelectedCategory('todos')}
                className="mt-4 bg-brand-yellow text-black hover:bg-brand-yellow/90"
              >
                Ver todos os projetos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => (
                <Card key={image.filename} className="group overflow-hidden hover:shadow-lg transition-all bg-black/40 border-white/10">
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => openLightbox(image, index)}
                        loading="lazy"
                      />
                      <div 
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                        onClick={() => openLightbox(image, index)} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-brand-yellow/10 via-[#0a0a0a] to-brand-turquoise/10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quer um trabalho <span className="text-brand-yellow">semelhante</span>?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Se se identifica com este tipo de projeto, fale connosco e peça orçamento sem compromisso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={currentService}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black flex items-center gap-2"
                >
                  Ver informações do serviço
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link href="/contactos#formulario">
                <Button
                  size="lg"
                  className="bg-brand-yellow text-black hover:bg-brand-yellow/90 font-semibold flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Pedir orçamento
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden">
            <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={closeLightbox}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                    onClick={goToNext}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
                />
                
                {filteredImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}
