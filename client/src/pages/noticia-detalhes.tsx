import ScrollToTop from "@/components/scroll-to-top";
import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronLeft, ChevronRight, Facebook, Instagram, Linkedin, Share2, ArrowLeft } from "lucide-react";
import type { News } from "@shared/schema";

export default function NoticiaDetalhes() {
  const [, params] = useRoute("/noticia/:id");
  const [, setLocation] = useLocation();
  const noticiaId = params?.id;
  const [indiceImagem, setIndiceImagem] = useState(0);

  // Buscar todas as notícias da API pública
  const { data: noticias = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news/all']
  });

  // Encontrar a notícia específica
  const noticia = noticias.find(n => n.id?.toString() === noticiaId);

  const imagens = noticia?.imagens && noticia.imagens.length > 0 
    ? noticia.imagens 
    : noticia?.imagem ? [noticia.imagem] : [];

  const proximaImagem = () => {
    setIndiceImagem((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setIndiceImagem((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const formatarData = (data: string | Date) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Atualizar meta tags Open Graph para esta notícia específica
  useEffect(() => {
    if (noticia) {
      const imagemNoticia = noticia.imagens?.[0] || noticia.imagem || '';
      
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      const updateMetaName = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Open Graph tags
      updateMetaTag('og:title', noticia.titulo);
      updateMetaTag('og:description', noticia.descricao.slice(0, 160));
      updateMetaTag('og:image', imagemNoticia);
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:site_name', 'DOMREALCE');

      // Twitter tags
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', noticia.titulo);
      updateMetaName('twitter:description', noticia.descricao.slice(0, 160));
      updateMetaName('twitter:image', imagemNoticia);

      // Atualizar título da página
      document.title = `${noticia.titulo} | DOMREALCE`;
    }
  }, [noticia]);

  // Partilhar nas redes sociais
  const partilharFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const partilharLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const partilharInstagram = () => {
    alert('Para partilhar no Instagram, tire uma captura de ecrã desta página e publique na sua conta @domrealce');
  };

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
          <h1 className="text-4xl font-heading font-bold mb-4">Notícia não encontrada</h1>
          <p className="text-muted-foreground mb-8">A notícia que procura não existe ou foi removida.</p>
          <Button 
            onClick={() => setLocation('/noticias')}
            className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Notícias
          </Button>
        </div>
      <ScrollToTop />
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      {/* Breadcrumb e Voltar */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/noticias')}
          className="text-brand-yellow hover:text-brand-yellow/80"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Notícias
        </Button>
      </div>

      {/* Conteúdo Principal */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <Badge className="bg-brand-yellow text-black font-semibold px-4 py-1 mb-4">
              {noticia.categoria}
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
                <span className="text-white">{noticia.data ? formatarData(noticia.data) : 'Recente'}</span>
              </div>
            </div>
          </div>

          {/* Galeria de Imagens */}
          {imagens.length > 0 && (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-8 group">
              <div className="aspect-[16/9] relative">
                <img
                  src={imagens[indiceImagem]}
                  alt={`${noticia.titulo} - Imagem ${indiceImagem + 1}`}
                  className="w-full h-full object-cover"
                />

                {imagens.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={imagemAnterior}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid="button-previous-image"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={proximaImagem}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {imagens.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setIndiceImagem(index)}
                          className={`transition-all ${
                            index === indiceImagem
                              ? 'bg-brand-yellow w-8 h-2 rounded-full'
                              : 'bg-gray-600 hover:bg-gray-400 w-2 h-2 rounded-full'
                          }`}
                          data-testid={`button-indicator-${index}`}
                        />
                      ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full font-semibold">
                      {indiceImagem + 1} / {imagens.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="prose prose-invert prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
              {noticia.descricao}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-800">
            <Badge variant="outline" className="border-brand-yellow/30 text-brand-yellow">
              #{noticia.categoria.toLowerCase().replace(/\s+/g, '')}
            </Badge>
            <Badge variant="outline" className="border-brand-turquoise/30 text-brand-turquoise">
              #domrealce
            </Badge>
            <Badge variant="outline" className="border-brand-coral/30 text-brand-coral">
              #comunicacaovisual
            </Badge>
          </div>

          {/* Partilha Social */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Partilhar esta notícia</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={partilharFacebook}
                className="text-blue-400 border-blue-400/30 hover:bg-blue-500/10"
                data-testid="button-share-facebook"
              >
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={partilharLinkedin}
                className="text-blue-300 border-blue-300/30 hover:bg-blue-500/10"
                data-testid="button-share-linkedin"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={partilharInstagram}
                className="text-pink-400 border-pink-400/30 hover:bg-pink-500/10"
                data-testid="button-share-instagram"
              >
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: noticia.titulo,
                      text: noticia.descricao.slice(0, 120),
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiado para a área de transferência!');
                  }
                }}
                className="text-gray-400 border-gray-600 hover:bg-gray-700"
                data-testid="button-share-generic"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Partilhar
              </Button>
            </div>
          </div>

          {/* CTA */}
          <Button 
            className="w-full bg-gradient-to-r from-brand-yellow to-brand-coral text-black hover:opacity-90 font-semibold shadow-lg h-12"
            size="lg"
            onClick={() => window.open('https://domrealce.com', '_blank')}
            data-testid="button-visit-website"
          >
            Visite o nosso site
          </Button>
        </div>
      </article>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
