import type { ServiceSectionType } from "@shared/service-page";

const calculatorHref = "https://calcular.domrealce.com/";

export interface ServiceSectionSeed {
  id: string;
  serviceId: string;
  key: string;
  type: ServiceSectionType;
  content: Record<string, unknown>;
  position: number;
  visible: boolean;
}

const item = (id: string, position: number, value: Record<string, unknown>) => ({
  id,
  position,
  visible: true,
  ...value,
});

export const AUTOCOLANTES_SERVICE_ID = "autocolantes";

export const autocolantesSeoDefault = {
  serviceId: AUTOCOLANTES_SERVICE_ID,
  title: "Autocolantes e Vinil Adesivo | DOMREALCE Lisboa",
  description: "Autocolantes personalizados, vinil adesivo para decoração e publicidade. Corte automático e aplicação profissional.",
  ogImage: "https://www.domrealce.com/og-image.jpg",
};

export const autocolantesSectionDefaults: ServiceSectionSeed[] = [
  {
    id: "autocolantes-hero",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "hero",
    type: "hero",
    position: 0,
    visible: true,
    content: {
      badge: "Autocolantes profissionais",
      title: "Autocolantes e Etiquetas Personalizadas",
      subtitle: "Calcule o preço, personalize e encomende online em poucos minutos.",
      description: "Escolha as medidas, quantidade, material e acabamento. Envie a sua arte ou crie o design com IA. Veja o preço imediatamente e conclua a encomenda e o pagamento online. Comece aqui: indique as medidas e veja o preço imediatamente.",
      imageSrc: "/public-objects/portfolio/Autocolantes/IMG_20221014_095235.webp",
      imageAlt: "Autocolantes DOMREALCE",
      primaryCta: { text: "CALCULAR PREÇO E ENCOMENDAR", href: calculatorHref },
      highlights: "Preço imediato · Design com IA · Corte de contorno · Pagamento online · Produção própria",
    },
  },
  {
    id: "autocolantes-ordering-steps",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "ordering-steps",
    type: "ordering_steps",
    position: 1,
    visible: true,
    content: {
      titleTop: "Do preço à encomenda em ",
      titleHighlight: "4 passos",
      description: "Configure o trabalho, veja o valor de imediato e conclua o pedido sem esperar por um orçamento manual.",
      steps: [
        item("ordering-step-01", 0, { step: "01", title: "Indique medidas e quantidade", description: "Introduza as dimensões e a quantidade pretendida e obtenha imediatamente uma estimativa do preço.", linkText: "Começar agora →" }),
        item("ordering-step-02", 1, { step: "02", title: "Personalize o trabalho", description: "Escolha o material, acabamento, laminação e tipo de corte mais adequado.", linkText: "Começar agora →" }),
        item("ordering-step-03", 2, { step: "03", title: "Envie ou crie a sua arte", description: "Envie o ficheiro pronto, crie o design com IA até 3 vezes ou peça à DOMREALCE para finalizar a arte.", linkText: "Começar agora →" }),
        item("ordering-step-04", 3, { step: "04", title: "Confirme e pague online", description: "Reveja o pedido, escolha o método de pagamento e conclua a encomenda.", linkText: "Começar agora →" }),
      ],
      assurances: [
        item("assurance-price", 0, { text: "Preço imediato" }),
        item("assurance-payment", 1, { text: "Pagamento online" }),
        item("assurance-production", 2, { text: "Produção DOMREALCE" }),
      ],
      cta: { text: "CALCULAR O MEU PREÇO", href: calculatorHref },
    },
  },
  {
    id: "autocolantes-application-examples",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "application-examples",
    type: "application_examples",
    position: 2,
    visible: true,
    content: {
      titleTop: "O que pode criar com esta ",
      titleHighlight: "aplicação?",
      description: "Desde pequenas etiquetas até autocolantes de grande formato. Escolha as medidas, quantidade e acabamento e veja o preço na hora.",
      items: [
        "Etiquetas para produtos e embalagens",
        "Etiquetas para copos e garrafas",
        "Autocolantes para fechar caixas e sacos",
        "Autocolantes para montras, saldos e promoções",
        "Autocolantes para festas e campanhas sazonais",
        "Logótipos e identificação de marca",
        "Autocolantes com corte de contorno",
        "Autocolantes de grande formato",
      ].map((text, position) => item(`application-example-${position + 1}`, position, { text })),
    },
  },
  {
    id: "autocolantes-feature-accordions",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "feature-accordions",
    type: "feature_accordions",
    position: 3,
    visible: true,
    content: {
      titleTop: "Tudo o que precisa para encomendar",
      titleBottom: "os seus autocolantes",
      subtitle: "Configure o trabalho, prepare a arte e conclua a encomenda online.",
      defaultOpenKey: null,
      items: [
        ["scissors", "Corte de contorno preciso", "Formatos redondos, quadrados ou personalizados."],
        ["sticker", "Impressão em vinil", "Produção para interior e exterior, conforme o material escolhido."],
        ["palette", "Design com IA", "Gere até 3 propostas diretamente na aplicação."],
        ["settings", "Apoio no design", "Se a IA não chegar ao resultado pretendido, a DOMREALCE pode finalizar a arte."],
        ["zap", "Preço imediato", "Saiba o valor antes de avançar, sem esperar por orçamento manual."],
        ["check-circle", "Encomenda e pagamento online", "Configure, confirme e pague diretamente através da aplicação."],
      ].map(([icon, title, intro], position) => item(`feature-${position}`, position, {
        key: `feature-${position}`,
        icon,
        title,
        intro,
        content: [intro],
      })),
    },
  },
  {
    id: "autocolantes-gallery",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "gallery",
    type: "gallery",
    position: 4,
    visible: true,
    content: {
      title: "Exemplos de autocolantes e etiquetas",
      description: "Alguns trabalhos produzidos pela DOMREALCE em diferentes formatos, aplicações e tipos de corte.",
      columns: 3,
      legacyServiceGalleryKey: "autocolantes",
      fallbackImages: [
        ["https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&q=80", "Autocolantes personalizados coloridos", "Designs personalizados"],
        ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", "Autocolantes com corte de contorno", "Corte de precisão"],
        ["https://images.unsplash.com/photo-1606660265514-358ebbadc80d?w=800&q=80", "Vinil autocolante em superfície", "Vinil de qualidade"],
        ["https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800&q=80", "Autocolantes decorativos criativos", "Criatividade sem limites"],
        ["https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&q=80", "Etiquetas profissionais", "Etiquetas comerciais"],
        ["https://images.unsplash.com/photo-1611926653670-e0f5b1d46118?w=800&q=80", "Autocolantes aplicados em montra", "Aplicações profissionais"],
      ].map(([src, alt, title], position) => item(`gallery-fallback-${position + 1}`, position, { src, alt, title })),
    },
  },
  {
    id: "autocolantes-materials-production",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "materials-applications-production",
    type: "materials_applications_production",
    position: 5,
    visible: true,
    content: {
      titleTop: "Materiais, aplicações e",
      titleHighlight: "produção",
      description: "Informação essencial para escolher autocolantes e etiquetas personalizados adequados ao seu projeto.",
      materialsTitle: "Materiais disponíveis",
      materials: [
        ["Vinil autocolante brilhante", "Acabamento brilhante para máximo impacto visual."],
        ["Vinil autocolante mate", "Acabamento mate elegante e discreto."],
        ["Vinil removível", "Para aplicações temporárias sem deixar resíduos."],
        ["Vinil transparente", "Para vidros, acrílicos e outras superfícies transparentes."],
      ].map(([name, description], position) => item(`material-${position + 1}`, position, { name, description })),
      applicationsTitle: "Aplicações comuns",
      applications: [
        ["Identificação comercial", ["Logótipos de empresa", "Horários de funcionamento", "Informações de contacto", "QR codes"]],
        ["Sinalização", ["Placas direcionais", "Numeração", "Avisos de segurança", "Símbolos informativos"]],
        ["Decoração", ["Elementos decorativos", "Frases motivacionais", "Padrões geométricos", "Ilustrações"]],
        ["Produtos e embalagens", ["Etiquetas de produto", "Códigos de barras", "Selos de qualidade", "Informações técnicas"]],
      ].map(([category, items], position) => item(`application-${position + 1}`, position, { category, items })),
      productionTitle: "Como produzimos",
      production: [
        ["01", "Preparação da arte", "Recebemos o seu ficheiro, o design criado com IA ou o pedido de apoio à DOMREALCE."],
        ["02", "Impressão e corte", "Produzimos em vinil e efetuamos o corte adequado ao formato escolhido."],
        ["03", "Confirmação e produção", "A produção avança depois da confirmação da encomenda e da arte."],
      ].map(([step, title, description], position) => item(`production-${position + 1}`, position, { step, title, description })),
    },
  },
  {
    id: "autocolantes-audiences",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "audiences",
    type: "audiences",
    position: 6,
    visible: true,
    content: {
      titleTop: "Para quem é este ",
      titleHighlight: "serviço?",
      description: "Ideal para empresas, lojas, marcas, eventos e particulares que precisam de etiquetas e autocolantes personalizados para produtos, embalagens, promoções, identificação, montras, eventos e outras aplicações.",
      items: ["Empresas e lojas", "Marcas e produtos", "Eventos e promoções", "Particulares"]
        .map((text, position) => item(`audience-${position + 1}`, position, { text })),
    },
  },
  {
    id: "autocolantes-trust",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "trust",
    type: "trust",
    position: 7,
    visible: true,
    content: {
      eyebrow: "Encomende com confiança",
      title: "Tem dúvidas antes de encomendar?",
      points: [
        "Pode enviar a sua própria arte.",
        "Pode criar o design com IA.",
        "Pode pedir ajuda à DOMREALCE na preparação da arte.",
        "O preço é calculado antes da encomenda.",
        "A produção só avança depois da confirmação.",
      ].map((text, position) => item(`trust-point-${position + 1}`, position, { text })),
    },
  },
  {
    id: "autocolantes-video",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "video",
    type: "video",
    position: 8,
    visible: false,
    content: { title: "", description: "", url: null, poster: null },
  },
  {
    id: "autocolantes-final-cta",
    serviceId: AUTOCOLANTES_SERVICE_ID,
    key: "final-cta",
    type: "final_cta",
    position: 9,
    visible: true,
    content: {
      titleTop: "Pronto para criar os seus",
      titleHighlight: "autocolantes?",
      description: "Introduza as medidas, veja o preço e avance com a encomenda online.",
      primaryCta: { text: "CALCULAR PREÇO AGORA", href: calculatorHref },
      secondaryCta: { text: "WhatsApp direto", href: "https://wa.me/351930682725?text=Olá!%20Interessado%20em%20autocolantes." },
      footnote: "Sem esperar por orçamento manual.",
    },
  },
];