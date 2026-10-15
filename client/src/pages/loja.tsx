import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useShopCatalog } from "@/hooks/use-shop-catalog";

const existingCategories = [
  {
    id: "papel-parede",
    name: "Papel de Parede",
    href: "/loja/papel-parede",
    image:
      "/public-objects/essenciais/1758147540061_box_amostras_prodeccor_plus_1755963100331.webp",
  },
  {
    id: "quadros-canvas",
    name: "Quadros em Canvas",
    href: "/loja/quadros-canvas",
    image: "/public-objects/essenciais/1758147537971_image_1756920896021.png",
  },
];
export default function Loja() {
  const { data: catalog, error, isLoading } = useShopCatalog();
  const categories = [
    ...existingCategories,
    ...(catalog?.categories || []).map((category) => ({
      ...category,
      href: `/loja/categoria/${category.slug}`,
    })),
  ];
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            A nossa <span className="text-[#FFD700]">Loja</span>
          </h1>
          <p className="text-xl text-gray-300">
            Escolha uma categoria, descubra os produtos e encomende online.
          </p>
          <Link
            href="/carrinho"
            className="inline-block text-[#FFD700] underline mt-5"
          >
            Ver carrinho →
          </Link>
        </header>
        <h2 className="text-2xl font-bold mb-6">Categorias disponíveis</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.id}
              className="block rounded-lg border border-[#333] hover:border-[#FFD700] bg-[#111] p-4 md:p-5"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-36 md:h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
        {isLoading && (
          <p role="status" className="mt-5">
            A carregar as restantes categorias…
          </p>
        )}
        {error && (
          <p role="alert" className="mt-5">
            Não foi possível carregar as novas categorias. Tente novamente mais
            tarde.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
