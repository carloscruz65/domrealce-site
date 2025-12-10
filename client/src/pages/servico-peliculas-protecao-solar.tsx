import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sun,
  Thermometer,
  Eye,
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";

// Imagens padrão da galeria (habitações, lojas, escritórios, armazéns)
const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    alt: "Sala com janelas amplas e luz natural controlada",
    title: "Conforto térmico em habitações",
  },
  {
    src: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&q=80",
    alt: "Montra de loja com proteção solar",
    title: "Lojas e montras protegidas",
  },
  {
    src: "https://images.unsplash.com/photo-1529421308262-f81441e4594a?w=800&q=80",
    alt: "Escritório moderno com grandes superfícies envidraçadas",
    title: "Escritórios com menos encandeamento",
  },
  {
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
    alt: "Zona de estar com janelas de grande dimensão",
    title: "Proteção UV em casa",
  },
  {
    src: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
    alt: "Apartamento com vista e vidro protegido",
    title: "Mais conforto sem obras",
  },
  {
    src: "https://images.unsplash.com/photo-1529421308262-f81441e4594a?w=800&q=80",
    alt: "Edifício com fachadas envidraçadas",
    title: "Aplicações em edifícios e espaços comerciais",
  },
];

export default function ServicoPeliculasProtecaoSolar() {
  // Só para vidros de habitações / lojas / armazéns – nada de viaturas
  const benefits = [
    {
      icon: Sun,
      title: "Proteção UV",
      description:
        "Bloqueia até 99% dos raios ultravioleta nocivos, ajudando a proteger móveis, pavimentos e tecidos do desbotamento.",
    },
    {
      icon: Thermometer,
      title: "Controlo térmico",
      description:
        "Reduz o calor que entra pela janela, ajudando a manter o interior mais fresco e confortável.",
    },
    {
      icon: Eye,
      title: "Privacidade",
      description:
        "Permite ver para fora, reduzindo a visibilidade do exterior para o interior, consoante a película escolhida.",
    },
    {
      icon: Shield,
      title: "Segurança",
      description:
        "Ajuda a manter o vidro coeso em caso de quebra, reduzindo o risco de estilhaços soltos.",
    },
  ];

  const applications = [
    {
      title: "Habitações",
      description:
        "Melhor conforto térmico e proteção UV em janelas de casas e apartamentos.",
      examples: ["Salas de estar", "Quartos", "Marquises", "Portas envidraçadas"],
    },
    {
      title: "Lojas e montras",
      description:
        "Protege produtos do sol e melhora o conforto de clientes e colaboradores.",
      examples: ["Montras comerciais", "Portas de entrada", "Salas de exposição"],
    },
    {
      title: "Escritórios",
      description:
        "Reduz o encandeamento em ecrãs e melhora o ambiente de trabalho.",
      examples: ["Open-spaces", "Salas de reunião", "Receções"],
    },
    {
      title: "Armazéns e pavilhões",
      description:
        "Ajuda a controlar o calor em zonas envidraçadas de grandes espaços.",
      examples: [
        "Zonas administrativas",
        "Portas envidraçadas",
        "Claraboias laterais (quando aplicável)",
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Avaliação no local",
      description:
        "Analisamos o tipo de vidro, a exposição solar e as necessidades específicas do espaço.",
    },
    {
      step: "02",
      title: "Escolha da película",
      description:
        "Aconselhamos a película mais adequada (tonalidade, nível de proteção, privacidade, etc.).",
    },
    {
      step: "03",
      title: "Preparação dos vidros",
      description:
        "Limpeza cuidada e preparação da superfície para uma aplicação perfeita.",
    },
    {
      step: "04",
      title: "Aplicação profissional",
      description:
        "Instalação por técnicos especializados, com garantia de um acabamento sem bolhas.",
    },
    {
      step: "05",
      title: "Verificação e garantia",
      description:
        "Inspeção final, explicação de cuidados após aplicação e garantia do serviço.",
    },
  ];

  const specsLeft = [
    { label: "Proteção UV", value: "até 99%" },
    { label: "Redução de calor", value: "até ~60% (dependendo da película)" },
    {
      label: "Garantia",
      value: "até 5 anos, consoante o modelo",
    },
    {
      label: "Tipo de aplicação",
      value: "interior (mais comum) ou exterior em casos específicos",
    },
  ];

  const specsRight = [
    {
      label: "Tonalidades disponíveis",
      value: "escura, média, clara e quase incolor",
    },
    {
      label: "Privacidade",
      value: "de baixa a elevada – ajustada ao projeto",
    },
    {
      label: "Compatibilidade",
      value: "vidros simples e duplos (a confirmar em avaliação)",
    },
    {
      label: "Manutenção",
      value: "limpeza simples com produtos não abrasivos",
    },
  ];

  // Galeria: tenta ir buscar imagens ao backend, senão usa as default
  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "peliculas-protecao-solar"],
  });

  const galleryImages = galleryData?.images || defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        badge="Películas de proteção solar"
        badgeIcon={<Sun className="w-4 h-4" />}
        title="Películas de proteção solar e segurança"
        subtitle="Para casas, lojas e espaços comerciais"
        description="Aplicação profissional de películas solares em vidros de habitações, lojas, escritórios e armazéns. Mais conforto térmico, proteção UV e privacidade, sem obras."
        imageSrc="/public-objects/servicos/peliculas-solar-protecao.webp"
        imageAlt="Películas de Proteção Solar DOMREALCE"
        primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
      />

      {/* Benefícios */}
      <section className="pt-8 pb-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Benefícios</span>{" "}
              <span className="text-white">principais</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              As películas de proteção solar melhoram o conforto, ajudam a reduzir
              custos de energia e protegem o interior dos seus espaços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-brand-yellow" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galeria de trabalhos */}
      <ServiceGallery
        title="Exemplos de aplicações"
        description="Alguns projetos de aplicação de películas de proteção solar em habitações, lojas, escritórios e outros espaços comerciais."
        images={galleryImages}
        columns={3}
      />

      {/* Aplicações ideais */}
      <section className="pt-8 pb-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Aplicações</span>{" "}
              <span className="text-brand-yellow">ideais</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Películas solares para todo o tipo de espaços envidraçados — sempre
              fora do contexto automóvel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applications.map((app, index) => (
              <Card
                key={index}
                className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                    {app.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{app.description}</p>
                  <span className="text-sm text-gray-500 mb-2 block">
                    Exemplos:
                  </span>
                  <div className="space-y-1">
                    {app.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                        <span className="text-sm text-gray-300">{ex}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-16 bg-gray-900/40 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Processo</span>{" "}
              <span className="text-brand-yellow">profissional</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Um processo simples, pensado para causar o mínimo de incómodo no seu
              dia a dia.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {process.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-yellow text-black flex items-center justify-center font-semibold text-sm">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Especificações / Qualidade */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="text-brand-yellow">Especificações</span>{" "}
                  <span className="text-white">técnicas</span>
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Trabalhamos com películas de fabricantes reconhecidos, com
                  diferentes tonalidades e níveis de proteção, adaptados a cada
                  projeto.
                </p>
                <div className="space-y-4">
                  {specsLeft.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                      <span className="text-white">
                        <strong className="text-gray-300">
                          {item.label}:
                        </strong>{" "}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black rounded-2xl p-8 border border-gray-800">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-2 text-white">
                    Qualidade e confiança
                  </h3>
                  <p className="text-gray-400">
                    Aplicação profissional com garantia e acompanhamento
                    pós-venda.
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  {specsRight.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-4"
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <span className="text-brand-yellow font-semibold text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            <span className="text-white">Pronto para melhorar os seus</span>{" "}
            <span className="text-brand-yellow">vidros?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Envie-nos as dimensões aproximadas e o tipo de espaço. A nossa equipa
            ajuda a escolher a película certa e apresenta um orçamento ajustado ao
            seu projeto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
            >
              <Link href="/contactos#formulario">
                Pedir orçamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
            >
              <a
                href="https://wa.me/351930682725?text=Olá!%20Gostava%20de%20informações%20sobre%20películas%20de%20proteção%20solar%20para%20vidros."
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
