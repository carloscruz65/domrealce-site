import { isFrontendRoute } from "../shared/frontend-routes";
import { homeHero } from "../shared/home-hero";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Conteúdo inicial real, substituído pelo React quando a aplicação arranca.
// Não é um segundo H1 escondido nem uma resposta especial para robôs.
export function frontendHtml(template: string, pathname: string) {
  const known = isFrontendRoute(pathname);
  const home = (pathname.replace(/\/+$/, "") || "/") === "/";
  let content = "";

  if (!known) {
    template = template
      .replace(/<title>[\s\S]*?<\/title>/i, "<title>Página não encontrada | DOMREALCE</title>")
      .replace(/<meta\s+name="robots"[^>]*>/i, '<meta name="robots" content="noindex, follow" />')
      .replace(/<link\s+rel="canonical"[^>]*>/i, "");
    content = `<main class="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section class="max-w-md text-center"><p class="text-brand-yellow font-bold">404</p>
      <h1 class="text-3xl font-bold mb-4">Página não encontrada</h1>
      <p class="text-gray-300 mb-6">A página que procura não existe ou foi movida.</p>
      <a class="text-brand-yellow underline" href="/">Voltar ao início</a>
      <a class="text-brand-yellow underline ml-4" href="/servicos">Ver serviços</a></section></main>`;
  } else if (home) {
    content = `<main class="min-h-screen bg-[#050505] text-white">
      <section class="pt-10 pb-10 md:pt-16 md:pb-12"><div class="container mx-auto px-4">
      <a href="/" class="text-brand-yellow font-bold">DOMREALCE</a>
      <div class="grid md:grid-cols-2 gap-8 items-center mt-6">
      <div class="text-center md:text-left">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">${escapeHtml(homeHero.title)} <span class="text-brand-yellow">${escapeHtml(homeHero.highlight)}</span>,<br class="hidden sm:block" /> ${escapeHtml(homeHero.ending)}</h1>
      <p class="text-base sm:text-lg text-gray-300 mb-5">${escapeHtml(homeHero.description)}</p>
      <a class="text-brand-yellow underline" href="/contactos#formulario">Pedir orçamento grátis</a>
      <a class="text-brand-yellow underline ml-4" href="/servicos">Ver serviços</a></div>
      <img src="${escapeHtml(homeHero.image)}" alt="Decoração de viatura DOMREALCE" class="w-full aspect-[4/3] object-cover rounded-2xl" fetchpriority="high" />
      </div></div></section></main>`;
  }

  return {
    status: known ? 200 : 404,
    html: template.replace(/<div id="root"><\/div>/, () => `<div id="root">${content}</div>`),
  };
}
