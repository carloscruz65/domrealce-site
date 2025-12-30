import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ruler, Euro, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";

interface CanvasCover {
  name: string;
  path: string;
  fileName: string;
  canvasCount?: number;
}

interface SizeOption {
  size: string;
  width: number;
  height: number;
  price: number;
}

const sizeOptions: SizeOption[] = [
  { size: "20x30", width: 20, height: 30, price: 25.0 },
  { size: "30x40", width: 30, height: 40, price: 35.0 },
  { size: "40x50", width: 40, height: 50, price: 45.0 },
  { size: "50x70", width: 50, height: 70, price: 65.0 },
  { size: "60x80", width: 60, height: 80, price: 85.0 },
  { size: "70x100", width: 70, height: 100, price: 125.0 },
  { size: "80x120", width: 80, height: 120, price: 165.0 },
  { size: "100x150", width: 100, height: 150, price: 245.0 },
];

export default function LojaQuadrosCanvas() {
  const {
    data: images,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/loja/images"],
  });

  const displayNameOverrides: Record<string, string> = {
    Marmore_geometrico: "Mármore Geométrico",
    Textura_marmore: "Textura Mármore",
    Geometrico_Minimalista: "Geométrico Minimalista",
    Animais_Cores: "Animais Cores",
    Plantas_abstratas: "Plantas Abstratas",
    Arte_ContemporâNea: "Arte Contemporânea",
    Geométricos: "Geométricos",
    Leoes: "Leões",
  };

  const canvasCoversRaw =
    (images as { images: string[] })?.images?.filter(
      (path: string) =>
        path
          .toLowerCase()
          .includes("quadros-em-canvas/capas-quadros-em-canvas") &&
        path.toLowerCase().endsWith(".webp"),
    ) || [];

  const seenNames = new Set<string>();

  const canvasCovers: CanvasCover[] =
    canvasCoversRaw
      ?.map((path: string) => {
        const fileName =
          path
            .split("/")
            .pop()
            ?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "") || "";

        const displayName =
          displayNameOverrides[fileName] ||
          fileName
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase());

        const normalize = (s: string) =>
          s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        const normalizedName = normalize(fileName);

        const categoryImages =
          (images as { images: string[] })?.images?.filter(
            (imgPath: string) => {
              const pathLower = imgPath.toLowerCase();
              if (!pathLower.includes("quadros-em-canvas/quadros-em-canvas/"))
                return false;

              const parts = imgPath.split("/");
              const folder = parts[3]; // mantém a tua lógica
              return (
                folder &&
                normalize(folder) === normalizedName &&
                /\.(jpg|jpeg|png|gif|webp)$/i.test(imgPath)
              );
            },
          ) ?? [];

        const normalizedKey = normalize(fileName);
        if (seenNames.has(normalizedKey)) return null;
        seenNames.add(normalizedKey);

        return {
          name: displayName,
          path: `/public-objects/${path}`,
          fileName,
          canvasCount: categoryImages.length,
        };
      })
      ?.filter(
        (
          c: (CanvasCover & { canvasCount: number }) | null,
        ): c is CanvasCover & { canvasCount: number } =>
          c !== null && c.canvasCount > 0,
      ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-16">
        <Navigation />
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">
              Erro ao carregar imagens
            </div>
            <p className="text-gray-300 mb-8">Tente novamente mais tarde.</p>
            <Link href="/loja">
              <Button
                variant="outline"
                className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Loja
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title="Quadros em Canvas - Loja DOMREALCE"
        description="Quadros em canvas premium, com categorias e tamanhos variados. Também fazemos telas artísticas personalizadas."
        keywords="quadros canvas, telas artísticas, decoração, arte, domrealce"
        canonicalUrl="/loja/quadros-canvas"
      />

      <Navigation />

      {/* ✅ HEADER IGUAL AO PAPEL DE PAREDE */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/loja">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar à Loja
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Quadros em <span className="text-[#FFD700]">Canvas</span>
          </h1>

          <p className="text-gray-300 text-lg">
            Escolha uma categoria e descubra opções com tamanhos variados.
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Se não encontrar o quadro ideal,&nbsp;
            <Link
              href="/servico-telas-artisticas#orcamento"
              className="inline-flex items-center gap-1 text-[#FFD700] font-medium hover:underline underline-offset-4"
            >
              visite o nosso serviço de Telas Artísticas personalizadas
              <ArrowUpRight className="h-3 w-3 translate-y-[1px]" />
            </Link>
          </p>

          <p className="text-gray-500 text-sm mt-3 max-w-3xl">
            Impressão profissional em canvas premium, montado manualmente em
            chassi de madeira no nosso atelier.
          </p>
        </div>
      </div>

      {/* Categorias */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Escolha sua <span className="text-[#FFD700]">Categoria</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {canvasCovers.map((canvas) => (
              <Link
                key={canvas.fileName}
                href={`/loja/quadros-canvas/categoria/${canvas.fileName}`}
                className="block"
              >
                <Card className="bg-[#111] border border-[#333] hover:border-[#FFD700] transition cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg overflow-hidden mb-4">
                      <img
                        src={canvas.path}
                        alt={canvas.name}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-white text-center mb-2 hover:text-[#20B2AA] transition-colors">
                      {canvas.name}
                    </h3>

                    <div className="text-center">
                      <Badge className="bg-[#FFD700]/20 text-[#FFD700]">
                        {canvas.canvasCount}{" "}
                        {canvas.canvasCount === 1 ? "opção" : "opções"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tamanhos e Preços */}
      <section className="bg-[#111] py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-3xl font-bold mb-10 flex items-center justify-center gap-2">
            <Ruler className="w-7 h-7 text-[#FFD700]" />
            Tamanhos e Preços
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sizeOptions.map((option) => (
              <Card
                key={option.size}
                className="bg-[#0a0a0a] border border-[#333]"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-[#FFD700] font-bold text-lg">
                    {option.size}cm
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {option.width}×{option.height}
                  </div>
                  <div className="text-[#FFD700] font-bold text-lg">
                    <Euro className="inline w-4 h-4" />{" "}
                    {option.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">+ IVA (23%)</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
