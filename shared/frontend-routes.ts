// Rotas da SPA. O teste verifica a correspondência com client/src/App.tsx.
// Recursos e APIs são tratados antes deste fallback pelo Express/Vite.
export const frontendRoutes = [
  "/",
  "/home-antiga",
  "/sobre",
  "/servico-design-grafico",
  "/servico-impressao-digital",
  "/servico-papel-parede",
  "/servico-telas-artisticas",
  "/servico-autocolantes",
  "/servico-decoracao-viaturas",
  "/servico-espacos-comerciais",
  "/servico-pelicula-solar",
  "/servico-peliculas-protecao-solar",
  "/checkout",
  "/pedido-confirmado",
  "/instrucoes-pagamento",
  "/teste-cores",
  "/portfolio",
  "/portfolio-v2",
  "/loja",
  "/loja/categoria/:slug",
  "/loja/produto/:slug",
  "/loja/papel-parede",
  "/loja/quadros-canvas",
  "/loja/quadros-canvas/categoria/:categoria",
  "/loja/papel-parede/textura/:textura",
  "/como-aplicar-papel-parede",
  "/carrinho",
  "/editor",
  "/admin",
  "/exportar-site",
  "/noticias",
  "/noticia/:id",
  "/contactos",
  "/politica-privacidade",
  "/termos-condicoes",
  "/politica-cookies",
  "/aviso-legal",
  "/demo-interativo",
  "/visual-editor-demo",
  "/obrigado",
  "/obrigado-orcamento",
  "/blog",
  "/pagamento-erro",
  "/contactos-maquinas",
  "/decoracao-viaturas-empresas",
  "/servicos"
] as const;

export function isFrontendRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return frontendRoutes.some((route) => {
    const pattern = route.split("/").map((part) =>
      part.startsWith(":") ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    ).join("/");
    return new RegExp(`^${pattern}$`, "i").test(normalized);
  });
}
