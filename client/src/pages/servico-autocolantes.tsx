import { trackWhatsAppConversion } from "@/utils/trackWhatsApp";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import GlobalBreadcrumbs from "@/components/GlobalBreadcrumbs";
import ServiceHeroTwoColumn from "@/components/ServiceHeroTwoColumn";
import ServiceGallery from "@/components/service-gallery";
import ServiceCardsSection from "@/components/services/ServiceCardsSection";
import type { ServiceAccordionCard } from "@/components/services/ServiceCardAccordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Sticker,
  CheckCircle,
  ArrowRight,
  Scissors,
  Palette,
  Settings,
  Zap,
} from "lucide-react";

export default function ServicoAutocolantes() {
  const features = [
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "Corte de contorno preciso",
      description: "Formatos redondos, quadrados ou personalizados.",
    },
    {
      icon: <Sticker className="w-6 h-6" />,
      title: "Impressão em vinil",
      description:
        "Produção para interior e exterior, conforme o material escolhido.",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design com IA",
      description: "Gere até 3 propostas diretamente na aplicação.",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Apoio no design",
      description:
        "Se a IA não chegar ao resultado pretendido, a DOMREALCE pode finalizar a arte.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Preço imediato",
      description:
        "Saiba o valor antes de avançar, sem esperar por orçamento manual.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Encomenda e pagamento online",
      description:
        "Configure, confirme e pague diretamente através da aplicação.",
    },
  ];

  const tecnologiaCards: ServiceAccordionCard[] = features.map((f, idx) => ({
    key: `feature-${idx}`,
    icon: f.icon,
    title: f.title,
    intro: f.description,
    content: [f.description],
  }));

  const materials = [
    {
      name: "Vinil autocolante brilhante",
      description: "Acabamento brilhante para máximo impacto visual.",
    },
    {
      name: "Vinil autocolante mate",
      description: "Acabamento mate elegante e discreto.",
    },
    {
      name: "Vinil removível",
      description: "Para aplicações temporárias sem deixar resíduos.",
    },
    {
      name: "Vinil transparente",
      description: "Para vidros, acrílicos e outras superfícies transparentes.",
    },
  ];

  const applications = [
    {
      category: "Identificação comercial",
      items: [
        "Logótipos de empresa",
        "Horários de funcionamento",
        "Informações de contacto",
        "QR codes",
      ],
    },
    {
      category: "Sinalização",
      items: [
        "Placas direcionais",
        "Numeração",
        "Avisos de segurança",
        "Símbolos informativos",
      ],
    },
    {
      category: "Decoração",
      items: [
        "Elementos decorativos",
        "Frases motivacionais",
        "Padrões geométricos",
        "Ilustrações",
      ],
    },
    {
      category: "Produtos e embalagens",
      items: [
        "Etiquetas de produto",
        "Códigos de barras",
        "Selos de qualidade",
        "Informações técnicas",
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Preparação da arte",
      description:
        "Recebemos o seu ficheiro, o design criado com IA ou o pedido de apoio à DOMREALCE.",
    },
    {
      step: "02",
      title: "Impressão e corte",
      description:
        "Produzimos em vinil e efetuamos o corte adequado ao formato escolhido.",
    },
    {
      step: "03",
      title: "Confirmação e produção",
      description:
        "A produção avança depois da confirmação da encomenda e da arte.",
    },
  ];

  const quickSteps = [
    {
      step: "01",
      title: "Indique medidas e quantidade",
      description:
        "Introduza as dimensões e a quantidade pretendida e obtenha imediatamente uma estimativa do preço.",
    },
    {
      step: "02",
      title: "Personalize o trabalho",
      description:
        "Escolha o material, acabamento, laminação e tipo de corte mais adequado.",
    },
    {
      step: "03",
      title: "Envie ou crie a sua arte",
      description:
        "Envie o ficheiro pronto, crie o design com IA até 3 vezes ou peça à DOMREALCE para finalizar a arte.",
    },
    {
      step: "04",
      title: "Confirme e pague online",
      description:
        "Reveja o pedido, escolha o método de pagamento e conclua a encomenda.",
    },
  ];

  const audiences = [
    "Empresas e lojas",
    "Marcas e produtos",
    "Eventos e promoções",
    "Particulares",
  ];

  const trustPoints = [
    "Pode enviar a sua própria arte.",
    "Pode criar o design com IA.",
    "Pode pedir ajuda à DOMREALCE na preparação da arte.",
    "O preço é calculado antes da encomenda.",
    "A produção só avança depois da confirmação.",
  ];

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&q=80",
      alt: "Autocolantes personalizados coloridos",
      title: "Designs personalizados",
    },
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      alt: "Autocolantes com corte de contorno",
      title: "Corte de precisão",
    },
    {
      src: "https://images.unsplash.com/photo-1606660265514-358ebbadc80d?w=800&q=80",
      alt: "Vinil autocolante em superfície",
      title: "Vinil de qualidade",
    },
    {
      src: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80",
      alt: "Autocolantes decorativos criativos",
      title: "Criatividade sem limites",
    },
    {
      src: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80",
      alt: "Etiquetas profissionais",
      title: "Etiquetas comerciais",
    },
    {
      src: "https://images.unsplash.com/photo-1611926653670-e0f5b1d46118?w=800&q=80",
      alt: "Autocolantes aplicados em montra",
      title: "Aplicações profissionais",
    },
  ];

  const SERVICE_GALLERY_KEY = "autocolantes";

  const { data: galleryData } = useQuery<{ images: typeof defaultImages }>({
    queryKey: ["/api/service-galleries", SERVICE_GALLERY_KEY],
  });

  // ✅ fallback correto (se vier vazio do CMS)
  const cmsImages = galleryData?.images;
  const galleryImages =
    cmsImages && cmsImages.length > 0 ? cmsImages : defaultImages;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <ServiceHeroTwoColumn
        badge="Autocolantes profissionais"
        badgeIcon={<Sticker className="w-4 h-4" />}
        title="Autocolantes e Etiquetas Personalizadas"
        subtitle="Calcule o preço, personalize e encomende online em poucos minutos."
        description="Escolha as medidas, quantidade, material e acabamento. Envie a sua arte ou crie o design com IA. Veja o preço imediatamente e conclua a encomenda e o pagamento online."
        imageSrc="/public-objects/portfolio/Autocolantes/IMG_20221014_095235.webp"
        imageAlt="Autocolantes DOMREALCE"
        primaryCta={{
          text: "CALCULAR PREÇO E ENCOMENDAR",
          href: "https://simple-web-light.replit.app/"
        }}
      >
        <p className="max-w-xl text-xs md:text-sm leading-relaxed text-white/60">
          Preço imediato · Design com IA · Corte de contorno · Pagamento online · Produção própria
        </p>
      </ServiceHeroTwoColumn>

      <main>
        {/* Como encomendar */}
        <section className="py-10 bg-gray-900/40 border-y border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
                <span className="text-white">Do preço à encomenda em </span>
                <span className="text-brand-yellow">4 passos</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Configure o trabalho, veja o valor de imediato e conclua o pedido sem esperar por um orçamento manual.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {quickSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-black border border-gray-800 rounded-xl p-5 hover:border-brand-yellow transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-yellow" /> Preço imediato
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-yellow" /> Pagamento online
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-yellow" /> Produção DOMREALCE
              </span>
            </div>

            <div className="mt-8 text-center">
              <Button
                asChild
                className="bg-brand-yellow text-black font-bold px-7 py-6 hover:bg-brand-yellow/90"
              >
                <a href="https://simple-web-light.replit.app/">
                  CALCULAR O MEU PREÇO
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Funcionalidades principais */}
        <ServiceCardsSection
          titleTop="Tudo o que precisa para encomendar"
          titleBottom="os seus autocolantes"
          subtitle="Configure o trabalho, prepare a arte e conclua a encomenda online."
          cards={tecnologiaCards}
          defaultOpenKey={null}
        />

        {/* Galeria */}
        <ServiceGallery
          images={galleryImages}
          title="Exemplos de autocolantes e etiquetas"
          description="Alguns trabalhos produzidos pela DOMREALCE em diferentes formatos, aplicações e tipos de corte."
          columns={3}
        />

        {/* Informação complementar para clareza e SEO */}
        <section className="py-14 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-9">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Materiais, aplicações e</span>{" "}
                <span className="text-brand-yellow">produção</span>
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Informação essencial para escolher autocolantes e etiquetas personalizados adequados ao seu projeto.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              <Card className="bg-gray-900/60 border border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-brand-yellow">
                    Materiais disponíveis
                  </h3>
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div key={material.name}>
                        <h4 className="text-sm font-semibold text-white">
                          {material.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {material.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-brand-yellow">
                    Aplicações comuns
                  </h3>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.category}>
                        <h4 className="text-sm font-semibold text-white">
                          {application.category}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {application.items.join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-brand-yellow">
                    Como produzimos
                  </h3>
                  <div className="space-y-5">
                    {process.map((step) => (
                      <div key={step.step} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-yellow text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Público-alvo */}
        <section className="py-14 bg-gray-900/40 border-y border-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="text-white">Para quem é este </span>
                <span className="text-brand-yellow">serviço?</span>
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Ideal para empresas, lojas, marcas, eventos e particulares que precisam de etiquetas e autocolantes personalizados para produtos, embalagens, promoções, identificação, montras, eventos e outras aplicações.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {audiences.map((audience) => (
                  <div
                    key={audience}
                    className="rounded-xl border border-gray-800 bg-black px-4 py-5 text-sm font-semibold text-white"
                  >
                    <CheckCircle className="w-5 h-5 text-brand-yellow mx-auto mb-3" />
                    {audience}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Confiança e esclarecimento */}
        <section className="py-14 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
              <div>
                <p className="text-brand-yellow text-sm font-semibold uppercase tracking-wider mb-3">
                  Encomende com confiança
                </p>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                  Tem dúvidas antes de encomendar?
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/60 p-4"
                  >
                    <CheckCircle className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200 leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-black border-t border-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="text-white">Pronto para criar os seus</span>{" "}
              <span className="text-brand-yellow">autocolantes?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Introduza as medidas, veja o preço e avance com a encomenda online.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-brand-yellow text-black font-bold px-8 py-6 text-lg hover:bg-brand-yellow/90"
              >
                <a href="https://simple-web-light.replit.app/">
                  CALCULAR PREÇO AGORA
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black px-8 py-6 text-lg"
              >
                <a
                  href="https://wa.me/351930682725?text=Olá!%20Interessado%20em%20autocolantes."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.preventDefault(); trackWhatsAppConversion("https://wa.me/351930682725?text=Olá!%20Interessado%20em%20autocolantes."); }}
                >
                  WhatsApp direto
                </a>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-5">
              Sem esperar por orçamento manual.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}