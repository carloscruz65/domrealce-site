import { lazy, Suspense } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  MessageCircle, 
  ArrowRight, 
  Car, 
  Store, 
  Palette, 
  Printer,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { Link } from "wouter";

interface GalleryImage {
  filename: string;
  url: string;
  category?: string;
}

function categorizeImage(filename: string): string {
  const pathParts = filename.split('/');
  if (pathParts.length >= 3 && pathParts[0].toLowerCase().includes('domrealce')) {
    return pathParts[2].toLowerCase();
  }
  if (pathParts.length >= 2 && pathParts[0].toLowerCase().includes('portf')) {
    return pathParts[1].toLowerCase();
  }
  return 'outros';
}

const quickServices = [
  {
    icon: <Car className="w-8 h-8" />,
    title: "Viaturas",
    description: "Rotulagem e decoração",
    href: "/servico-decoracao-viaturas",
    color: "text-brand-yellow"
  },
  {
    icon: <Store className="w-8 h-8" />,
    title: "Montras",
    description: "Espaços comerciais",
    href: "/servico-espacos-comerciais",
    color: "text-brand-turquoise"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Decoração",
    description: "Papel de parede",
    href: "/servico-papel-parede",
    color: "text-brand-coral"
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: "Impressão",
    description: "Lonas e painéis",
    href: "/servico-impressao-digital",
    color: "text-brand-yellow"
  }
];

export default function HomeV2() {
  const { data: imagesData } = useQuery({
    queryKey: ['/api/gallery/images'],
    retry: false,
  });

  const allImages: GalleryImage[] = ((imagesData as any)?.images || [])
    .slice(0, 6)
    .map((filename: string) => ({
      filename,
      url: `/public-objects/${filename}`,
      category: categorizeImage(filename),
    }));

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <SEOHead
        title="Comunicação Visual e Impressão Digital | DOMREALCE"
        description="Decoração de viaturas, montras, impressão digital e papel de parede personalizado. Peça orçamento sem compromisso."
        keywords="decoração viaturas, rotulagem, montras, impressão digital, papel de parede, Paredes, Porto"
        canonicalUrl="https://www.domrealce.com/"
      />

      <Navigation />

      <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 bg-gradient-to-b from-black via-[#0a0a0a] to-[#050505]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1 text-xs text-brand-yellow mb-4">
                <CheckCircle className="w-3 h-3" />
                <span>Orçamento gratuito e sem compromisso</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Transformamos <span className="text-brand-yellow">viaturas</span> e <span className="text-brand-turquoise">espaços</span> em comunicação visual
              </h1>

              <p className="text-lg text-gray-300 mb-6">
                Do design à aplicação final. Projetos completos para empresas no Grande Porto.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/contactos#formulario">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90 text-base"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Pedir orçamento grátis
                  </Button>
                </Link>

                <a 
                  href="https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20DOMREALCE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-base"
                  >
                    WhatsApp direto
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand-yellow" />
                  <span>Resposta em 24h</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-turquoise" />
                  <span>Grande Porto</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>+200 projetos</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10">
                <img
                  src="/public-objects/public/servicos/horto/1766771076470-ford_ranger_hortouniao.WEBP"
                  alt="Projetos DOMREALCE"
                  className="w-full aspect-[4/3] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur rounded-lg px-4 py-3 text-center">
                    <p className="text-brand-yellow font-semibold">40+ anos de experiência</p>
                    <p className="text-xs text-gray-300">Atelier próprio em Paredes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400 mb-4">O que fazemos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickServices.map((service) => (
              <Link key={service.title} href={service.href}>
                <Card className="bg-black/60 border-white/10 hover:border-brand-yellow/50 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4 text-center">
                    <div className={`${service.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}>
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-400">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Projetos <span className="text-brand-yellow">reais</span>
              </h2>
              <p className="text-gray-400 text-sm">Veja o que já fizemos</p>
            </div>
            <Link href="/portfolio">
              <Button variant="ghost" className="text-brand-yellow hover:text-brand-yellow/80">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {allImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allImages.map((image, index) => (
                <Link key={image.filename} href="/portfolio">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src={image.url}
                      alt={`Projeto DOMREALCE ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-gray-800 animate-pulse" />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/portfolio">
              <Button className="bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90">
                Ver portfólio completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gradient-to-r from-brand-yellow/10 via-[#0a0a0a] to-brand-turquoise/10 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Quer um projeto <span className="text-brand-yellow">semelhante</span>?
            </h2>
            <p className="text-gray-300 mb-6">
              Fale connosco e receba um orçamento personalizado sem compromisso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactos#formulario">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-brand-yellow text-black font-bold hover:bg-brand-yellow/90"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Pedir orçamento
                </Button>
              </Link>

              <a 
                href="https://wa.me/351930682725?text=Olá!%20Vi%20o%20vosso%20site%20e%20quero%20saber%20mais."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                >
                  Falar no WhatsApp
                </Button>
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Sem compromisso · Resposta em menos de 24 horas
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
