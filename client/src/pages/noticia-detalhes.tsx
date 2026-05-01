import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  Star,
  Quote,
  Send,
  Instagram,
  Linkedin,
  Phone,
} from "lucide-react";
import type { News, MediaItem, Testimonial } from "@shared/schema";

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
  const { toast } = useToast();

  const [indiceImagem, setIndiceImagem] = useState(0);
  const [copied, setCopied] = useState(false);

  // Form state for testimonial submission
  const [reviewForm, setReviewForm] = useState({ nome: "", empresa: "", mensagem: "", rating: 0 });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { data: noticias = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news/all"],
  });

  const { data: testimonialsData } = useQuery<{ testimonials: Testimonial[] }>({
    queryKey: ["/api/testimonials", noticiaId],
    queryFn: () => fetch(`/api/testimonials/${noticiaId}`).then(r => r.json()),
    enabled: !!noticiaId,
  });

  const approvedTestimonials = testimonialsData?.testimonials || [];

  const submitTestimonialMutation = useMutation({
    mutationFn: (data: { noticiaId: string; nome: string; empresa?: string; rating: number; mensagem: string }) =>
      apiRequest("POST", "/api/testimonials", data),
    onSuccess: () => {
      setReviewSubmitted(true);
      setReviewForm({ nome: "", empresa: "", mensagem: "", rating: 0 });
      toast({ title: "Obrigado pelo seu testemunho!", description: "A sua avaliação será publicada após revisão." });
    },
    onError: () => {
      toast({ title: "Erro ao enviar", description: "Verifique os campos e tente novamente.", variant: "destructive" });
    },
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

  // Usar heroImageUrl para SEO/hero (com fallback para imagem legacy)
  const heroImage = useMemo(() => {
    if (!noticia) return "";
    return noticia.heroImageUrl || imagens?.[0] || noticia.imagem || "";
  }, [noticia, imagens]);

  // Meta tags (null-safe)
  useEffect(() => {
    if (!noticia) return;

    const imagemNoticia = heroImage;
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

    const absoluteImage = imagemNoticia?.startsWith("http")
      ? imagemNoticia
      : imagemNoticia
      ? `${window.location.origin}${imagemNoticia}`
      : "";

    updateMetaTag("og:title", noticia.titulo || "DOMREALCE");
    updateMetaTag("og:description", descricao);
    if (absoluteImage) {
      updateMetaTag("og:image", absoluteImage);
      updateMetaTag("og:image:secure_url", absoluteImage);
      updateMetaTag("og:image:width", "1200");
      updateMetaTag("og:image:height", "630");
    }
    updateMetaTag("og:url", canonicalUrl || window.location.href);
    updateMetaTag("og:type", "article");
    updateMetaTag("og:site_name", "DOMREALCE — Comunicação Visual");
    updateMetaTag("og:locale", "pt_PT");

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

  const partilharLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl || window.location.href)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const partilharInstagram = async () => {
    const url = canonicalUrl || window.location.href;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: noticia?.titulo, url });
        return;
      } catch {}
    }
    await copiarLink();
    toast({ title: "Link copiado!", description: "Cole o link na sua publicação do Instagram." });
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
          onClick={partilharInstagram}
          className="text-pink-400 border-pink-400/30 hover:bg-pink-500/10"
        >
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={partilharLinkedIn}
          className="text-blue-300 border-blue-300/30 hover:bg-blue-400/10"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={copiarLink}
          className="text-gray-400 border-gray-600/50 hover:bg-gray-700/30"
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

      <article className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-3">
            <Button
              variant="ghost"
              onClick={() => setLocation("/noticias")}
              className="text-brand-yellow hover:text-brand-yellow/80 -ml-3 mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Notícias
            </Button>

            <Badge className="bg-brand-yellow text-black font-semibold px-4 py-1 mb-2 block w-fit">
              {noticia.categoria || "Notícia"}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white leading-tight">
              {noticia.titulo}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
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
            <>
              {/* GRID: quando tipoGaleria === 'grid' e há mais de 1 item */}
              {/* @ts-ignore */}
              {noticia.tipoGaleria === "grid" && mediaItems.length > 1 ? (
                <div className="mb-3">
                  {/* Imagem principal grande */}
                  {(() => {
                    const heroUrl = (noticia as any).heroImageUrl || mediaItems[0]?.url;
                    return heroUrl ? (
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3" style={{ maxHeight: "70vh" }}>
                        <img
                          src={heroUrl}
                          alt={noticia.titulo}
                          className="w-full object-cover object-center"
                          style={{ maxHeight: "70vh" }}
                        />
                      </div>
                    ) : null;
                  })()}
                  {/* Grelha das restantes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {mediaItems.map((item, idx) =>
                      item.type === "image" ? (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 group cursor-pointer">
                          <img
                            src={item.url}
                            alt={item.caption || `${noticia.titulo} — imagem ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                              <p className="text-white text-xs truncate">{item.caption}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-black">
                          <iframe
                            src={item.url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                /* SLIDESHOW: modo padrão (single, slide ou quando há 1 item) */
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-3 group">
                  <figure className="relative" style={{ maxHeight: "70vh", overflow: "hidden" }}>
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
                        className="w-full object-cover object-center"
                        style={{ maxHeight: "70vh" }}
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
            </>
          )}

          {/* Partilha (após hero) */}
          <ShareBar className="mb-4" />

          {/* Intro curta */}
          {intro && (
            <div className="prose prose-invert prose-lg max-w-none mb-3 px-1 sm:px-0">
              <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">
                {intro}
              </p>
            </div>
          )}

          {/* Corpo */}
          {body && (
            <div className="prose prose-invert prose-lg max-w-none mb-5 px-1 sm:px-0">
              <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
                {body}
              </p>
            </div>
          )}

          {/* Nota do Atelier */}
          {(noticia.notaEditorial || noticia.pontuacao) && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-brand-yellow rounded-full"></div>
                <h3 className="text-lg font-semibold text-brand-yellow">Nota do Atelier</h3>
                {noticia.pontuacao && parseInt(noticia.pontuacao) > 0 && (
                  <Badge className="bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30 ml-auto">
                    {noticia.pontuacao}/5
                  </Badge>
                )}
              </div>
              {noticia.notaEditorial && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {noticia.notaEditorial}
                </p>
              )}
            </div>
          )}

          {/* Testemunho do Cliente */}
          {/* @ts-ignore */}
          {noticia.clienteReviewText && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-brand-yellow/30 rounded-xl p-5 mb-4">
              <div className="flex items-start gap-3 mb-4">
                <Quote className="h-8 w-8 text-brand-yellow flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-brand-yellow font-semibold text-lg mb-1">Testemunho do Cliente</h3>
                  {/* @ts-ignore */}
                  {noticia.clienteReviewRating && noticia.clienteReviewRating > 0 && (
                    <div className="flex gap-0.5">
                      {/* @ts-ignore */}
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            // @ts-ignore
                            i < noticia.clienteReviewRating
                              ? "text-brand-yellow fill-brand-yellow"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* @ts-ignore */}
              <blockquote className="text-gray-200 text-lg leading-relaxed italic mb-4 whitespace-pre-wrap">
                "{noticia.clienteReviewText}"
              </blockquote>
              {/* @ts-ignore */}
              {noticia.clienteReviewAuthor && (
                <p className="text-brand-yellow font-medium text-sm">
                  {/* @ts-ignore */}
                  — {noticia.clienteReviewAuthor}
                </p>
              )}
            </div>
          )}

          {/* CTA discreto */}
          <div className="bg-gray-900 rounded-lg p-5 mb-4">
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

          {/* Contacto direto */}
          <div className="border border-gray-800 rounded-lg p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
              Contacte-nos diretamente
            </p>
            <a
              href="tel:+351930682725"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-brand-yellow/50 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 group w-fit"
            >
              <Phone className="h-4 w-4 text-brand-yellow group-hover:text-brand-yellow/80" />
              930 682 725
            </a>
          </div>

          {/* ===== TESTEMUNHOS ===== */}

          {/* Testemunhos aprovados */}
          {approvedTestimonials.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-3">
                <Quote className="h-6 w-6 text-brand-yellow" />
                O que dizem os clientes
              </h2>
              <div className="space-y-4">
                {approvedTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < t.rating ? "text-brand-yellow fill-brand-yellow" : "text-gray-600"}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-white ml-1">{t.nome}</span>
                      {t.empresa && <span className="text-gray-400 text-sm">— {t.empresa}</span>}
                    </div>
                    <blockquote className="text-gray-300 leading-relaxed italic">
                      "{t.mensagem}"
                    </blockquote>
                    {t.createdAt && (
                      <p className="text-xs text-gray-600 mt-3">
                        {new Date(t.createdAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de submissão */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-heading font-bold text-white mb-1 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-brand-yellow" />
              Deixe o seu testemunho
            </h2>
            <p className="text-gray-400 text-sm mb-5">
              Trabalhou connosco neste projeto? A sua opinião é muito valiosa.
            </p>

            {reviewSubmitted ? (
              <div className="bg-green-900/30 border border-green-700/40 rounded-lg p-5 text-center">
                <p className="text-green-300 font-semibold text-lg mb-1">Obrigado pelo seu testemunho!</p>
                <p className="text-gray-400 text-sm">A sua avaliação será publicada após revisão pela nossa equipa.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-brand-yellow hover:text-brand-yellow/80"
                  onClick={() => setReviewSubmitted(false)}
                >
                  Enviar outro testemunho
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewForm.nome.trim() || !reviewForm.mensagem.trim() || reviewForm.rating === 0) {
                    toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
                    return;
                  }
                  if (!noticiaId) return;
                  submitTestimonialMutation.mutate({
                    noticiaId,
                    nome: reviewForm.nome,
                    empresa: reviewForm.empresa || undefined,
                    rating: reviewForm.rating,
                    mensagem: reviewForm.mensagem,
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-sm">Nome Completo *</Label>
                    <Input
                      required
                      value={reviewForm.nome}
                      onChange={(e) => setReviewForm({ ...reviewForm, nome: e.target.value })}
                      placeholder="O seu nome"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-sm">Empresa / Cargo</Label>
                    <Input
                      value={reviewForm.empresa}
                      onChange={(e) => setReviewForm({ ...reviewForm, empresa: e.target.value })}
                      placeholder="Ex: Transportes A Ideal da Granja"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Selector de estrelas */}
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm">Avaliação *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                        aria-label={`${star} estrelas`}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= reviewForm.rating
                              ? "text-brand-yellow fill-brand-yellow"
                              : "text-gray-600 hover:text-brand-yellow/60"
                          }`}
                        />
                      </button>
                    ))}
                    {reviewForm.rating > 0 && (
                      <span className="text-sm text-gray-400 self-center ml-2">
                        {["", "Fraco", "Razoável", "Bom", "Muito Bom", "Excelente"][reviewForm.rating]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm">Mensagem *</Label>
                  <Textarea
                    required
                    value={reviewForm.mensagem}
                    onChange={(e) => setReviewForm({ ...reviewForm, mensagem: e.target.value })}
                    placeholder="Partilhe a sua experiência com este projeto..."
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitTestimonialMutation.isPending}
                  className="bg-brand-yellow hover:bg-brand-yellow/90 text-black font-semibold"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitTestimonialMutation.isPending ? "A enviar..." : "Enviar Testemunho"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}