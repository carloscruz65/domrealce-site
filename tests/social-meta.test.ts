import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdir, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { pageSEOData, DEFAULT_SOCIAL_IMAGE } from "../shared/page-seo";

test("integração mantém SEO nacional, links individuais nas redes e notícias sem serviços reais", async () => {
  const state = { cmsFails: false };
  (globalThis as any).__socialMetaFixture = state;
  const output = path.resolve(
    `node_modules/.cache/social-meta-${randomUUID()}.mjs`,
  );
  await mkdir(path.dirname(output), { recursive: true });
  try {
    await build({
      entryPoints: ["server/ogMiddleware.ts"],
      outfile: output,
      bundle: true,
      platform: "node",
      format: "esm",
      packages: "external",
      logLevel: "silent",
      plugins: [
        {
          name: "isolated-social-data",
          setup(b) {
            b.onResolve({ filter: /^\.\/storage$/ }, (args) =>
              args.importer.endsWith("/server/ogMiddleware.ts")
                ? { path: "news", namespace: "fixture" }
                : undefined,
            );
            b.onResolve({ filter: /^\.\/service-pages\/storage$/ }, (args) =>
              args.importer.endsWith("/server/staticSocialMeta.ts")
                ? { path: "cms", namespace: "fixture" }
                : undefined,
            );
            b.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
              contents:
                args.path === "news"
                  ? `export const storage={getAllNews:async()=>[{id:'teste',slug:'noticia-teste',titulo:'Título <teste>',descricao:'Descrição',shareTitle:'Título & "partilha"',shareDescription:'Resumo',shareImage:'https://www.domrealce.com/images/fachada-domrealce.webp',imagens:[]}]};`
                  : `export async function getPublicServicePage(){if(globalThis.__socialMetaFixture.cmsFails)throw new Error('CMS indisponível no teste');return {seo:{title:'Autocolantes & Etiquetas DOMREALCE',description:'Descrição do CMS'}};}`,
              loader: "js",
            }));
          },
        },
      ],
    });
    const { ogMetaMiddleware } = await import(pathToFileURL(output).href);
    const request = async (route: string, ua: string, method = "GET") => {
      const result = {
        next: false,
        status: 0,
        html: "",
        headers: {} as Record<string, string>,
      };
      const req = {
        path: route,
        method,
        headers: { "user-agent": ua },
        protocol: "https",
        get: () => "www.domrealce.com",
      };
      const res = {
        vary: (s: string) => {
          result.headers.Vary = s;
        },
        setHeader: (k: string, v: string) => {
          result.headers[k] = v;
        },
        status: (n: number) => {
          result.status = n;
          return res;
        },
        send: (s: string) => {
          result.html = s;
          return res;
        },
      };
      await ogMetaMiddleware(req, res, () => {
        result.next = true;
      });
      return result;
    };
    // A main removeu Lisboa; a centralização do Replit não pode reintroduzir o texto antigo.
    assert.match(
      pageSEOData["/"].title!,
      /Impressão Digital e Comunicação Visual em Portugal/,
    );
    assert.match(pageSEOData["/contactos"].description!, /Paredes/);
    for (const page of Object.values(pageSEOData))
      assert.doesNotMatch(
        `${page.title} ${page.description} ${page.keywords?.join(" ")}`,
        /Lisboa/i,
      );
    for (const ua of [
      "LinkedInBot",
      "WhatsApp/2.0",
      "facebookexternalhit/1.1",
      "Twitterbot",
      "Slackbot",
    ]) {
      for (const route of Object.keys(pageSEOData).filter(
        (p) => p !== "/loja-papel-parede",
      )) {
        const r = await request(route, ua);
        assert.equal(r.status, 200, `${route} ${ua}`);
        assert.ok(r.html.includes(`href="https://www.domrealce.com${route}"`));
        assert.ok(r.html.includes(pageSEOData[route].image || DEFAULT_SOCIAL_IMAGE));
        assert.equal(r.headers.Vary, "User-Agent");
      }
    }
    const home = await request("/", "LinkedInBot");
    assert.match(home.html, /domrealce-impressao-comunicacao-social-20261017\.jpg/);
    assert.ok(!home.html.includes(DEFAULT_SOCIAL_IMAGE));
    assert.ok((await request("/servico-impressao-digital", "LinkedInBot")).html.includes(DEFAULT_SOCIAL_IMAGE));
    const stickers = await request("/servico-autocolantes", "LinkedInBot");
    assert.match(stickers.html, /Autocolantes &amp; Etiquetas/);
    assert.match(stickers.html, /Descrição do CMS/);
    state.cmsFails = true;
    assert.ok(
      (await request("/servico-autocolantes", "LinkedInBot")).html.includes(
        pageSEOData["/servico-autocolantes"].title!,
      ),
    );
    state.cmsFails = false;
    for (const route of [
      "/checkout",
      "/admin",
      "/api/news",
      "/desconhecida",
      "/images/foto.webp",
      "/loja/produto/teste",
    ])
      assert.equal((await request(route, "LinkedInBot")).next, true);
    assert.equal((await request("/sobre", "Mozilla/5.0")).next, true);
    assert.equal((await request("/sobre", "LinkedInBot", "POST")).next, true);
    assert.ok(
      (await request("/sobre/", "LinkedInBot")).html.includes(
        'href="https://www.domrealce.com/sobre"',
      ),
    );
    const byId = await request("/noticia/teste", "LinkedInBot");
    const bySlug = await request("/noticia/noticia-teste", "WhatsApp");
    assert.equal(byId.html, bySlug.html);
    assert.match(byId.html, /Título &amp; &quot;partilha&quot;/);
    assert.match(
      byId.html,
      /https:\/\/www.domrealce.com\/noticia\/noticia-teste/,
    );
    assert.equal(
      (await request("/noticia/inexistente", "LinkedInBot")).next,
      true,
    );
  } finally {
    await rm(output, { force: true });
    delete (globalThis as any).__socialMetaFixture;
  }
});
