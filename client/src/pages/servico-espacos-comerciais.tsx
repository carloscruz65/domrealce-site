import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import ServiceGallery from "@/components/service-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle,
  Star,
  ArrowRight,
  Store,
  Utensils,
  Briefcase,
  Hotel,
  Users,
} from "lucide-react";

const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1529424301806-4be0bb154e3b?w=800&q=80",
    alt: "Loja moderna decorada",
    title: "Lojas e Retalho",
  },
  {
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    alt: "Restaurante com comunicação visual",
    title: "Restaurantes e Cafés",
  },
  {
    src: "https://images.unsplash.com/photo-1521783593447-5702f4ef3c52?w=800&q=80",
    alt: "Escritório empresarial decorado",
    title: "Escritórios e Serviços",
  },
];

export default function ServicoEspacosComerciais() {
  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "espacos-comerciais"],
  });
  const galleryImages = galleryData?.images || defaultImages;

  const segments = [
    {
      icon: <Store className="w-8 h-8" />,
      title: "Lojas e retalho",
      description: "Montras, interiores e comunicação visual para pontos de venda.",
      items: ["Montras", "Faixas e placas", "Expositores", "Decoração interior"],
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Restaurantes e cafés",
      description: "Ambientes acolhedores e comunicação clara para o seu negócio.",
      items: ["Menus de parede", "Letreiros", "Sinalética", "Decoração temática"],
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Escritórios e serviços",
      description: "Espaços corporativos com imagem profissional e coerente.",
      items: ["Logótipos em parede", "Vinil decorativo", "Sinalética interna", "Salas de reunião"],
    },
    {
      icon: <Hotel className="w-8 h-8" />,
      title: "Hotéis e alojamento",
      description: "Experiências marcantes desde a receção aos quartos.",
      items: ["Receções", "Corredores", "Quartos", "Áreas comuns"],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Clínicas e bem-estar",
      description: "Ambientes tranquilos e informativos para clientes e pacientes.",
      items: ["Sinalética", "Decoração temática", "Informação de serviços", "Regras e avisos"],
    },
  ];

  const services = [
    {
      title: "Projeto e conceito",
      description:
        "Analisamos o seu espaço e criamos um conceito visual alinhado com a identidade da marca.",
      benefits: [
        "Levantamento no local",
        "Propostas visuais",
        "Aconselhamento de materiais",
        "Adaptação ao orçamento",
      ],
    },
    {
      title: "Produção de comunicação",
      description:
        "Produção de todos os elementos gráficos: vinil, placas, estruturas e outros suportes.",
      benefits: [
        "Impressão digital de alta qualidade",
        "Materiais adequados a interior e exterior",
        "Acabamentos profissionais",
        "Prazos controlados",
      ],
    },
    {
      title: "Instalação no local",
      description:
        "Equipa própria de instalação para garantir um resultado perfeito e duradouro.",
      benefits: [
        "Equipa experiente",
        "Trabalho rápido e organizado",
        "Respeito pelo espaço e horário",
        "Garantia de aplicação",
      ],
    },
    {
      title: "Manutenção e atualização",
      description:
        "Atualização de campanhas, substituição de elementos e manutenção periódica.",
      benefits: [
        "Renovação de campanhas sazonais",
        "Substituição de peças danificadas",
        "Ajustes e melhorias",
        "Acompanhamento contínuo",
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Análise do espaço",
      description:
        "Visitamos o espaço (ou analisamos plantas/fotos) para compreender necessidades e oportunidades.",
    },
    {
      step: "02",
      title: "Proposta visual",
      description:
        "Apresentamos soluções visuais, materiais sugeridos e orçamento detalhado.",
    },
    {
      step: "03",
      title: "Produção",
      description:
        "Produção de todos os elementos gráficos e decorativos aprovados.",
    },
    {
      step: "04",
      title: "Instalação",
      description:
        "Instalação no local com mínimo impacto na atividade do seu negócio.",
    },
    {
      step: "05",
      title: "Revisão e suporte",
      description:
        "Verificação final e suporte pós-instalação para ajustes ou futuras atualizações.",
    },
  ];

  const benefits = [
    "Solução chave-na-mão: projeto, produção e instalação",
    "Materiais adequados a espaços comerciais",
    "Equipa com décadas de experiência",
    "Cumprimento de prazos e horários comerciais",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHero
        serviceId="espacos-comerciais"
        badge="Espaços comerciais"
        badgeIcon={<Building2 className="w-4 h-4 mr-2" />}
        title="Decoração de espaços comerciais"
        subtitle="ambientes que vendem por si"
        description="Desenhamos e implementamos soluções completas de comunicação e decoração para lojas, restaurantes, escritórios e outros espaços comerciais."
        overlayOpacity="0"
        primaryCta={{
          text: "Falar sobre o meu espaço",
          href: "/contactos#formulario",
        }}
        secondaryCta={{
          text: "Ver portfólio",
          href: "/portfolio",
        }}
      />

      {/* Segmentos */}
      <section className="pt-8 pb-16 bg-gray-900/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-brand-yellow">Tipos de</span>{" "}
              <span className="text-white">espaços</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Projetos adaptados a diferentes tipos de negócios e ambientes
              comerciais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {segments.map((segment, index) => (
              <Card
                key={index}
                className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-brand-yellow mb-4">{segment.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {segment.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{segment.description}</p>
                  <div className="space-y-2">
                    {segment.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <ServiceGallery
        title="Exemplos de espaços comerciais"
        description="Alguns projetos de decoração e comunicação visual em ambientes comerciais."
        images={galleryImages}
        columns={3}
      />

      {/* Serviços */}
      <section className="pt-8 pb-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-white">Serviços</span>{" "}
              <span className="text-brand-yellow">disponíveis</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Acompanhamos todo o processo, do conceito à instalação final no
              seu espaço.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div>
                    <span className="text-sm text-gray-500 mb-2 block">
                      Benefícios:
                    </span>
                    <div className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
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
              <span className="text-brand-yellow">de trabalho</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Um processo claro, pensado para minimizar o impacto no dia a dia
              do seu negócio.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-brand-yellow rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="w-px h-8 bg-gray-700 ml-8 mt-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                <span className="text-brand-yellow">Vantagens</span>{" "}
                <span className="text-white">para o seu negócio</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                A decoração e comunicação correta do espaço influencia a
                perceção da marca, o conforto dos clientes e até as vendas.
              </p>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-white">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-2xl p-8 border border-gray-800">
              <div className="text-center mb-6">
                <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  Experiência comprovada
                </h3>
                <p className="text-gray-400">
                  Décadas de experiência em projetos para negócios de todos os
                  tamanhos.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Projetos realizados</span>
                  <span className="text-brand-yellow font-semibold">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Áreas de negócio</span>
                  <span className="text-brand-yellow font-semibold">+20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Prazo médio</span>
                  <span className="text-brand-yellow font-semibold">
                    3–10 dias
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Satisfação</span>
                  <span className="text-brand-yellow font-semibold">
                    99%
                  </span>
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
            <span className="text-white">Pronto para transformar o seu</span>{" "}
            <span className="text-brand-yellow">espaço comercial?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Fale connosco sobre o seu negócio e criamos uma proposta completa de
            decoração e comunicação visual para o seu espaço.
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
                href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20decoração%20de%20espaços%20comerciais."
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
