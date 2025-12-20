import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const titleColors = [
  "text-brand-yellow",
  "text-brand-turquoise",
  "text-brand-coral",
];

// Extend Product locally to include the new DB column returned by the API
type ProductWithCategoryPath = Product & {
  category_path?: string | null;
};

export default function PortfolioSection() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<ProductWithCategoryPath[]>({
    queryKey: ["/api/products/featured"],
  });

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center">
          <div className="text-brand-yellow">Carregando produtos...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-400">
            Erro ao carregar portfolio. Tente novamente mais tarde.
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Não mostrar a secção se não há produtos
  }

  return (
    <section id="portfolio" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 scroll-animate-right">
          <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-brand-turquoise animate-pulse-brand">
              Produtos
            </span>{" "}
            <span className="text-white">de Destaque</span>
          </h3>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Conheça alguns dos nossos produtos mais procurados com qualidade
            excepcional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const href =
              product.categoryPath && product.categoryPath.trim() !== ""
                ? product.categoryPath
                : "/loja/papel-parede";

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-[#333] hover-tilt scroll-animate transform-3d"
              >
                <img
                  src={product.imagem}
                  alt={product.titulo}
                  loading="lazy"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/60 transition-all duration-300"></div>

                <div className="absolute bottom-0 left-0 p-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h4
                    className={`text-xl font-heading font-semibold mb-2 ${
                      titleColors[index % titleColors.length]
                    } group-hover:animate-pulse-brand`}
                  >
                    {product.titulo}
                  </h4>

                  <p className="text-white/80 mb-3">{product.descricao}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-brand-coral font-semibold group-hover:animate-glow">
                      {product.preco}
                    </span>

                    <Button
                      variant="link"
                      className="text-brand-turquoise hover:text-brand-turquoise transition-colors p-0 hover-lift"
                      asChild
                    >
                      <Link href={href}>Ver Mais</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
