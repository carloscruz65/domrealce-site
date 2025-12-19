import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import SocialNewsCard from "@/components/SocialNewsCard";

export default function Noticias() {
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const { data: noticias = [], isLoading, error } = useQuery<News[]>({
    queryKey: ["/api/news/all"],
  });

  const categorias = useMemo(() => {
    const raw = noticias
      .map((n) => (n.categoria || "").trim())
      .filter(Boolean);

    return ["Todas", ...Array.from(new Set(raw))];
  }, [noticias]);

  const noticiasFiltradas = useMemo(() => {
    if (!noticias?.length) return [];

    let resultado = noticias;

    if (filtroCategoria !== "Todas") {
      resultado = resultado.filter(
        (n) => (n.categoria || "").trim() === filtroCategoria
      );
    }

    if (termoPesquisa.trim()) {
      const q = termoPesquisa.toLowerCase();
      resultado = resultado.filter((n) => {
        const titulo = (n.titulo || "").toLowerCase();
        const desc = (n.descricao || "").toLowerCase();
        return titulo.includes(q) || desc.includes(q);
      });
    }

    return resultado;
  }, [noticias, filtroCategoria, termoPesquisa]);

  // Meta tags genéricas para listagem (não "article")
  useEffect(() => {
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = "Notícias / Projetos | DOMREALCE";
    const description =
      "Projetos reais e prova de trabalho: processo, decisões técnicas e resultado final. Comunicação visual, impressão e aplicação.";

    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:url", url);
    updateMetaTag("og:type", "website");

    updateMetaName("twitter:card", "summary_large_image");
    updateMetaName("twitter:title", title);
    updateMetaName("twitter:description", description);

    document.title = title;
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-yellow/10 via-brand-turquoise/5 to-brand-coral/10 py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Notícias</span> &{" "}
              <span className="text-brand-turquoise">Projetos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Trabalhos reais com contexto técnico: maquete, produção, aplicação e resultado.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="pt-0 pb-4 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="Pesquisar por título ou contexto técnico..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>

              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full sm:w-56">
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
              {noticiasFiltradas.length}{" "}
              {noticiasFiltradas.length === 1 ? "resultado" : "resultados"}
            </div>
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="pt-0 pb-8">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand-turquoise" />
              <span className="ml-2 text-muted-foreground">
                A carregar notícias...
              </span>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-destructive mb-2">
                  Erro ao carregar notícias
                </h3>
                <p className="text-sm text-muted-foreground">
                  Não foi possível carregar as notícias. Tente recarregar a página.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {noticiasFiltradas.map((noticia) => (
                  <SocialNewsCard key={noticia.id} noticia={noticia} />
                ))}
              </div>

              {noticiasFiltradas.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-heading font-semibold mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ajuste os filtros ou o termo de pesquisa.
                  </p>
                  <Button
                    onClick={() => {
                      setFiltroCategoria("Todas");
                      setTermoPesquisa("");
                    }}
                    className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90"
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA discreto */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Precisa de orçamento ou análise técnica?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Envie fotos, medidas aproximadas e prazos. Respondemos com proposta técnica e próximos passos.
          </p>
          <Button
            size="lg"
            className="bg-brand-turquoise text-white hover:bg-brand-turquoise/90"
            onClick={() => (window.location.href = "/contactos#formulario")}
          >
            Falar connosco
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}