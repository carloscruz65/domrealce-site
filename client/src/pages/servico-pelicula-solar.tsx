import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ServiceHero from "@/components/service-hero";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Shield,
  Thermometer,
  Eye,
  Home,
  Building2,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

const defaultImages = [
  {
    src: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80",
    alt: "Sala com janelas amplas com luz natural",
    title: "Conforto em habitações",
  },
  {
    src: "https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=800&q=80",
    alt: "Montra de loja com grandes vidros",
    title: "Lojas e montras",
  },
  {
    src: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&q=80",
    alt: "Interior de escritório com janelas amplas",
    title: "Escritórios",
  },
  {
    src: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&q=80",
    alt: "Edifício com fachada envidraçada",
    title: "Espaços comerciais",
  },
];

export default function ServicoPeliculaSolar() {
  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", "pelicula-solar"],
  });

  const galleryImages = galleryData?.images || defaultImages;

  const benefits = [
    {
      icon: Sun,
      title: "Menos calor",
      description:
        "Reduz a entrada de calor e ajuda a manter a temperatura mais estável no interior.",
    },
    {
      icon: Thermometer,
      title: "Conforto e poupança",
      description:
        "Ambientes mais confortáveis e menor necessidade de ar condicionado.",
    },
    {
      icon: Eye,
      title: "Mais privacidade",
      description:
        "Ideal para habitações, lojas e escritórios onde não se pretende tanta exposição.",
    },
    {
      icon: Shield,
      title: "Proteção extra",
      description:
        "Ajuda a reter estilhaços em caso de quebra e reduz o desgaste do mobiliário.",
    },
  ];

  // ✅ Benefícios no modelo accordion (cards + dropdown)
  const benefitsCards: ServiceAccordionCard[] = benefits.map((b, idx) => {
    const Icon = b.icon;
    return {
      key: `benefit-${idx}`,
      icon: <Icon className="w-6 h-6" />,
      title: b.title,
      intro: "Conforto, privacidade e proteção.",
      content: [b.description],
    };
  });

  const applications = [
    {
      title: "Habitações",
      description:
        "Mais conforto em salas, quartos e marquises com grandes áreas envidraçadas.",
      examples: ["Janelas de sala", "Quartos", "Marquises", "Portas de vidro"],
    },
    {
      title: "Lojas e montras",
      description:
        "Protege produtos do desbotamento e torna o espaço mais agradável para clientes.",
      examples: [
        "Montras",
        "Portas de entrada",
        "Showrooms",
        "Espaços de exposição",
      ],
    },
    {
      title: "Escritórios",
      description:
        "Menos encandeamento em ecrãs e ambientes de trabalho mais confortáveis.",
      examples: ["Salas de reunião", "Open-space", "Receções", "Consultórios"],
    },
    {
      title: "Armazéns e indústria",
      description: "Ajuda a reduzir o calor em zonas com muita exposição solar.",
      examples: [
        "Fachadas envidraçadas",
        "Átrios",
        "Zonas de carga",
        "Escritórios internos",
      ],
    },
  ];

  const services = [
    {
      icon: Home,
      title: "Película solar residencial",
      description:
        "Aplicação em janelas de casas e apartamentos para reduzir calor e proteger interiores.",
      features: ["Várias tonalidades", "Aplicação sem bolhas", "Garantia até 5 anos"],
    },
    {
      icon: Building2,
      title: "Película arquitetónica",
      description:
        "Soluções para lojas, escritórios e espaços comerciais com grande exposição solar.",
      features: ["Redução de reflexos", "Melhor conforto", "Melhor aspeto da fachada"],
    },
    {
      icon: Shield,
      title: "Película de segurança",
      description:
        "Películas que reforçam o vidro e ajudam a reter estilhaços em caso de quebra.",
      features: ["Extra resistente", "Transparente ou escurecida", "Opções certificadas"],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Avaliação",
      description:
        "Analisamos o tipo de vidro, a exposição solar e as necessidades do espaço.",
    },
    {
      step: "02",
      title: "Escolha da película",
      description:
        "Apresentamos as opções mais adequadas em termos de tonalidade e desempenho.",
    },
    {
      step: "03",
      title: "Preparação dos vidros",
      description:
        "Limpeza e preparação cuidada para uma aplicação limpa e duradoura.",
    },
    {
      step: "04",
      title: "Aplicação",
      description:
        "Aplicação profissional por técnicos experientes, com equipamento próprio.",
    },
    {
      step: "05",
      title: "Verificação",
      description:
        "Inspeção final e explicação dos cuidados a ter nos primeiros dias.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHero
        serviceId="pelicula-solar"
        badge="Películas de proteção solar"
        badgeIcon={<Sun className="w-4 h-4 mr-2" />}
        title="Películas de proteção solar"
        subtitle="para vidros de habitações e espaços comerciais"
        description="Aplicamos películas de proteção solar em vidros de casas, lojas, escritórios e armazéns para reduzir o calor, aumentar o conforto e proteger interiores."
        overlayOpacity="0"
        primaryCta={{ text: "Pedir orçamento", href: "/contactos#formulario" }}
        secondaryCta={{ text: "Contactar", href: "/contactos#formulario" }}
      />

      <main>
        {/* ✅ Benefícios (normalizado para accordion) */}
        <ServiceCardsSection
          titleTop="Benefícios"
          titleBottom="da película solar"
          subtitle="Uma solução simples para melhorar o conforto e proteger o interior dos seus espaços com vidros."
          cards={benefitsCards}
          defaultOpenKey={null}
        />

        {/* Galeria */}
        <ServiceGallery
          title="Exemplos de aplicações"
          description="Alguns exemplos de habitações e espaços comerciais com película de proteção solar."
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
                Adaptamos a solução ao tipo de espaço e à exposição solar de cada
                projeto.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {applications.map((application, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/60 border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-brand-yellow">
                      {application.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{application.description}</p>
                    <div>
                      <span className="text-sm text-gray-500 mb-2 block">
                        Exemplos:
                      </span>
                      <div className="space-y-1">
                        {application.examples.map((example, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                            <span className="text-sm text-gray-300">{example}</span>
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

        {/* Serviços */}
        <section className="pt-8 pb-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Serviços</span>{" "}
                <span className="text-brand-yellow">disponíveis</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Diferentes tipos de película para responder a necessidades
                específicas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={index}
                    className="bg-black border border-gray-800 hover:border-brand-yellow transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-6 h-6 text-brand-yellow" />
                        <h3 className="text-xl font-semibold text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-gray-300 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Processo */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Processo</span>{" "}
                <span className="text-brand-yellow">profissional</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Um processo simples e organizado, desde o contacto até à
                instalação final.
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

        {/* Especificações / Qualidade */}
        <section className="py-16 bg-gray-900/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <Card className="bg-black border border-gray-800">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-brand-yellow">
                      Especificações técnicas
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Proteção UV</span>
                        <span className="text-white font-semibold">Até 99%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Redução de calor</span>
                        <span className="text-white font-semibold">Até 60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Garantia</span>
                        <span className="text-white font-semibold">Até 5 anos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Aplicação</span>
                        <span className="text-white font-semibold">
                          Pelo interior do vidro
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border border-gray-800">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <Star className="w-12 h-12 text-brand-yellow mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-2 text-white">
                        Tonalidades disponíveis
                      </h3>
                      <p className="text-gray-400">
                        Escolha o equilíbrio certo entre privacidade, luz natural e
                        estética.
                      </p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">5% (escura)</span>
                        <span className="text-white font-semibold">
                          Máxima privacidade
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">20% (média)</span>
                        <span className="text-white font-semibold">
                          Equilíbrio conforto/visibilidade
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">35% (clara)</span>
                        <span className="text-white font-semibold">
                          Mais luz com redução de calor
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">70% (quase incolor)</span>
                        <span className="text-white font-semibold">
                          Proteção UV quase invisível
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para melhorar o conforto dos seus</span>{" "}
              <span className="text-brand-yellow">vidros?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Fale connosco e ajudamos a escolher a película mais adequada para a
              sua casa, loja, escritório ou armazém.
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
                  href="https://wa.me/351930682725?text=Olá!%20Estou%20interessado%20em%20películas%20de%20proteção%20solar%20para%20vidros."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp direto
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}