import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { serveStatic } from "../server/vite";
import { frontendRoutes } from "../shared/frontend-routes";
import { homeHero } from "../shared/home-hero";

async function verify() {
  const root = process.cwd();
  const template = fs.readFileSync(path.join(root, "client/index.html"), "utf8");
  const router = fs.readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
  const clientRoutes = [...router.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...frontendRoutes], clientRoutes, "Sincronizar as rotas do servidor com App.tsx");

  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "domrealce-http-"));
  fs.mkdirSync(path.join(fixture, "dist/public/assets"), { recursive: true });
  fs.writeFileSync(path.join(fixture, "dist/public/index.html"), template);
  fs.writeFileSync(path.join(fixture, "dist/public/assets/check.js"), "/* asset */");
  process.chdir(fixture);
  const app = express();
  serveStatic(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as { port: number };
  const base = `http://127.0.0.1:${address.port}`;
  try {
    for (const route of frontendRoutes) {
      const url = route.replace(/:[^/]+/g, "exemplo");
      const response = await fetch(`${base}${url}?utm_source=teste`);
      assert.equal(response.status, 200, url);
      assert.equal(response.headers.get("x-robots-tag"), null, url);
    }
    const home = await (await fetch(`${base}/`)).text();
    assert.equal((home.match(/<h1\b/g) || []).length, 1);
    assert.ok(home.includes(homeHero.title));
    assert.ok(home.includes(homeHero.description));
    assert.ok(home.includes('href="/contactos#formulario"'));
    for (const url of ["/nao-existe", "/nao-existe/", "/servicos/nao-existe", "/assets/ausente.js", "/favicon-inexistente.ico"]) {
      const response = await fetch(`${base}${url}?teste=1`);
      assert.equal(response.status, 404, url);
      assert.equal(response.headers.get("x-robots-tag"), "noindex");
      const html = await response.text();
      assert.ok(html.includes("Página não encontrada"));
      assert.ok(html.includes('content="noindex, follow"'));
      assert.ok(!html.includes('rel="canonical"'));
    }
    const head = await fetch(`${base}/nao-existe`, { method: "HEAD" });
    assert.equal(head.status, 404);
    assert.equal(await head.text(), "");
    const api = await fetch(`${base}/api/nao-existe`);
    assert.equal(api.status, 404);
    assert.equal((await api.json()).error, "API route not found");
    const asset = await fetch(`${base}/assets/check.js`);
    assert.equal(asset.status, 200);
    assert.equal(await asset.text(), "/* asset */");
    const post = await fetch(`${base}/servicos`, { method: "POST" });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get("allow"), "GET, HEAD");
    console.log(`OK: ${frontendRoutes.length} rotas, H1 inicial, 404/HEAD, API, recursos e métodos HTTP.`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    process.chdir(root);
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}

verify().catch((error) => { console.error(error); process.exitCode = 1; });
