import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsGalleryProps {
  tipoGaleria?: "single" | "slide" | "grid" | "before-after";
  imagem?: string;
  imagens?: string[];
  titulo: string;
}

export default function NewsGallery({ tipoGaleria = "single", imagem, imagens = [], titulo }: NewsGalleryProps) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Single image
  if (tipoGaleria === "single" && imagem) {
    return (
      <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden">
        <img 
          src={imagem} 
          alt={titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 from-brand-yellow/20 via-transparent to-brand-turquoise/20"></div>
      </div>
    );
  }

  // Slideshow
  if (tipoGaleria === "slide" && imagens.length > 0) {
    const proximo = () => {
      setIndiceAtual((prev) => (prev + 1) % imagens.length);
    };

    const anterior = () => {
      setIndiceAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
    };

    return (
      <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden group">
        <img 
          src={imagens[indiceAtual]} 
          alt={`${titulo} - Imagem ${indiceAtual + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 from-brand-yellow/20 via-transparent to-brand-turquoise/20"></div>
        
        {/* Controles de navegação */}
        {imagens.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={anterior}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={proximo}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setIndiceAtual(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === indiceAtual 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {indiceAtual + 1} / {imagens.length}
            </div>
          </>
        )}
      </div>
    );
  }

  // Grid
  if (tipoGaleria === "grid" && imagens.length > 0) {
    return (
      <div className={`grid gap-2 ${
        imagens.length === 1 ? 'grid-cols-1' :
        imagens.length === 2 ? 'grid-cols-2' :
        imagens.length === 3 ? 'grid-cols-3' :
        'grid-cols-2 md:grid-cols-3'
      }`}>
        {imagens.map((img, index) => (
          <div key={index} className={`relative overflow-hidden ${
            imagens.length === 1 ? 'aspect-video' :
            index === 0 && imagens.length > 2 ? 'col-span-2 aspect-video' :
            'aspect-square'
          }`}>
            <img 
              src={img} 
              alt={`${titulo} - Imagem ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    );
  }

  // Before/After
  if (tipoGaleria === "before-after" && imagens.length >= 2) {
    return (
      <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden select-none">
        {/* Imagem "Depois" (base) */}
        <img 
          src={imagens[1]} 
          alt={`${titulo} - Depois`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Imagem "Antes" com máscara */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img 
            src={imagens[0]} 
            alt={`${titulo} - Antes`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Slider */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={(e) => {
            const onMouseMove = (moveEvent: MouseEvent) => {
              const container = e.currentTarget.parentElement;
              if (!container) return;
              const rect = container.getBoundingClientRect();
              const x = moveEvent.clientX - rect.left;
              const newPosition = (x / rect.width) * 100;
              setSliderPosition(Math.max(0, Math.min(100, newPosition)));
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        >
          {/* Setas do slider */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
            <div className="flex items-center gap-0.5">
              <ChevronLeft className="h-4 w-4 text-gray-700" />
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          ANTES
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          DEPOIS
        </div>
      </div>
    );
  }

  // Fallback: imagem única se disponível
  if (imagem) {
    return (
      <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden">
        <img 
          src={imagem} 
          alt={titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  // Placeholder se não houver imagens
  return (
    <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
      <p className="text-muted-foreground">Sem imagem disponível</p>
    </div>
  );
}
