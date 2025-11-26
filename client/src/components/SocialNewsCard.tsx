import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Heart } from "lucide-react";
import type { News } from "@shared/schema";

interface SocialNewsCardProps {
  noticia: News;
  onShare?: (platform: 'facebook' | 'instagram' | 'linkedin') => void;
}

export default function SocialNewsCard({ noticia }: SocialNewsCardProps) {
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [curtido, setCurtido] = useState(false);

  const imagens = noticia.imagens && noticia.imagens.length > 0 
    ? noticia.imagens 
    : noticia.imagem ? [noticia.imagem] : [];

  const formatarData = (data: string | Date) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const descricaoCompleta = noticia.descricao || "";
  const descricaoPreview = descricaoCompleta.slice(0, 120);
  const precisaVerMais = descricaoCompleta.length > 120;

  return (
    <Link href={`/noticia/${noticia.id}`}>
      <Card 
        className="overflow-hidden bg-black border border-gray-800 hover:border-brand-yellow/50 transition-all cursor-pointer group h-full flex flex-col"
        data-testid={`card-noticia-${noticia.id}`}
      >
        {/* Galeria de Imagens - Topo, mais retangular */}
        {imagens.length > 0 && (
          <div className="relative bg-gray-900">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img
                src={imagens[indiceImagem]}
                alt={`${noticia.titulo} - Imagem ${indiceImagem + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Gradiente para legibilidade do título */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
              {imagens.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  {indiceImagem + 1}/{imagens.length}
                </div>
              )}

              <Badge 
                className="absolute top-3 left-3 bg-brand-yellow text-black font-semibold"
              >
                {noticia.categoria}
              </Badge>

              {/* Título sobreposto na imagem */}
              <h2 className="absolute bottom-3 left-3 right-3 text-base font-bold text-white line-clamp-2 group-hover:text-brand-yellow transition-colors drop-shadow-lg">
                {noticia.titulo}
              </h2>
            </div>
          </div>
        )}

        {/* Conteúdo Compacto */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Data e Equipe */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>DOMREALCE</span>
            </div>
            <div className="h-3 w-px bg-gray-700"></div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{noticia.data ? formatarData(noticia.data) : 'Recente'}</span>
            </div>
          </div>

          {/* Descrição - Compacta */}
          <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed flex-1">
            {descricaoPreview}{precisaVerMais && '...'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="outline" className="text-xs border-brand-turquoise/30 text-brand-turquoise">
              #domrealce
            </Badge>
          </div>

          {/* Footer - Interações */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurtido(!curtido);
                }}
                className={`flex items-center gap-1 ${curtido ? 'text-red-500' : ''}`}
                data-testid={`button-like-${noticia.id}`}
              >
                <Heart className={`h-3.5 w-3.5 ${curtido ? 'fill-current' : ''}`} />
                <span>{Math.floor(Math.random() * 50) + (curtido ? 1 : 0)}</span>
              </button>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black hover:opacity-90 text-xs h-7 px-3"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/noticia/${noticia.id}`;
              }}
              data-testid={`button-vermais-${noticia.id}`}
            >
              Ver Mais
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
