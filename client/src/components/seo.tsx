import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  noIndex?: boolean;
}

interface PageSEOData {
  [key: string]: SEOProps;
}

const pageSEOData: PageSEOData = {
  '/': {
    title: 'DOMREALCE | Impressão Digital e Comunicação Visual em Portugal',
    description: 'Impressão digital e comunicação visual para empresas e particulares. Vinil, etiquetas, PVC, lonas, roll-ups, canvas e papel de parede, com fornecimento para Portugal.',
    keywords: ['comunicação visual', 'impressão digital', 'vinil', 'etiquetas', 'PVC', 'lonas', 'roll-ups', 'canvas', 'papel de parede', 'Portugal', 'DOMREALCE'],
    type: 'website'
  },
  '/servicos': {
    title: 'Serviços de Impressão Digital e Comunicação Visual | DOMREALCE',
    description: 'Conheça os serviços DOMREALCE: impressão digital, vinil, etiquetas, PVC, lonas, roll-ups, canvas, papel de parede e decoração de viaturas.',
    keywords: ['serviços', 'impressão digital', 'vinil', 'etiquetas', 'PVC', 'lonas', 'roll-ups', 'canvas', 'papel de parede'],
    type: 'website'
  },
  '/servico-design-grafico': {
    title: 'Design Gráfico Profissional | DOMREALCE',
    description: 'Criação e preparação de logótipos, material publicitário, branding e identidade visual para impressão e comunicação.',
    keywords: ['design gráfico', 'logótipo', 'branding', 'identidade visual', 'publicidade'],
    type: 'website'
  },
  '/servico-impressao-digital': {
    title: 'Impressão Digital em Grande Formato | DOMREALCE',
    description: 'Impressão digital em grande formato para vinil, lonas, PVC, roll-ups, canvas, papel de parede e outros suportes de comunicação visual.',
    keywords: ['impressão digital', 'grande formato', 'lonas', 'PVC', 'roll-ups', 'vinil'],
    type: 'website'
  },
  '/servico-papel-parede': {
    title: 'Papel de Parede Personalizado | DOMREALCE',
    description: 'Papel de parede personalizado por medida, com imagens ou texturas à escolha. Produção DOMREALCE e fornecimento para Portugal.',
    keywords: ['papel de parede', 'papel de parede personalizado', 'texturas', 'decoração interior'],
    type: 'website'
  },
  '/servico-decoracao-viaturas': {
    title: 'Decoração de Viaturas e Frotas | DOMREALCE',
    description: 'Decoração publicitária de viaturas e frotas com vinil, desde a preparação gráfica à produção e aplicação na zona de atuação DOMREALCE.',
    keywords: ['decoração viaturas', 'publicidade móvel', 'frotas', 'vinil automóvel'],
    type: 'website'
  },
  '/loja': {
    title: 'Loja Online DOMREALCE | Produtos de Comunicação Visual',
    description: 'Compre online produtos de comunicação visual e decoração, incluindo papel de parede personalizado e impressão digital.',
    keywords: ['loja online', 'comprar', 'papel de parede', 'impressão digital'],
    type: 'website'
  },
  '/loja-papel-parede': {
    title: 'Papel de Parede Online - Texturas e Medidas Personalizadas | DOMREALCE',
    description: 'Escolha entre centenas de texturas de papel de parede, indique as medidas e encontre a solução adequada ao seu espaço.',
    keywords: ['papel de parede online', 'texturas', 'comprar papel parede', 'medidas'],
    type: 'website'
  },
  '/portfolio': {
    title: 'Portfolio DOMREALCE | Projetos de Comunicação Visual',
    description: 'Conheça projetos realizados pela DOMREALCE em impressão digital, decoração, vinil, sinalética e comunicação visual.',
    keywords: ['portfolio', 'projetos', 'trabalhos realizados', 'comunicação visual'],
    type: 'website'
  },
  '/contactos': {
    title: 'Contactos DOMREALCE | Paredes, Portugal',
    description: 'Contacte a DOMREALCE por telefone, email ou WhatsApp. Estamos em Gondalães, Paredes, e fornecemos produtos de impressão para Portugal.',
    keywords: ['contactos', 'DOMREALCE', 'Paredes', 'Gondalães', 'telefone', 'WhatsApp'],
    type: 'website'
  },
  '/sobre': {
    title: 'Sobre a DOMREALCE | Experiência em Comunicação Visual',
    description: 'Conheça a DOMREALCE, empresa de Paredes dedicada à comunicação visual, impressão digital e soluções personalizadas para empresas e particulares.',
    keywords: ['sobre', 'história', 'experiência', 'empresa', 'comunicação visual', 'Paredes'],
    type: 'website'
  },
  '/noticias': {
    title: 'Notícias e Novidades | DOMREALCE',
    description: 'Novidades, projetos, dicas e tendências de impressão digital e comunicação visual da DOMREALCE.',
    keywords: ['notícias', 'novidades', 'blog', 'tendências', 'comunicação visual'],
    type: 'website'
  },
  '/servico-telas-artisticas': {
    title: 'Canvas e Telas Personalizadas | DOMREALCE',
    description: 'Impressão de canvas e telas personalizadas em alta qualidade para decoração, fotografia e reprodução de imagens.',
    keywords: ['telas artísticas', 'canvas', 'impressão arte', 'decoração'],
    type: 'website'
  },
  '/servico-autocolantes': {
    title: 'Etiquetas e Autocolantes Personalizados | DOMREALCE',
    description: 'Etiquetas e autocolantes personalizados em vinil, produzidos por medida e quantidade, com diferentes opções de corte e acabamento.',
    keywords: ['etiquetas', 'autocolantes personalizados', 'vinil adesivo', 'corte de contorno', 'personalização'],
    type: 'website'
  },
  '/servico-espacos-comerciais': {
    title: 'Decoração de Espaços Comerciais e Montras | DOMREALCE',
    description: 'Decoração de montras, espaços comerciais e ambientes empresariais com soluções de comunicação visual personalizadas.',
    keywords: ['decoração espaços', 'montras', 'empresas', 'comunicação visual'],
    type: 'website'
  },
  '/servico-peliculas-protecao-solar': {
    title: 'Películas de Proteção Solar | DOMREALCE',
    description: 'Películas de proteção solar para janelas, com redução de calor, proteção UV e maior privacidade para espaços comerciais e particulares.',
    keywords: ['películas solares', 'proteção UV', 'janelas', 'isolamento'],
    type: 'website'
  },
  '/como-aplicar-papel-parede': {
    title: 'Como Aplicar Papel de Parede - Guia Completo | DOMREALCE',
    description: 'Guia passo a passo para aplicar papel de parede. Dicas profissionais, ferramentas necessárias e técnicas de aplicação.',
    keywords: ['aplicar papel parede', 'tutorial', 'guia', 'dicas'],
    type: 'article'
  },
  '/politica-privacidade': {
    title: 'Política de Privacidade | DOMREALCE',
    description: 'Política de privacidade da DOMREALCE. Como protegemos e utilizamos os seus dados pessoais.',
    keywords: ['política privacidade', 'dados pessoais', 'RGPD'],
    type: 'website',
    noIndex: false
  },
  '/termos-condicoes': {
    title: 'Termos e Condições | DOMREALCE',
    description: 'Termos e condições de utilização dos serviços DOMREALCE. Regulamentos e políticas comerciais.',
    keywords: ['termos condições', 'regulamento', 'políticas'],
    type: 'website',
    noIndex: false
  },
  '/politica-cookies': {
    title: 'Política de Cookies | DOMREALCE',
    description: 'Política de utilização de cookies no site DOMREALCE. Informações sobre cookies e preferências.',
    keywords: ['política cookies', 'privacidade', 'navegação'],
    type: 'website',
    noIndex: false
  },
  '/aviso-legal': {
    title: 'Aviso Legal | DOMREALCE',
    description: 'Aviso legal do site DOMREALCE. Informações legais, propriedade intelectual e responsabilidades.',
    keywords: ['aviso legal', 'informações legais', 'propriedade intelectual'],
    type: 'website',
    noIndex: false
  }
};

