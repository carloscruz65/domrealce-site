import ScrollToTop from "@/components/scroll-to-top";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import SocialNewsCard from "@/components/SocialNewsCard";

// ✅ Dados agora vêm da API real!

export default function Noticias() {
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [termoPesquisa, setTermoPesquisa] = useState("");

  // Buscar notícias da API pública
  const { data: noticias = [], isLoading, error } = useQuery<News[]>({
    queryKey: ['/api/news/all']
  });

  // Gerar categorias dinamicamente dos dados da API
  const categorias = ["Todas", ...Array.from(new Set(noticias.map(n => n.categoria)))];

  const [noticiasFiltradas, setNoticiasFiltradas] = useState<News[]>([]);

  // Filtrar notícias quando carregam ou filtros mudam
  useEffect(() => {
    filtrarNoticias();
  }, [noticias, filtroCategoria, termoPesquisa]);

  // Filtrar notícias
  const filtrarNoticias = () => {
    if (!noticias?.length) return;

    let resultado = noticias;

    // Filtro por categoria
    if (filtroCategoria !== "Todas") {
      resultado = resultado.filter(noticia => noticia.categoria === filtroCategoria);
    }

    // Filtro por termo de pesquisa
    if (termoPesquisa) {
      resultado = resultado.filter(noticia => 
        noticia.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        noticia.descricao.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
    }

    setNoticiasFiltradas(resultado);
  };

  // Partilhar nas redes sociais
  const partilharFacebook = (noticia: News) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href + '#' + noticia.id)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const partilharInstagram = () => {
    // Instagram não permite partilha directa por URL, mostra instrução
    alert('Para partilhar no Instagram, tire uma captura de ecrã desta página e publique na sua conta @domrealce');
  };

  const partilharLinkedin = (noticia: News) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href + '#' + noticia.id)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  // Aplicar filtros quando mudarem
  useEffect(() => {
    filtrarNoticias();
  }, [filtroCategoria, termoPesquisa]);

  // Atualizar meta tags Open Graph para redes sociais
  useEffect(() => {
    if (noticias.length > 0) {
      const primeiraNoticia = noticias[0];
      const imagemNoticia = primeiraNoticia.imagens?.[0] || primeiraNoticia.imagem || '';
      
      // Atualizar meta tags Open Graph
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      const updateMetaName = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Open Graph tags
      updateMetaTag('og:title', 'Notícias DOMREALCE - Projectos de Comunicação Visual');
      updateMetaTag('og:description', primeiraNoticia.descricao.slice(0, 160));
      updateMetaTag('og:image', imagemNoticia);
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:type', 'article');

      // Twitter tags
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', 'Notícias DOMREALCE - Projectos de Comunicação Visual');
      updateMetaName('twitter:description', primeiraNoticia.descricao.slice(0, 160));
      updateMetaName('twitter:image', imagemNoticia);

      // Atualizar título da página
      document.title = 'Notícias e Novidades | DOMREALCE Lisboa';
    }
  }, [noticias]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-yellow/10 via-brand-turquoise/5 to-brand-coral/10 py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Notícias</span> & <span className="text-brand-turquoise">Projectos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Descubra os nossos trabalhos mais recentes, projetos históricos e as últimas tendências em comunicação visual
            </p>
          </div>
        </div>
      </section>

      {/* Filtros e Pesquisa */}
      <section className="pt-0 pb-4 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Pesquisar notícias..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>

              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'resultado' : 'resultados'}
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Notícias */}
      <section className="pt-0 pb-8">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand-turquoise" />
              <span className="ml-2 text-muted-foreground">A carregar notícias...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-destructive mb-2">Erro ao carregar notícias</h3>
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar as notícias. Tente recarregar a página.
                </p>
              </div>
            </div>
          )}

          {/* Lista de Notícias - Grid de 4 Colunas */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {noticiasFiltradas.map((noticia) => (
                  <SocialNewsCard
                    key={noticia.id}
                    noticia={noticia}
                    onShare={(platform) => {
                      if (platform === 'facebook') partilharFacebook(noticia);
                      else if (platform === 'instagram') partilharInstagram();
                      else if (platform === 'linkedin') partilharLinkedin(noticia);
                    }}
                  />
                ))}
              </div>

              {/* Mensagem quando não há resultados */}
              {noticiasFiltradas.length === 0 && (
                <div className="text-center py-16 col-span-full">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-heading font-semibold mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros ou termo de pesquisa
                  </p>
                  <Button 
                    onClick={() => {
                      setFiltroCategoria("Todas");
                      setTermoPesquisa("");
                    }}
                    className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </>
        )}
        </div>
      </section>

      {/* Paginação - Parte Inferior da Página */}
      {!isLoading && !error && noticiasFiltradas.length > 0 && (
        <section data-scroll className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-4">
              <Button variant="outline" disabled className="border-gray-700 text-gray-400">
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="default" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
                  1
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                  2
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                  3
                </Button>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Próxima
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section data-scroll className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Tem um projeto em mente?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Vamos criar algo extraordinário juntos. Contacte-nos para discutir o seu próximo projeto.
          </p>
          <Button 
            size="lg" 
            className="bg-brand-turquoise text-white hover:bg-brand-turquoise/90"
            onClick={() => window.location.href = '/contactos#formulario'}
          >
            Pedir Orçamento
          </Button>
        </div>
      </section>

      <ScrollToTop />
      <Footer />
    </div>
  );
}