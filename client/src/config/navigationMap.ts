export type PageNode = {
  id: string;
  label: string;
  href: string;
  group?: "servicos" | "site";
};

export const SERVICES: PageNode[] = [
  { id: "decoracao-viaturas", label: "Decoração de Viaturas", href: "/servico-decoracao-viaturas", group: "servicos" },
  { id: "impressao-digital", label: "Impressão Digital", href: "/servico-impressao-digital", group: "servicos" },
  { id: "design-grafico", label: "Design Gráfico", href: "/servico-design-grafico", group: "servicos" },
  { id: "papel-parede", label: "Papel de Parede", href: "/servico-papel-parede", group: "servicos" },
  { id: "telas-artisticas", label: "Telas Artísticas", href: "/servico-telas-artisticas", group: "servicos" },
  { id: "autocolantes", label: "Autocolantes", href: "/servico-autocolantes", group: "servicos" },
  { id: "espacos-comerciais", label: "Espaços Comerciais", href: "/servico-espacos-comerciais", group: "servicos" },
  { id: "peliculas-protecao-solar", label: "Películas de Proteção Solar", href: "/servico-peliculas-protecao-solar", group: "servicos" },
];

export const SITE: PageNode[] = [
  { id: "home", label: "Início", href: "/", group: "site" },
  { id: "sobre", label: "Sobre", href: "/sobre", group: "site" },
  { id: "servicos", label: "Serviços", href: "/servicos", group: "site" },
  { id: "portfolio", label: "Portfólio", href: "/portfolio", group: "site" },
  { id: "loja", label: "Loja", href: "/loja", group: "site" },
  { id: "noticias", label: "Notícias", href: "/noticias", group: "site" },
  { id: "contactos", label: "Contactos", href: "/contactos", group: "site" },
];