export default function SEO({ title, description, image, type = 'website', keywords = [], noIndex = false }: SEOProps) {
  const [location] = useLocation();
  
  useEffect(() => {
    const pageData = pageSEOData[location] || {};
    const finalTitle = title || pageData.title || 'DOMREALCE | Impressão Digital e Comunicação Visual';
    const finalDescription = description || pageData.description || 'Impressão digital e comunicação visual. Produção em Paredes e fornecimento de produtos para Portugal.';
    const finalKeywords = [...(pageData.keywords || []), ...keywords];
    const finalType = type || pageData.type || 'website';
    const finalImage = image || pageData.image || 'https://www.domrealce.com/og-image.jpg';
    
    document.title = finalTitle;
    updateMetaTag('description', finalDescription);
    if (finalKeywords.length > 0) {
      updateMetaTag('keywords', finalKeywords.join(', '));
    }
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateLinkTag('canonical', `https://www.domrealce.com${location}`);
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:type', finalType);
    updateMetaProperty('og:url', `https://www.domrealce.com${location}`);
    updateMetaProperty('og:image', finalImage);
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:image', finalImage);
    updateMetaName('author', 'DOMREALCE');
    updateMetaProperty('og:locale', 'pt_PT');
    updateMetaProperty('og:site_name', 'DOMREALCE');
    addPreconnectLink('https://fonts.googleapis.com');
    addPreconnectLink('https://fonts.gstatic.com');
    addPreconnectLink('https://www.google-analytics.com');
  }, [location, title, description, image, type, keywords, noIndex]);
  
  return null;
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function addPreconnectLink(href: string) {
  if (!document.querySelector(`link[href="${href}"][rel="preconnect"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'preconnect');
    link.setAttribute('href', href);
    link.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(link);
  }
}