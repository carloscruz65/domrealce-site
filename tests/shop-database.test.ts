import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import { readFile, mkdir, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import path from "node:path";
import express from "express";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { build } from "esbuild";
import { registerShopCatalogRoutes } from "../server/shop/routes";
import {
  DEFAULT_SHOP_SETTINGS,
  categoryInput,
  productInput,
} from "../shared/shop-catalog";
import { quoteShopCart } from "../shared/shop-pricing";

// Motor PostgreSQL temporário: sem DATABASE_URL, rede, credenciais ou serviços reais.
test("instalação gradual, migração repetível e catálogo HTTP usam PostgreSQL isolado", async () => {
  const pg = new PGlite();
  const database = drizzle(pg);
  const fixture = { db: database };
  (globalThis as any).__shopDatabaseFixture = fixture;
  const output = path.resolve(
    `node_modules/.cache/shop-database-${randomUUID()}.mjs`,
  );
  await mkdir(path.dirname(output), { recursive: true });
  let server: ReturnType<express.Express["listen"]> | undefined;
  try {
    await build({
      entryPoints: ["server/shop/store.ts"],
      outfile: output,
      bundle: true,
      platform: "node",
      format: "esm",
      packages: "external",
      logLevel: "silent",
      plugins: [
        {
          name: "isolated-postgres",
          setup(b) {
            b.onResolve({ filter: /^\.\.\/db$/ }, (args) =>
              args.importer.endsWith("/server/shop/store.ts")
                ? { path: "db", namespace: "fixture" }
                : undefined,
            );
            b.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({
              contents: "export const db=globalThis.__shopDatabaseFixture.db;",
              loader: "js",
            }));
          },
        },
      ],
    });
    const { catalogStore: store } = await import(pathToFileURL(output).href);
    const app = express();
    app.use(express.json());
    registerShopCatalogRoutes(app, store, (req, res, next) =>
      req.get("x-test-admin") === "yes"
        ? next()
        : res.status(403).json({ error: "Área restrita" }),
    );
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    const base = `http://127.0.0.1:${(server.address() as any).port}`;
    const request = (url: string, method = "GET", body?: unknown) =>
      fetch(base + url, {
        method,
        headers: { "Content-Type": "application/json", "x-test-admin": "yes" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    // A aplicação existente tem pedidos anteriores; a migração não pode alterá-los.
    await pg.exec(
      "CREATE TABLE orders (id text PRIMARY KEY, total numeric NOT NULL, itens jsonb NOT NULL, numero_encomenda text DEFAULT 'ANTERIOR'); INSERT INTO orders(id,total,itens) VALUES ('anterior', 61.50, '[{\"preco\":50}]');",
    );
    const before = (await pg.query("select * from orders")).rows;
    assert.deepEqual(await store.getCatalog({ allowLegacy: true }), {
      categories: [],
      products: [],
      settings: DEFAULT_SHOP_SETTINGS,
    });
    const legacy = quoteShopCart(
      [{ type: "quadros-canvas", tamanho: "20x30", quantidade: 1 }],
      await store.getCatalog({ allowLegacy: true }),
      "pickup",
    );
    assert.equal(legacy.total, 18.45);
    await assert.rejects(() => store.getCatalog()); // O admin não finge estar pronto sem migração.
    assert.equal((await request("/api/shop/catalog")).status, 200);
    const oldQuote = await request("/api/shop/quote", "POST", {
      delivery: "pickup",
      items: [{ type: "quadros-canvas", tamanho: "20x30", quantidade: 1 }],
    });
    assert.equal(oldQuote.status, 200);
    assert.equal((await oldQuote.json()).total, 18.45);
    assert.equal((await request("/api/admin/shop")).status, 503);

    // Falhas de ligação continuam a propagar; não se substituem preços por omissão.
    const originalSelect = database.select;
    (database as any).select = () => {
      throw Object.assign(new Error("ligação indisponível"), { code: "08006" });
    };
    await assert.rejects(
      () => store.getCatalog({ allowLegacy: true }),
      /ligação indisponível/,
    );
    (database as any).select = originalSelect;

    // Uma instalação parcial deve falhar, para nunca ocultar preços reais com os antigos.
    await pg.exec(
      "CREATE TABLE shop_categories (id varchar PRIMARY KEY, name text NOT NULL, slug text NOT NULL UNIQUE, description text NOT NULL DEFAULT '', image text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0);",
    );
    await assert.rejects(() => store.getCatalog({ allowLegacy: true }));
    const migration = await readFile(
      "migrations/20261015_shop_catalog.sql",
      "utf8",
    );
    await pg.exec(migration);
    await pg.exec(migration);
    assert.deepEqual((await pg.query("select * from orders")).rows, before);
    assert.deepEqual((await store.getCatalog()).products, []);

    const categoryBody = categoryInput.parse({
      name: "Autocolantes",
      slug: "autocolantes",
      published: true,
    });
    const categoryResponse = await request(
      "/api/admin/shop/categories",
      "POST",
      categoryBody,
    );
    assert.equal(categoryResponse.status, 201);
    const category = await categoryResponse.json();
    assert.equal(
      (await request("/api/admin/shop/categories", "POST", categoryBody))
        .status,
      409,
    );
    const body = productInput.parse({
      categoryId: category.id,
      name: "Ângulo morto",
      slug: "angulo-morto",
      priceCents: 500,
      image: "/public-objects/teste.png",
      published: true,
      unit: "conjunto",
      minimumQuantity: 3,
      quantityStep: 2,
    });
    const productResponse = await request(
      "/api/admin/shop/products",
      "POST",
      body,
    );
    assert.equal(productResponse.status, 201);
    const product = await productResponse.json();
    const quoteResponse = await request("/api/shop/quote", "POST", {
      delivery: "pickup",
      items: [
        {
          type: "produto",
          shopProductId: product.id,
          quantidade: 5,
          precoTotal: 0.01,
        },
      ],
    });
    assert.equal(quoteResponse.status, 200);
    assert.equal((await quoteResponse.json()).total, 30.75);
    const settings = { ...DEFAULT_SHOP_SETTINGS, shippingCents: 1200 };
    assert.equal(
      (await request("/api/admin/shop/settings", "PUT", settings)).status,
      200,
    );
    assert.equal((await store.getCatalog()).settings.shippingCents, 1200);
    await request(`/api/admin/shop/products/${product.id}`, "PUT", {
      ...body,
      priceCents: 700,
    });
    assert.equal((await store.getCatalog()).products[0].priceCents, 700);
    await request(`/api/admin/shop/categories/${category.id}`, "PUT", {
      ...categoryBody,
      published: false,
    });
    assert.equal(
      (await (await request("/api/shop/catalog")).json()).products.length,
      0,
    );
    assert.equal(
      (
        await request("/api/shop/quote", "POST", {
          delivery: "pickup",
          items: [
            { type: "produto", shopProductId: product.id, quantidade: 5 },
          ],
        })
      ).status,
      400,
    );
    await assert.rejects(() =>
      pg.exec(
        `INSERT INTO shop_products (id,category_id,name,slug,price_cents) VALUES ('bad','${category.id}','Inválido','invalido',0)`,
      ),
    );
    await assert.rejects(() =>
      pg.exec(
        "INSERT INTO shop_products (id,category_id,name,slug,price_cents) VALUES ('bad','inexistente','Inválido','invalido',500)",
      ),
    );
    await pg.exec(migration);
    assert.deepEqual((await pg.query("select * from orders")).rows, before);
    assert.equal((await store.getCatalog()).products[0].priceCents, 700);
    assert.equal((await store.getCatalog()).settings.shippingCents, 1200);
  } finally {
    if (server)
      await new Promise<void>((resolve, reject) =>
        server!.close((e) => (e ? reject(e) : resolve())),
      );
    await pg.close();
    await rm(output, { force: true });
    delete (globalThis as any).__shopDatabaseFixture;
  }
});

test("migração recusa uma base que não pertence à loja do site principal", async () => {
  const wrong = new PGlite();
  try {
    await wrong.exec("CREATE TABLE pedidos (id serial PRIMARY KEY);");
    const migration = await readFile(
      "migrations/20261015_shop_catalog.sql",
      "utf8",
    );
    await assert.rejects(() => wrong.exec(migration), /Base incorreta/);
    await wrong.exec("ROLLBACK;");
    const result = await wrong.query(
      "select to_regclass('shop_categories') as nova, to_regclass('pedidos') as existente",
    );
    assert.equal((result.rows[0] as any).nova, null);
    assert.equal((result.rows[0] as any).existente, "pedidos");
  } finally {
    await wrong.close();
  }
});
