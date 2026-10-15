export interface SEOProps {
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

export const pageSEOData: PageSEOData = {
  '/': {
    title: 'Decoração de Viaturas e Comunicação Visual | DOMREALCE',
    description: 'Decoração de viaturas, montras, impressão digital e papel de parede personalizado. Materiais premium e aplicação própria. Peça orçamento sem compromisso.',
    keywords: ['comunicação visual', 'impressão digital', 'papel de parede', 'design gráfico', 'Lisboa', 'Portugal', 'DOMREALCE', 'orçamento', 'qualidade'],
    type: 'website'
  },
  '/servicos': {
    title: 'Impressão Digital & Vinil Personalizado para Empresas | DOMREALCE',
    description: 'Design, impressão e aplicação para destacar a sua marca em viaturas, montras, espaços comerciais e suportes publicitários. Produção e aplicação própria na DOMREALCE.',
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
    title: 'Sobre a DOMREALCE - Atelier de Comunicação Visual em Paredes',
    description: 'Saiba mais sobre a DOMREALCE: atelier de comunicação visual em Paredes, especializado em impressão digital, decoração de viaturas, espaços comerciais, papel de parede e telas personalizadas.',
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
    title: 'Autocolantes e Etiquetas Personalizadas | DOMREALCE Lisboa',
    description: 'Autocolantes e etiquetas personalizadas para produtos, embalagens, decoração e publicidade. Impressão em vinil adesivo e corte de contorno profissional.',
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

// Existing routes whose SEO was previously missing from the central map.
pageSEOData['/loja/papel-parede'] = pageSEOData['/loja-papel-parede'];
pageSEOData['/servico-pelicula-solar'] = pageSEOData['/servico-peliculas-protecao-solar'];
pageSEOData['/portfolio-v2'] = pageSEOData['/portfolio'];
pageSEOData['/loja/quadros-canvas'] = {
  title: 'Quadros em Canvas - Loja DOMREALCE',
  description: 'Quadros em canvas premium, com categorias e tamanhos variados. Também fazemos telas artísticas personalizadas.',
  type: 'website',
};
pageSEOData['/decoracao-viaturas-empresas'] = {
  title: 'Decoração de Viaturas para Empresas | DOMREALCE',
  description: 'Decoração e rotulagem de viaturas comerciais no Grande Porto. Design, produção e aplicação profissional. Peça orçamento rápido.',
  type: 'website',
};

export const SITE_CANONICAL_ORIGIN = 'https://www.domrealce.com';
// Existing public institutional photo, verified to return image/webp.
export const DEFAULT_SOCIAL_IMAGE = `${SITE_CANONICAL_ORIGIN}/images/fachada-domrealce.webp`;

