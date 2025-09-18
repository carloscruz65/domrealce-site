import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Share2, Facebook, Instagram, Linkedin, Search, Filter, Eye, Heart, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";

// ✅ Dados agora vêm da API real!

export default function Noticias() {
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [termoPesquisa, setTermoPesquisa] = useState("");

  // Buscar notícias da API
  const { data: noticias = [], isLoading, error } = useQuery<News[]>({
    queryKey: ['/api/admin/noticias'],
    select: (data: any) => data.noticias || data
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

          {/* Lista de Notícias */}
          {!isLoading && !error && (
            <div className="grid gap-8">
              {noticiasFiltradas.map((noticia) => (
                <Card key={noticia.id} className="overflow-hidden hover-lift border-border bg-card">
                <div className="md:flex">
                  {/* Imagem */}
                  <div className="md:w-1/3">
                    <div className="aspect-video md:aspect-square bg-muted relative overflow-hidden">
                      <img 
                        src={noticia.imagem} 
                        alt={noticia.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 via-transparent to-brand-turquoise/20"></div>
                      {/* Badge de destaque */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-brand-coral text-white font-semibold">🔥 NOVO</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20">
                          {noticia.categoria}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {Math.floor(Math.random() * 50) + 1}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            {Math.floor(Math.random() * 10)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {Math.floor(Math.random() * 5)}
                          </div>
                        </div>
                      </div>

                      <CardTitle className="text-2xl mb-2 hover:text-brand-turquoise transition-colors cursor-pointer">
                        {noticia.titulo}
                      </CardTitle>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {noticia.data ? new Date(noticia.data).toLocaleDateString('pt-PT') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          Equipa DOMREALCE
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <CardDescription className="text-base mb-4 leading-relaxed">
                        {noticia.descricao.slice(0, 150)}...
                      </CardDescription>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          #{noticia.categoria.toLowerCase()}
                        </Badge>
                      </div>

                      {/* Acções */}
                      <div className="flex items-center justify-between">
                        <Button 
                          asChild
                          variant="outline" 
                          className="border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white font-semibold shadow-sm"
                        >
                          <Link href="/servicos">
                            🌟 Descobrir Agora
                          </Link>
                        </Button>

                        {/* Partilha Social */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground mr-2">Partilhar:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => partilharFacebook(noticia)}
                            className="text-blue-600 hover:bg-blue-600/10"
                          >
                            <Facebook size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={partilharInstagram}
                            className="text-pink-600 hover:bg-pink-600/10"
                          >
                            <Instagram size={16} />
                          </Button>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => partilharLinkedin(noticia)}
                            className="text-blue-700 hover:bg-blue-700/10"
                          >
                            <Linkedin size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.share?.({
                              title: noticia.titulo,
                              text: noticia.descricao.slice(0, 100),
                              url: window.location.href + '#' + noticia.id
                            })}
                            className="text-muted-foreground hover:bg-muted"
                          >
                            <Share2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}

            {/* Mensagem quando não há resultados */}
            {noticiasFiltradas.length === 0 && (
            <div className="text-center py-16">
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

            {/* Paginação (simulada) */}
            {noticiasFiltradas.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <Button variant="outline" disabled>Anterior</Button>
              <div className="flex gap-2">
                <Button variant="default" className="bg-brand-yellow text-brand-dark">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
              </div>
              <Button variant="outline">Próxima</Button>
            </div>
          )}
          </div>
        )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-black">
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

      <Footer />
    </div>
  );
}