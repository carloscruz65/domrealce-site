import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Facebook,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import type { News } from "@shared/schema";

function getCanonicalUrl(id: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/noticia/${id}`;
}

export default function SocialNewsCard({ noticia }: { noticia: News }) {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  const imagens =
    noticia.imagens && noticia.imagens.length > 0
      ? noticia.imagens
      : noticia.imagem
      ? [noticia.imagem]
      : [];

  const canonicalUrl = useMemo(
    () => getCanonicalUrl(String(noticia.id)),
    [noticia.id]
  );

  const formatarData = (data: string | Date) =>
    new Date(data).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const descricao = noticia.descricao || "";
  const preview = descricao.slice(0, 120);

  const irParaDetalhes = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLocation(`/noticia/${noticia.id}`);
  };

  const partilharFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        canonicalUrl
      )}`,
      "_blank",
      "width=600,height=450"
    );
  };

  const partilharWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const texto = `DOMREALCE | ${noticia.titulo}\n${canonicalUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  };

  const copiarLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Link href={`/noticia/${noticia.id}`}>
      <Card className="overflow-hidden bg-black border border-gray-800 hover:border-brand-yellow/50 transition-all cursor-pointer group h-full flex flex-col">
        {imagens.length > 0 && (
          <div className="relative bg-gray-900">
            <div className="aspect-[16/10] relative overflow-hidden">
              <img
                src={imagens[0]}
                alt={noticia.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <Badge className="absolute top-3 left-3 bg-brand-yellow text-black font-semibold">
                {noticia.categoria}
              </Badge>

              <h2 className="absolute bottom-3 left-3 right-3 text-base font-bold text-white line-clamp-2 group-hover:text-brand-yellow transition-colors">
                {noticia.titulo}
              </h2>
            </div>
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>DOMREALCE</span>
            </div>
            <div className="h-3 w-px bg-gray-700" />
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{noticia.data ? formatarData(noticia.data) : "Recente"}</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed flex-1">
            {preview}
            {descricao.length > 120 && "..."}
          </p>

          <div className="flex gap-2 mb-3 flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs text-blue-400 border-blue-400/30 hover:bg-blue-500/10"
              onClick={partilharFacebook}
            >
              <Facebook className="h-4 w-4 mr-1.5" />
              FB
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs text-green-300 border-green-300/30 hover:bg-green-500/10"
              onClick={partilharWhatsapp}
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs text-pink-300 border-pink-300/30 hover:bg-pink-500/10"
              onClick={copiarLink}
            >
              <LinkIcon className="h-4 w-4 mr-1.5" />
              {copied ? "Copiado" : "Link"}
            </Button>
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-end">
            <Button
              size="sm"
              className="bg-brand-yellow text-black hover:bg-brand-yellow/90 text-xs h-7 px-3"
              onClick={irParaDetalhes}
            >
              Ver Mais
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}