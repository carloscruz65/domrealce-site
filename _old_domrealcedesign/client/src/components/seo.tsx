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
    title: 'DOMREALCE | Design Gráfico, Impressão Digital e Papel de Parede em Portugal',
    description: 'Comunicação visual, impressão digital e aplicação de papel de parede. Orçamentos rápidos, qualidade e alto acabamento. Fale com a DOMREALCE.',
    keywords: ['comunicação visual', 'impressão digital', 'papel de parede', 'design gráfico', 'Lisboa', 'Portugal', 'DOMREALCE', 'orçamento', 'qualidade'],
    type: 'website'
  },
  '/servicos': {
    title: 'Serviços de Comunicação Visual | DOMREALCE Lisboa',
    description: 'Descubra todos os nossos serviços: design gráfico, impressão digital, papel de parede, decoração de viaturas, telas artísticas e sinalética comercial.',
    keywords: ['serviços', 'design gráfico', 'impressão', 'decoração viaturas', 'sinalética'],
    type: 'website'
  },
  '/servico-design-grafico': {
    title: 'Design Gráfico Profissional | DOMREALCE Lisboa',
    description: 'Criação de logótipos, material publicitário, branding e identidade visual. Design gráfico profissional com 40 anos de experiência.',
    keywords: ['design gráfico', 'logótipo', 'branding', 'identidade visual', 'publicidade'],
    type: 'website'
  },
  '/servico-impressao-digital': {
    title: 'Impressão Digital de Alta Qualidade | DOMREALCE Lisboa',
    description: 'Impressão digital profissional em grande formato. Banners, cartazes, vinil adesivo, papel de parede e muito mais.',
    keywords: ['impressão digital', 'grande formato', 'banners', 'cartazes', 'vinil'],
    type: 'website'
  },
  '/servico-papel-parede': {
    title: 'Papel de Parede Personalizado | DOMREALCE Lisboa',
    description: 'Papel de parede personalizado com as suas imagens. Texturas exclusivas, medidas personalizadas e aplicação profissional.',
    keywords: ['papel de parede', 'personalizado', 'texturas', 'decoração interior'],
    type: 'website'
  },
  '/servico-decoracao-viaturas': {
    title: 'Decoração de Viaturas Profissional | DOMREALCE Lisboa',
    description: 'Decoração completa de viaturas, frotas comerciais e veículos publicitários. Vinil de qualidade premium e aplicação profissional.',
    keywords: ['decoração viaturas', 'publicidade móvel', 'frotas', 'vinil automóvel'],
    type: 'website'
  },
  '/loja': {
    title: 'Loja Online DOMREALCE | Produtos de Comunicação Visual',
    description: 'Compre online produtos de comunicação visual. Papel de parede personalizado, impressões digitais e muito mais.',
    keywords: ['loja online', 'comprar', 'papel de parede', 'impressão digital'],
    type: 'website'
  },
  '/loja-papel-parede': {
    title: 'Papel de Parede Online - Texturas e Medidas Personalizadas | DOMREALCE',
    description: 'Escolha entre centenas de texturas de papel de parede. Calculadora automática de medidas e preços transparentes.',
    keywords: ['papel de parede online', 'texturas', 'comprar papel parede', 'medidas'],
    type: 'website'
  },
  '/portfolio': {
    title: 'Portfolio DOMREALCE - Projetos de Comunicação Visual | Lisboa',
    description: 'Explore o nosso portfolio com mais de 200 projetos realizados. Trabalhos de design, impressão, decoração e sinalética.',
    keywords: ['portfolio', 'projetos', 'trabalhos realizados', 'referências'],
    type: 'website'
  },
  '/contactos': {
    title: 'Contactos DOMREALCE Lisboa | Orçamentos Gratuitos',
    description: 'Entre em contacto connosco para orçamentos gratuitos. Telefone, email, WhatsApp e morada em Lisboa.',
    keywords: ['contactos', 'orçamentos', 'Lisboa', 'telefone', 'WhatsApp'],
    type: 'website'
  },
  '/sobre': {
    title: 'Sobre a DOMREALCE | 40 Anos de Experiência em Comunicação Visual',
    description: 'Conheça a história da DOMREALCE. Mais de 40 anos de experiência em comunicação visual e impressão digital em Lisboa.',
    keywords: ['sobre', 'história', 'experiência', 'empresa', 'comunicação visual'],
    type: 'website'
  },
  '/noticias': {
    title: 'Notícias e Novidades | DOMREALCE Lisboa',
    description: 'Fique a par das últimas novidades, projetos e inovações da DOMREALCE. Blog com dicas e tendências de comunicação visual.',
    keywords: ['notícias', 'novidades', 'blog', 'tendências', 'comunicação visual'],
    type: 'website'
  },
  '/servico-telas-artisticas': {
    title: 'Telas Artísticas Personalizadas | DOMREALCE Lisboa',
    description: 'Impressão de telas artísticas em alta qualidade. Canvas personalizado, reproduções de arte e impressões decorativas.',
    keywords: ['telas artísticas', 'canvas', 'impressão arte', 'decoração'],
    type: 'website'
  },
  '/servico-autocolantes': {
    title: 'Autocolantes e Vinil Adesivo | DOMREALCE Lisboa',
    description: 'Autocolantes personalizados, vinil adesivo para decoração e publicidade. Corte automático e aplicação profissional.',
    keywords: ['autocolantes', 'vinil adesivo', 'corte automático', 'personalização'],
    type: 'website'
  },
  '/servico-espacos-comerciais': {
    title: 'Sinalética Comercial e Decoração de Espaços | DOMREALCE',
    description: 'Sinalética para espaços comerciais, decoração de montras e ambientes corporativos. Soluções completas de comunicação visual.',
    keywords: ['sinalética comercial', 'decoração espaços', 'montras', 'empresas'],
    type: 'website'
  },
  '/servico-peliculas-protecao-solar': {
    title: 'Películas de Proteção Solar | DOMREALCE Lisboa',
    description: 'Películas de proteção solar para janelas. Redução de calor, proteção UV e maior privacidade para casa e escritório.',
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
    // Get page-specific SEO data or use provided props
    const pageData = pageSEOData[location] || {};
    const finalTitle = title || pageData.title || 'DOMREALCE - Comunicação Visual | Lisboa';
    const finalDescription = description || pageData.description || 'Especialista em comunicação visual e impressão digital em Lisboa.';
    const finalKeywords = [...(pageData.keywords || []), ...keywords];
    const finalType = type || pageData.type || 'website';
    const finalImage = image || pageData.image || 'https://www.domrealce.com/og-image.jpg';
    
    // Update document title
    document.title = finalTitle;
    
    // Update meta description
    updateMetaTag('description', finalDescription);
    
    // Update keywords
    if (finalKeywords.length > 0) {
      updateMetaTag('keywords', finalKeywords.join(', '));
    }
    
    // Update robots
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    
    // Update canonical URL
    updateLinkTag('canonical', `https://www.domrealce.com${location}`);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:type', finalType);
    updateMetaProperty('og:url', `https://www.domrealce.com${location}`);
    updateMetaProperty('og:image', finalImage);
    
    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:image', finalImage);
    
    // Update additional SEO tags
    updateMetaName('author', 'DOMREALCE');
    updateMetaProperty('og:locale', 'pt_PT');
    updateMetaProperty('og:site_name', 'DOMREALCE');
    
    // Add preconnect for performance
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