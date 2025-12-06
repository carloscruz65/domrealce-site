import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";

const categoryColors = ["bg-brand-yellow text-black", "bg-brand-turquoise text-black", "bg-brand-coral text-white"];
const titleHoverColors = ["hover:text-brand-yellow", "hover:text-brand-turquoise", "hover:text-brand-coral"];

export default function NewsSection() {
  const { data: news = [], isLoading, error } = useQuery<News[]>({
    queryKey: ["/api/news/recent"]
  });

  if (isLoading) {
    return (
      <section id="noticias" className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-coral">Carregando notícias...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="noticias" className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-400">Erro ao carregar notícias. Tente novamente mais tarde.</div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null; // Não mostrar a secção se não há notícias
  }

  return (
    <section id="noticias" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate">
          <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-coral animate-pulse-brand">Notícias</span> <span className="text-white">Mais Recentes</span>
          </h3>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Fique por dentro das últimas novidades e tendências em comunicação visual
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <article 
              key={article.id} 
              className="bg-[#0a0a0a] border border-[#333] rounded-2xl overflow-hidden hover-lift transform-3d scroll-animate hover-tilt cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={article.imagem} 
                  alt={article.titulo} 
                  loading="lazy"
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className={`${categoryColors[index % categoryColors.length]} px-3 py-1 rounded-full text-sm font-semibold animate-bounce-subtle`}>
                    {article.categoria}
                  </span>
                  <span className="text-white/60 text-sm ml-3">
                    {new Date(article.data || article.createdAt!).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h4 className={`text-xl font-heading font-semibold mb-3 text-white ${titleHoverColors[index % titleHoverColors.length]} transition-colors cursor-pointer hover:animate-pulse-brand`}>
                  {article.titulo}
                </h4>

                <p className="text-white/80 mb-4">
                  {article.descricao.length > 200
                    ? `${article.descricao.slice(0, 200)}…`
                    : article.descricao}
                </p>

                <Button 
                  asChild
                  variant="link" 
                  className="text-brand-turquoise hover:text-brand-turquoise font-semibold transition-colors p-0 hover-lift group"
                >
                  <Link href={`/noticias#${article.id}`}>
                    Ler mais <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12 scroll-animate">
          <Button 
            asChild
            variant="outline" 
            className="px-8 py-3 border-2 border-brand-coral text-brand-coral font-heading font-semibold rounded-lg hover:bg-brand-coral hover:text-white hover-lift transition-all duration-300 animate-bounce-subtle"
          >
            <Link href="/noticias">Ver Todas as Notícias</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
