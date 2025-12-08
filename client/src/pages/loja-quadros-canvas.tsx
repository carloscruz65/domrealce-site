import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ruler, Euro } from "lucide-react";
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
  const { data: images, isLoading, error } = useQuery({
    queryKey: ["/api/loja/images"]
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
    (images as { images: string[] })?.images
      ?.filter((path: string) =>
        path.toLowerCase().includes("quadros-em-canvas/capas-quadros-em-canvas") &&
        path.toLowerCase().endsWith(".webp")
      ) || [];
  
  const seenNames = new Set<string>();
  const canvasCovers: CanvasCover[] = canvasCoversRaw
      ?.map((path: string) => {
        const fileName =
          path.split("/").pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "") ||
          "";

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
          (images as { images: string[] })?.images?.filter((imgPath: string) => {
            const pathLower = imgPath.toLowerCase();
            if (!pathLower.includes("quadros-em-canvas/quadros-em-canvas/")) return false;
            const parts = imgPath.split("/");
            const folder = parts[3];
            return (
              folder && normalize(folder) === normalizedName &&
              /\.(jpg|jpeg|png|gif|webp)$/i.test(imgPath)
            );
          }) ?? [];

        const normalizedKey = normalize(fileName);
        if (seenNames.has(normalizedKey)) {
          return null;
        }
        seenNames.add(normalizedKey);
        
        return {
          name: displayName,
          path: `/public-objects/${path}`,
          fileName,
          canvasCount: categoryImages.length
        };
      })
      ?.filter(
        (c: (CanvasCover & { canvasCount: number }) | null): c is CanvasCover & { canvasCount: number } => 
          c !== null && c.canvasCount > 0
      ) || [];

  const handleCanvasSelect = (canvas: CanvasCover) => {
    window.location.href = `/loja/quadros-canvas/categoria/${canvas.fileName}`;
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#20B2AA] border-t-transparent rounded-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400">
            Erro ao carregar imagens
          </h2>
          <p className="text-gray-400">Tente novamente mais tarde.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEOHead
        title="Quadros em Canvas - Loja DOMREALCE"
        description="Quadros personalizados em canvas de alta qualidade."
        keywords="quadros canvas, decoração, arte"
        canonicalUrl="/loja/quadros-canvas"
      />

      <Navigation />

      <section className="bg-gradient-to-br from-[#20B2AA]/10 via-[#4169E1]/5 to-[#FF6347]/10 py-20 mt-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 text-[#20B2AA] hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à Loja
          </Link>

          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#20B2AA]">Quadros</span> em Canvas
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Arte impressa em canvas premium com tamanhos variados.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Escolha sua <span className="text-[#20B2AA]">Categoria</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {canvasCovers.map((canvas) => (
              <Card
                key={canvas.fileName}
                className="bg-[#111] border border-[#333] hover:border-[#20B2AA] transition cursor-pointer"
                onClick={() => handleCanvasSelect(canvas)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={canvas.path}
                      alt={canvas.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-white text-center mb-2 hover:text-[#20B2AA] transition-colors">
                    {canvas.name}
                  </h3>

                  <div className="text-center">
                    <Badge className="bg-[#20B2AA]/20 text-[#20B2AA]">
                      {canvas.canvasCount}{" "}
                      {canvas.canvasCount === 1 ? "opção" : "opções"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111] py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-3xl font-bold mb-10 flex items-center justify-center gap-2">
            <Ruler className="w-7 h-7 text-[#20B2AA]" />
            Tamanhos e Preços
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sizeOptions.map((option) => (
              <Card key={option.size} className="bg-[#0a0a0a] border border-[#333]">
                <CardContent className="p-4 text-center">
                  <div className="text-[#20B2AA] font-bold text-lg">
                    {option.size}cm
                  </div>
                  <div className="text-gray-400 text-sm mb-2">
                    {option.width}×{option.height}
                  </div>
                  <div className="text-[#FFD700] font-bold text-lg">
                    <Euro className="inline w-4 h-4" /> {option.price.toFixed(2)}
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
