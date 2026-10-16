import assert from "node:assert/strict";
import { ogMetaMiddleware } from "../server/ogMiddleware";
import { storage } from "../server/storage";
import { pageSEOData, DEFAULT_SOCIAL_IMAGE } from "../shared/page-seo";

async function request(path: string, ua: string, method = "GET") {
  const result = { next: false, status: 0, html: "", headers: {} as Record<string, string> };
  const req = { path, method, headers: { "user-agent": ua }, protocol: "https", get: () => "www.domrealce.com" };
  const res = {
    vary: (value: string) => { result.headers.Vary = value; },
    setHeader: (key: string, value: string) => { result.headers[key] = value; },
    status: (code: number) => { result.status = code; return res; },
    send: (html: string) => { result.html = html; return res; },
  };
  await ogMetaMiddleware(req as any, res as any, (() => { result.next = true; }) as any);
  return result;
}

for (const ua of ["LinkedInBot", "WhatsApp/2.0", "facebookexternalhit/1.1", "Twitterbot", "Slackbot"]) {
  for (const route of Object.keys(pageSEOData).filter(path => path !== "/loja-papel-parede")) {
    const result = await request(route, ua);
    assert.equal(result.status, 200, `${ua} ${route}`);
    assert.ok(result.html.includes(`href="https://www.domrealce.com${route}"`));
    assert.ok(result.html.includes(DEFAULT_SOCIAL_IMAGE));
    assert.ok(result.html.includes('property="og:description"'));
    assert.equal(result.headers.Vary, "User-Agent");
  }
}
for (const path of ["/checkout", "/pagamento", "/api/news", "/admin", "/unknown", "/images/file.webp"]) {
  assert.equal((await request(path, "LinkedInBot")).next, true, path);
}
assert.equal((await request("/sobre", "Mozilla/5.0")).next, true);
assert.equal((await request("/sobre", "LinkedInBot", "POST")).next, true);
assert.ok((await request("/sobre/", "LinkedInBot")).html.includes('href="https://www.domrealce.com/sobre"'));
const stickers = await request("/servico-autocolantes", "LinkedInBot");
assert.match(stickers.html, /autocolantes|etiquetas/i);
assert.ok(stickers.html.includes('href="https://www.domrealce.com/servico-autocolantes"'));

// Exercise the original news branch with controlled data, without database writes.
const original = storage.getAllNews;
storage.getAllNews = async () => [{
  id: "test-id", slug: "test-slug", titulo: "Notícia <teste>", descricao: "Descrição",
  shareTitle: 'Título & "partilha"', shareDescription: "Resumo da partilha",
  shareImage: "https://www.domrealce.com/images/fachada-domrealce.webp", imagens: [],
}] as any;
try {
  const byId = await request("/noticia/test-id", "LinkedInBot");
  const bySlug = await request("/noticia/test-slug", "WhatsApp");
  assert.equal(byId.html, bySlug.html);
  assert.ok(byId.html.includes('href="https://www.domrealce.com/noticia/test-slug"'));
  assert.ok(byId.html.includes("Título &amp; &quot;partilha&quot;"));
  assert.ok(byId.html.includes('property="og:type" content="article"'));
  assert.equal((await request("/noticia/missing", "LinkedInBot")).next, true);
  assert.equal((await request("/noticia/test-id", "Mozilla/5.0")).next, true);
} finally {
  storage.getAllNews = original;
}
console.log("PASS: static routes, five social bots, canonical URLs, images, bypasses, escaping and news ID/slug regression.");
process.exit(0);
