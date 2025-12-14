import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceGallery from "@/components/service-gallery";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Car, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Truck,
  Bike,
  Bus,
  Settings,
  Shield
} from "lucide-react";

const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    alt: "Carrinha comercial com decoração em vinil",
    title: "Decoração de Frotas Comerciais"
  },
  {
    src: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
    alt: "Viatura de competição com autocolantes de patrocinadores",
    title: "Viaturas de Competição"
  },
  {
    src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?w=800&q=80",
    alt: "Processo de instalação de vinil em viatura",
    title: "Instalação Profissional"
  }
];

export default function ServicoDecoracaoViaturas() {
  const { data: galleryData } = useQuery<{images: typeof defaultImages}>({
    queryKey: ["/api/service-galleries", "decoracao-viaturas"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  const vehicleTypes = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Viaturas particulares",
      description: "Personalização completa de carros pessoais.",
      features: ["Mudança de cor", "Proteção da pintura", "Designs personalizados", "Efeitos especiais"]
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Veículos comerciais",
      description: "Publicidade móvel para o seu negócio.",
      features: ["Branding empresarial", "Informações de contacto", "Promoções", "Logótipos"]
    },
    {
      icon: <Bus className="w-8 h-8" />,
      title: "Frotas e autocarros",
      description: "Decoração uniforme para toda a frota.",
      features: ["Identidade visual", "Aplicação em série", "Manutenção", "Renovação"]
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Motociclos",
      description: "Personalização de motos e scooters.",
      features: ["Designs únicos", "Proteção", "Detalhes especiais", "Wrapping parcial"]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Máquinas e equipamentos",
      description: "Identificação de maquinaria industrial.",
      features: ["Logótipos", "Sinalização de segurança", "Numeração", "Cores corporativas"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Proteção PPF",
      description: "Películas de proteção para a pintura.",
      features: ["Anti-risco", "Anti-pedra", "Proteção UV", "Acabamento invisível"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Consulta inicial",
      description: "Avaliação da viatura e definição do projeto personalizado."
    },
    {
      step: "02", 
      title: "Design e aprovação",
      description: "Criação do design e visualização do resultado final."
    },
    {
      step: "03",
      title: "Preparação da viatura", 
      description: "Limpeza profunda e preparação das superfícies."
    },
    {
      step: "04",
      title: "Aplicação especializada",
      description: "Instalação por técnicos especializados com ferramentas profissionais."
    },
    {
      step: "05",
      title: "Controlo de qualidade",
      description: "Inspeção final e orientações de manutenção."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        badge="Decoração de viaturas"
        badgeIcon={<Car className="w-4 h-4" />}
        title="Decoração de viaturas - wrapping e publicidade móvel"
        subtitle="Transforme a sua viatura"
        description="Especialistas em car wrapping e decoração de viaturas. Desde mudanças de cor completas até publicidade móvel para o seu negócio, com qualidade profissional garantida."
        imageSrc="/public-objects/servicos/decoracao-viaturas.webp"
        imageAlt="Decoração de Viaturas DOMREALCE"
        primaryCta={{ text: "Transformar a minha viatura", href: "/contactos#formulario" }}
      />

      <section className="pt-8 pb-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Tipos de</span>{" "}
              <span className="text-white">veículos</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Especializados em todos os tipos de veículos, desde carros particulares até grandes frotas comerciais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <Card
                key={index}
                className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">
                    {vehicle.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {vehicle.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{vehicle.description}</p>
                  <div className="space-y-2">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <ServiceGallery
        images={galleryImages}
        title="Exemplos de decoração de viaturas"
        description="Alguns projetos de decoração de viaturas realizados para diferentes tipos de clientes."
        columns={3}
      />

      <section className="py-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Processo</span>{" "}
              <span className="text-white">de trabalho</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Um processo estruturado para garantir resultados perfeitos em cada projeto.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border-2 border-brand-yellow flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-yellow font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Especificações</span>{" "}
                  <span className="text-white">técnicas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Utilizamos materiais de primeira qualidade e técnicas profissionais 
                  para garantir resultados duradouros.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Vinil cast de alta qualidade</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Durabilidade 5-7 anos exterior</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Resistente a UV e intempéries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Remoção sem danificar pintura</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">Aplicação por técnicos certificados</span>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Qualidade garantida
                  </h3>
                  <p className="text-gray-400">
                    Garantia de satisfação em todos os trabalhos.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400">Marcas utilizadas</span>
                    <span className="text-white font-medium">3M, Avery, Oracal</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400">Garantia</span>
                    <span className="text-white font-medium">2-5 anos</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-400">Tempo de aplicação</span>
                    <span className="text-white font-medium">1-5 dias</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-400">Acabamentos</span>
                    <span className="text-white font-medium">Mate, brilho, carbono</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para transformar a sua</span>{" "}
            <span className="text-brand-yellow">viatura?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contacto e descubra como podemos dar uma nova vida 
            à sua viatura com decoração profissional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
            >
              <Link href="/contactos#formulario">
                Solicitar orçamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
            >
              <a
                href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20decoração%20de%20viaturas."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp direto
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
