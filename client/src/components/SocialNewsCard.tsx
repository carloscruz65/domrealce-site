import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, Share2, Heart, MessageCircle } from "lucide-react";
import type { News } from "@shared/schema";

interface SocialNewsCardProps {
  noticia: News;
  onShare?: (platform: 'facebook' | 'instagram' | 'linkedin') => void;
}

export default function SocialNewsCard({ noticia, onShare }: SocialNewsCardProps) {
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [verMais, setVerMais] = useState(false);
  const [curtido, setCurtido] = useState(false);

  const imagens = noticia.imagens && noticia.imagens.length > 0 
    ? noticia.imagens 
    : noticia.imagem ? [noticia.imagem] : [];

  const proximaImagem = () => {
    setIndiceImagem((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setIndiceImagem((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const formatarData = (data: string | Date) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const descricaoCompleta = noticia.descricao || "";
  const descricaoPreview = descricaoCompleta.slice(0, 200);
  const precisaVerMais = descricaoCompleta.length > 200;

  return (
    <Card className="overflow-hidden max-w-2xl mx-auto bg-white shadow-xl border-0">
      {/* Cabeçalho - Título e Equipe */}
      <div className="p-6 pb-4 bg-gradient-to-br from-brand-yellow/5 via-white to-brand-turquoise/5">
        <div className="flex items-start justify-between mb-3">
          <Badge 
            variant="secondary" 
            className="bg-brand-yellow text-brand-dark font-semibold px-3 py-1"
          >
            {noticia.categoria}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurtido(!curtido)}
              className={curtido ? "text-red-500" : "text-muted-foreground"}
            >
              <Heart className={`h-5 w-5 ${curtido ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-sm text-muted-foreground">
              {Math.floor(Math.random() * 50) + (curtido ? 1 : 0)}
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-3 leading-tight">
          {noticia.titulo}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-brand-turquoise" />
            <span className="font-medium">Equipa DOMREALCE</span>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand-coral" />
            <span>{noticia.data ? formatarData(noticia.data) : 'Recente'}</span>
          </div>
        </div>
      </div>

      {/* Galeria de Imagens - Centro */}
      {imagens.length > 0 && (
        <div className="relative bg-gray-900 group">
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={imagens[indiceImagem]}
              alt={`${noticia.titulo} - Imagem ${indiceImagem + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Gradiente sutil para melhor legibilidade dos controles */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>

            {/* Controles de navegação - aparecem ao hover */}
            {imagens.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={imagemAnterior}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg h-10 w-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={proximaImagem}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg h-10 w-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Contador de imagens */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {indiceImagem + 1} / {imagens.length}
                </div>

                {/* Indicadores de paginação */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imagens.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setIndiceImagem(index)}
                      className={`transition-all ${
                        index === indiceImagem
                          ? 'bg-white w-8 h-2 rounded-full'
                          : 'bg-white/60 hover:bg-white/80 w-2 h-2 rounded-full'
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Descrição - Com botão Ver Mais */}
      <div className="p-6">
        <div className="prose prose-gray max-w-none mb-4">
          <p className="text-base leading-relaxed text-gray-700">
            {verMais || !precisaVerMais ? descricaoCompleta : descricaoPreview}
            {!verMais && precisaVerMais && '...'}
          </p>
        </div>

        {precisaVerMais && (
          <Button
            variant="link"
            onClick={() => setVerMais(!verMais)}
            className="text-brand-turquoise hover:text-brand-turquoise/80 font-semibold p-0 h-auto"
          >
            {verMais ? 'Ver menos' : 'Ver mais'}
          </Button>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <Badge variant="outline" className="text-xs text-brand-yellow border-brand-yellow/30">
            #{noticia.categoria.toLowerCase().replace(/\s+/g, '')}
          </Badge>
          <Badge variant="outline" className="text-xs text-brand-turquoise border-brand-turquoise/30">
            #domrealce
          </Badge>
          <Badge variant="outline" className="text-xs text-brand-coral border-brand-coral/30">
            #comunicacaovisual
          </Badge>
        </div>
      </div>

      {/* Rodapé - Interações e Partilha */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          {/* Estatísticas de interação */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              <span>{Math.floor(Math.random() * 50) + 1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              <span>{Math.floor(Math.random() * 10)}</span>
            </div>
          </div>

          {/* Botões de partilha social */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.('facebook')}
              className="text-blue-600 hover:bg-blue-50"
              aria-label="Partilhar no Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.('instagram')}
              className="text-pink-600 hover:bg-pink-50"
              aria-label="Partilhar no Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.('linkedin')}
              className="text-blue-700 hover:bg-blue-50"
              aria-label="Partilhar no LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: noticia.titulo,
                    text: descricaoPreview,
                    url: window.location.href
                  });
                }
              }}
              className="text-gray-600 hover:bg-gray-50"
              aria-label="Partilhar"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Call to action */}
        <Button 
          className="w-full mt-3 bg-gradient-to-r from-brand-yellow to-brand-coral text-white hover:opacity-90 font-semibold shadow-md"
          size="lg"
        >
          Saber Mais Sobre Este Projeto
        </Button>
      </div>
    </Card>
  );
}
