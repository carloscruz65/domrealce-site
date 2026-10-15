import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopCatalog } from "@/hooks/use-shop-catalog";
import { useToast } from "@/hooks/use-toast";
import { quoteShopCart } from "@shared/shop-pricing";
import { SEOHead } from "@/components/seo-head";
const euro = (amount: number) =>
  amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });

export default function LojaCatalogo() {
  const { slug } = useParams();
  const detail = window.location.pathname.startsWith("/loja/produto/");
  const { data, isLoading, error, refetch } = useShopCatalog();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    setQuantity(null);
    setAdded(false);
  }, [slug, detail]);
  const product = detail
    ? data?.products.find((p) => p.slug === slug)
    : undefined;
  const category = data?.categories.find((c) =>
    detail ? c.id === product?.categoryId : c.slug === slug,
  );
  const [busy, setBusy] = useState(false);
  const add = async () => {
    if (!product) return;
    setBusy(true);
    try {
      const current = await refetch();
      if (!current.data || current.error)
        throw new Error(
          "Não foi possível confirmar o produto. Tente novamente.",
        );
      const q = quantity ?? product.minimumQuantity;
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(cart))
        throw new Error("O carrinho não pôde ser aberto.");
      if (cart.length >= 100)
        throw new Error("O carrinho atingiu o limite de 100 artigos.");
      const quoted = quoteShopCart(
        [
          {
            id: crypto.randomUUID(),
            type: "produto",
            shopProductId: product.id,
            quantidade: q,
          },
        ],
        current.data,
        "pickup",
      );
      // Separate lines preserve minimum/step rules when the same product is added twice.
      localStorage.setItem("cart", JSON.stringify([...cart, ...quoted.items]));
      window.dispatchEvent(new Event("cartUpdated"));
      setAdded(true);
      toast({
        title: "Adicionado ao carrinho",
        description: `${q} × ${product.name}`,
      });
    } catch (err) {
      toast({
        title: "Não foi possível adicionar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-6">
        <Link href="/loja" className="text-[#FFD700] underline">
          ← Continuar a comprar
        </Link>
        {isLoading ? (
          <p role="status">A carregar…</p>
        ) : error ? (
          <p role="alert">
            Não foi possível carregar a loja. Tente novamente mais tarde.
          </p>
        ) : !category || (detail && !product) ? (
          <>
            <h1 className="text-3xl font-bold">Artigo indisponível</h1>
            <p>
              Este artigo ou categoria já não está disponível. Pode continuar a
              comprar na loja.
            </p>
          </>
        ) : (
          <>
            <SEOHead
              title={`${product?.name || category.name}`}
              description={product?.description || category.description}
            />
            {product ? (
              <div className="grid md:grid-cols-2 gap-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-h-[560px] object-contain rounded-lg bg-[#111]"
                />
                <div className="space-y-5">
                  <Link
                    href={`/loja/categoria/${category.slug}`}
                    className="text-[#FFD700]"
                  >
                    {category.name}
                  </Link>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <p className="whitespace-pre-wrap text-gray-300">
                    {product.description}
                  </p>
                  <p className="whitespace-pre-wrap">
                    {product.specifications}
                  </p>
                  <p className="text-3xl font-bold text-[#FFD700]">
                    {euro(Math.round(product.priceCents * 1.23) / 100)}{" "}
                    <span className="text-base text-gray-300">
                      / {product.unit} · IVA incluído
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    {euro(product.priceCents / 100)} sem IVA. Portes calculados
                    no carrinho.
                  </p>
                  <label className="block space-y-2">
                    Quantidade de{" "}
                    {product.unit === "conjunto" ? "conjuntos" : "unidades"}
                    <Input
                      type="number"
                      className="w-36"
                      min={product.minimumQuantity}
                      step={product.quantityStep}
                      value={quantity ?? product.minimumQuantity}
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                        setAdded(false);
                      }}
                    />
                  </label>
                  <p className="text-sm text-gray-400">
                    Mínimo: {product.minimumQuantity}. Incrementos de{" "}
                    {product.quantityStep}.
                  </p>
                  <Button
                    disabled={busy}
                    className="bg-[#FFD700] text-black hover:bg-[#e6c200] w-full"
                    onClick={add}
                  >
                    {busy ? "A confirmar…" : "Adicionar ao carrinho"}
                  </Button>
                  {added && (
                    <div
                      role="status"
                      className="border border-[#FFD700] rounded p-4 space-y-3"
                    >
                      <p>Produto adicionado.</p>
                      <Link
                        href="/carrinho"
                        className="block text-[#FFD700] underline"
                      >
                        Ver carrinho e finalizar compra →
                      </Link>
                      <Link href="/loja" className="block underline">
                        Continuar a comprar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="whitespace-pre-wrap text-gray-300">
                  {category.description}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data!.products
                    .filter((p) => p.categoryId === category.id)
                    .map((p) => (
                      <Link
                        href={`/loja/produto/${p.slug}`}
                        key={p.id}
                        className="block rounded-lg border border-[#333] hover:border-[#FFD700] bg-[#111] p-4 space-y-3"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-56 object-contain rounded"
                        />
                        <h2 className="text-xl font-semibold">{p.name}</h2>
                        <p className="text-[#FFD700]">
                          {euro(Math.round(p.priceCents * 1.23) / 100)} /{" "}
                          {p.unit}
                        </p>
                        <p className="text-xs text-gray-400">IVA incluído</p>
                        <span className="block underline">Ver produto →</span>
                      </Link>
                    ))}
                </div>
                {!data!.products.some((p) => p.categoryId === category.id) && (
                  <p>Ainda não há produtos disponíveis nesta categoria.</p>
                )}
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
