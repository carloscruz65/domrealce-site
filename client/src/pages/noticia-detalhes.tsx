import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Share2,
  ArrowLeft,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import type { News, MediaItem } from "@shared/schema";

function formatarData(data: string | Date) {
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getCanonicalUrl(id: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/noticia/${id}`;
}

function splitIntroAndBody(text: string) {
  const raw = (text || "").trim();
  if (!raw) return { intro: "", body: "" };

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 3) return { intro: lines.join("\n"), body: "" };

  return {
    intro: lines.slice(0, 3).join("\n"),
    body: lines.slice(3).join("\n"),
  };
}

export default function NoticiaDetalhes() {
  const [, params] = useRoute("/noticia/:id");
  const [, setLocation] = useLocation();
  const noticiaId = params?.id;

  const [indiceImagem, setIndiceImagem] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: noticias = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news/all"],
  });

  const noticia = useMemo(() => {
    if (!noticiaId) return undefined;
    return noticias.find((n) => n.id?.toString() === noticiaId);
  }, [noticias, noticiaId]);

  const mediaItems = useMemo((): MediaItem[] => {
    if (!noticia) return [];
    // Usar campo media v3 se existir
    // @ts-ignore
    if (noticia.media && Array.isArray(noticia.media) && noticia.media.length > 0) {
      // @ts-ignore
      return noticia.media;
    }
    // Fallback para campos v1 (imagens/imagem)
    // @ts-ignore
    const arr = noticia?.imagens?.length ? noticia.imagens : noticia?.imagem ? [noticia.imagem] : [];
    return (arr || [])
      .filter(Boolean)
      .map((url: string) => ({ type: "image" as const, url, caption: "" }));
  }, [noticia]);

  const imagens = useMemo(() => {
    return mediaItems.filter((m) => m.type === "image").map((m) => m.url);
  }, [mediaItems]);

  const canonicalUrl = useMemo(() => {
    if (!noticiaId) return "";
    return getCanonicalUrl(noticiaId);
  }, [noticiaId]);

  const { intro, body } = useMemo(() => {
    return splitIntroAndBody(noticia?.descricao || "");
  }, [noticia?.descricao]);

  const proximaImagem = () => {
    if (!imagens.length) return;
    setIndiceImagem((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    if (!imagens.length) return;
    setIndiceImagem((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  // Meta tags (null-safe)
  useEffect(() => {
    if (!noticia) return;

    const imagemNoticia = imagens?.[0] || noticia.imagem || "";
    const descricao = (noticia.descricao || "").slice(0, 160);

    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMetaTag("og:title", noticia.titulo || "DOMREALCE");
    updateMetaTag("og:description", descricao);
    if (imagemNoticia) updateMetaTag("og:image", imagemNoticia);
    updateMetaTag("og:url", canonicalUrl || window.location.href);
    updateMetaTag("og:type", "article");
    updateMetaTag("og:site_name", "DOMREALCE");

    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", noticia.titulo || "DOMREALCE");
    updateMetaName("twitter:description", descricao);
    if (imagemNoticia) updateMetaName("twitter:image", imagemNoticia);

    document.title = `${noticia.titulo || "Notícia"} | DOMREALCE`;
  }, [noticia, imagens, canonicalUrl]);

  // Partilhas (regras finais)
  const partilharFacebook = () => {
    const share = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      canonicalUrl || window.location.href
    )}`;
    window.open(share, "_blank", "width=600,height=450");
  };

  const partilharWhatsapp = () => {
    if (!noticia) return;
    const texto = `DOMREALCE | ${noticia.titulo}\n${canonicalUrl || window.location.href}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(wa, "_blank");
  };

  const copiarLink = async () => {
    const url = canonicalUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  };

  const partilharNativoOuCopiar = async () => {
    if (!noticia) return;
    const url = canonicalUrl || window.location.href;

    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: noticia.titulo,
          text: (noticia.descricao || "").slice(0, 120),
          url,
        });
        return;
      } catch {
        return;
      }
    }

    await copiarLink();
  };

  // ✅ ShareBar minimal: “Partilhar” + ícones alinhados numa linha
  const ShareBar = ({ className = "" }: { className?: string }) => (
    <div
      className={[
        "bg-gray-900 rounded-lg p-4 sm:p-5",
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
        className,
      ].join(" ")}
    >
      <div className="text-sm text-gray-300">Partilhar</div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={partilharFacebook}
          className="text-blue-400 border-blue-400/30 hover:bg-blue-500/10"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={partilharWhatsapp}
          className="text-green-300 border-green-300/30 hover:bg-green-500/10"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={copiarLink}
          className="text-pink-300 border-pink-300/30 hover:bg-pink-500/10"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          {copied ? "Copiado" : "Copiar link"}
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar notícia...</p>
        </div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Notícia não encontrada
          </h1>
          <p className="text-muted-foreground mb-8">
            A notícia que procura não existe ou foi removida.
          </p>
          <Button
            onClick={() => setLocation("/noticias")}
            className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Notícias
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/noticias")}
          className="text-brand-yellow hover:text-brand-yellow/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Notícias
        </Button>
      </div>

      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge className="bg-brand-yellow text-black font-semibold px-4 py-1 mb-4">
              {noticia.categoria || "Notícia"}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white leading-tight">
              {noticia.titulo}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-turquoise" />
                <span className="font-medium text-white">Equipa DOMREALCE</span>
              </div>
              <div className="h-4 w-px bg-gray-700"></div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-coral" />
                <span className="text-white">
                  {noticia.data ? formatarData(noticia.data) : "Recente"}
                </span>
              </div>
            </div>
          </div>

          {/* Hero / Galeria com legendas */}
          {mediaItems.length > 0 && (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4 group">
              <figure className="aspect-[16/9] relative">
                {mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <iframe
                      src={mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.url}
                    alt={
                      mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.caption ||
                      `${noticia.titulo} - Imagem ${indiceImagem + 1}`
                    }
                    className="w-full h-full object-cover"
                  />
                )}

                {mediaItems.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={imagemAnterior}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={proximaImagem}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>

                    <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full font-semibold">
                      {indiceImagem + 1} / {mediaItems.length}
                    </div>
                  </>
                )}

                {/* Legenda (figcaption) */}
                {mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.caption && (
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                    <p className="text-white text-sm md:text-base">
                      {mediaItems[Math.min(indiceImagem, mediaItems.length - 1)]?.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            </div>
          )}

          {/* Partilha (após hero) */}
          <ShareBar className="mb-8" />

          {/* Intro curta */}
          {intro && (
            <div className="prose prose-invert prose-lg max-w-none mb-6">
              <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">
                {intro}
              </p>
            </div>
          )}

          {/* Corpo */}
          {body && (
            <div className="prose prose-invert prose-lg max-w-none mb-10">
              <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                {body}
              </p>
            </div>
          )}

          {/* CTA discreto */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Quer discutir um projeto semelhante?
            </h3>
            <p className="text-gray-300 mb-4">
              Envie fotos, medidas aproximadas e prazos. Respondemos com proposta técnica e próximos passos.
            </p>
            <Button
              className="bg-brand-yellow hover:bg-brand-yellow/90 text-black font-semibold"
              onClick={() => setLocation("/contactos#formulario")}
            >
              Falar connosco
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}