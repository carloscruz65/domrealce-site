import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Share2,
  Heart,
} from "lucide-react";
import type { News } from "@shared/schema";

interface SocialNewsCardProps {
  noticia: News;
  onShare?: (platform: "facebook" | "instagram" | "linkedin") => void;
}

export default function SocialNewsCard({ noticia, onShare }: SocialNewsCardProps) {
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [curtido, setCurtido] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const imagens =
    noticia.imagens && noticia.imagens.length > 0
      ? noticia.imagens
      : noticia.imagem
      ? [noticia.imagem]
      : [];

  const proximaImagem = () => {
    setIndiceImagem((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setIndiceImagem((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const formatarData = (data: string | Date) => {
    return new Date(data).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const descricaoCompleta = noticia.descricao || "";
  const descricaoPreview = descricaoCompleta.slice(0, 120);
  const precisaVerMais = descricaoCompleta.length > 120;

  return (
    <>
      <Card
        className="overflow-hidden bg-black border border-gray-800 hover:border-brand-yellow/50 transition-all cursor-pointer group"
        onClick={() => setModalAberto(true)}
      >
        {/* NOVO: Título antes da imagem */}
        <div className="p-4 pb-0">
          <Badge className="bg-brand-yellow text-black font-semibold mb-2">
            {noticia.categoria}
          </Badge>
          <h2 className="text-lg font-bold text-white group-hover:text-brand-yellow transition-colors line-clamp-2 leading-snug mb-3">
            {noticia.titulo}
          </h2>
        </div>

        {/* Galeria de Imagens */}
        {imagens.length > 0 && (
          <div className="relative bg-gray-900">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img
                src={imagens[indiceImagem]}
                alt={`${noticia.titulo} - Imagem ${indiceImagem + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {imagens.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  {indiceImagem + 1}/{imagens.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo Compacto */}
        <div className="p-4">
          {/* Data e Equipe */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>DOMREALCE</span>
            </div>
            <div className="h-3 w-px bg-gray-700"></div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{noticia.data ? formatarData(noticia.data) : "Recente"}</span>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
            {descricaoPreview}
            {precisaVerMais && "..."}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge
              variant="outline"
              className="text-xs border-brand-turquoise/30 text-brand-turquoise"
            >
              #domrealce
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurtido(!curtido);
                }}
                className={`flex items-center gap-1 ${curtido ? "text-red-500" : ""}`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${curtido ? "fill-current" : ""}`}
                />
                <span>{Math.floor(Math.random() * 50) + (curtido ? 1 : 0)}</span>
              </button>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-brand-yellow to-brand-coral text-black hover:opacity-90 text-xs h-7 px-3"
              onClick={(e) => {
                e.stopPropagation();
                setModalAberto(true);
              }}
            >
              Ver Mais
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal (inalterado) */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-4xl bg-black border-gray-800 text-white p-0 overflow-hidden">
          <div className="max-h-[90vh] overflow-y-auto">
            {/* Imagem Grande com Controles */}
            {imagens.length > 0 && (
              <div className="relative bg-gray-900 group">
                <div className="aspect-[16/9] relative">
                  <img
                    src={imagens[indiceImagem]}
                    alt={`${noticia.titulo} - Imagem ${indiceImagem + 1}`}
                    className="w-full h-full object-contain bg-black"
                  />

                  {imagens.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={imagemAnterior}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12"
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={proximaImagem}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12"
                      >
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo Expandido (inalterado) */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-brand-yellow text-black font-semibold px-4 py-1">
                  {noticia.categoria}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white leading-tight">
                {noticia.titulo}
              </h1>

              {/* ... resto do modal igual */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
