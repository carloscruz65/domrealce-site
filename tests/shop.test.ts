import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import express from "express";
import {
  DEFAULT_SHOP_SETTINGS,
  categoryInput,
  productInput,
  settingsInput,
  slugify,
  type ShopCatalog,
} from "../shared/shop-catalog";
import {
  quoteShopCart,
  normalizeShopLine,
  canvasOptions,
} from "../shared/shop-pricing";
import { registerShopCatalogRoutes } from "../server/shop/routes";
import { protegerAdmin } from "../server/middleware";
import type { CatalogStore } from "../server/shop/store";
const categoryId = randomUUID(),
  productId = randomUUID();
const category = {
  id: categoryId,
  ...categoryInput.parse({
    name: "Autocolantes",
    slug: "autocolantes",
    published: true,
  }),
};
const product = {
  id: productId,
  ...productInput.parse({
    categoryId,
    name: "Ângulo morto",
    slug: "angulo-morto",
    image: "/public-objects/teste.png",
    priceCents: 500,
    published: true,
    minimumQuantity: 3,
    quantityStep: 2,
    unit: "conjunto",
    specifications: "Conjunto de 3 autocolantes",
  }),
};
const catalog = (): ShopCatalog =>
  structuredClone({
    categories: [category],
    products: [product],
    settings: DEFAULT_SHOP_SETTINGS,
  });
const canvas = (tamanho = "20x30", quantidade = 1) => ({
  type: "quadros-canvas",
  tamanho,
  quantidade,
  precoTotal: 9999,
});
const ready = (quantidade = 3) => ({
  type: "produto",
  shopProductId: productId,
  quantidade,
});

test("canvas uses net price, corrects cached IVA and applies IVA once", () => {
  const result = quoteShopCart(
    [{ ...canvas(), precoTotal: 18.45 }],
    catalog(),
    "pickup",
  );
  assert.equal(result.subtotal, 15);
  assert.equal(result.iva, 3.45);
  assert.equal(result.total, 18.45);
  assert.equal(
    normalizeShopLine({ ...canvas(), precoTotal: 18.45 }, catalog()).precoTotal,
    15,
  );
});
test("all eight canvas dimensions match the advertised sizes", () => {
  for (const option of canvasOptions()) {
    const quote = quoteShopCart([canvas(option.size)], catalog(), "pickup");
    assert.equal(
      `${quote.items[0].larguraCm}x${quote.items[0].alturaCm}`,
      option.size,
    );
    assert.equal(quote.subtotal, option.price);
  }
});
test("wallpaper recomputes area, ignores fake client price and adds vinyl lamination", () => {
  const quote = quoteShopCart(
    [
      {
        type: "papel-parede",
        larguraCm: 150,
        alturaCm: 100,
        material: "vinil",
        laminacao: true,
        precoTotal: 0.01,
        area: 100,
      },
    ],
    catalog(),
    "pickup",
  );
  assert.equal(quote.subtotal, 42);
  assert.equal(quote.iva, 9.66);
  assert.equal(quote.items[0].area, 1.5);
  const paper = quoteShopCart(
    [
      {
        type: "papel-parede",
        larguraCm: 150,
        alturaCm: 100,
        material: "papel",
        laminacao: true,
      },
    ],
    catalog(),
    "pickup",
  );
  assert.equal(paper.subtotal, 30);
});
test("wallpaper requires dimensions and material", () => {
  for (const line of [
    { type: "papel-parede", larguraCm: 99, alturaCm: 100, material: "papel" },
    { type: "papel-parede", larguraCm: 100, alturaCm: 100 },
  ]) {
    assert.throws(() => quoteShopCart([line], catalog(), "pickup"));
  }
});
test("ready product stores the real name, image, set and price rather than client substitutions", () => {
  const result = quoteShopCart(
    [
      {
        ...ready(),
        productName: "Fake",
        productImage: "fake",
        precoTotal: 0.01,
      },
    ],
    catalog(),
    "pickup",
  );
  assert.equal(result.subtotal, 15);
  assert.equal(result.total, 18.45);
  assert.equal(result.items[0].productName, "Ângulo morto");
  assert.equal(result.items[0].unit, "conjunto");
  assert.equal(result.items[0].productImage, product.image);
});
for (const q of [0, -1, 1.1, "3", 100001, NaN, Infinity])
  test(`reject invalid quantity ${String(q)}`, () => {
    assert.throws(() =>
      quoteShopCart([{ ...ready(), quantidade: q }], catalog(), "pickup"),
    );
  });
test("minimum and increments apply to every purchase", () => {
  assert.throws(() => quoteShopCart([ready(1)], catalog(), "pickup"));
  assert.throws(() => quoteShopCart([ready(4)], catalog(), "pickup"));
  assert.equal(quoteShopCart([ready(5)], catalog(), "pickup").subtotal, 25);
});
test("draft or removed products and categories cannot be bought", () => {
  for (const variant of ["product", "category", "removed"] as const) {
    const data = catalog();
    if (variant === "product") data.products[0].published = false;
    else if (variant === "category") data.categories[0].published = false;
    else data.products = [];
    assert.throws(() => quoteShopCart([ready()], data, "pickup"));
  }
});
test("old order snapshots are unaffected when catalogue prices change", () => {
  const data = catalog(),
    old = quoteShopCart([ready()], data, "pickup");
  data.products[0].priceCents = 900;
  assert.equal(old.items[0].precoTotal, 5);
  assert.equal(old.total, 18.45);
  assert.equal(quoteShopCart([ready()], data, "pickup").subtotal, 27);
});
test("mixed cart, shipping and free-shipping boundary use net amounts", () => {
  const quote = quoteShopCart([canvas(), ready()], catalog(), "delivery");
  assert.equal(quote.subtotal, 30);
  assert.equal(quote.envio, 10);
  assert.equal(quote.iva, 9.2);
  assert.equal(quote.total, 49.2);
  assert.equal(
    quoteShopCart([canvas("50x70", 2)], catalog(), "delivery").envio,
    0,
  );
  assert.equal(quoteShopCart([canvas()], catalog(), "pickup").envio, 0);
});
test("fractional cents are rounded once per item and once for final IVA", () => {
  const data = catalog();
  data.products[0].priceCents = 1;
  data.products[0].minimumQuantity = 1;
  data.products[0].quantityStep = 1;
  const quote = quoteShopCart([ready(3)], data, "pickup");
  assert.equal(quote.subtotal, 0.03);
  assert.equal(quote.iva, 0.01);
  assert.equal(quote.total, 0.04);
});
test("malformed, unknown, empty, oversized carts and invalid delivery are rejected", () => {
  for (const items of [
    [],
    [null],
    [[]],
    [{ type: "unknown" }],
    Array(101).fill(canvas()),
  ])
    assert.throws(() => quoteShopCart(items as any, catalog(), "pickup"));
  assert.throws(() => quoteShopCart([canvas("made-up")], catalog(), "pickup"));
  assert.throws(() => quoteShopCart([canvas()], catalog(), "invalid"));
});
test("catalogue input validation rejects unsafe URLs, prices and unexpected fields", () => {
  const { id, ...valid } = product;
  assert.equal(productInput.safeParse(valid).success, true);
  for (const patch of [
    { image: "javascript:alert(1)" },
    { image: "//example.com/a" },
    { priceCents: 0 },
    { priceCents: 1.2 },
    { priceCents: 500, injected: true },
    { published: true, image: "" },
  ])
    assert.equal(productInput.safeParse({ ...valid, ...patch }).success, false);
  assert.equal(
    settingsInput.safeParse({ ...DEFAULT_SHOP_SETTINGS, shippingCents: -1 })
      .success,
    false,
  );
  assert.equal(slugify("Ângulo Morto — Camiões"), "angulo-morto-camioes");
});

test("HTTP catalogue and admin CRUD use production auth and fail closed", async () => {
  const savedEnv = {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    ADMIN_REPLIT_IDS: process.env.ADMIN_REPLIT_IDS,
  };
  process.env.NODE_ENV = "production";
  process.env.ADMIN_TOKEN = "test-only-token";
  process.env.ADMIN_REPLIT_IDS = "approved";
  const data = catalog();
  let writes = 0;
  const store: CatalogStore = {
    async getCatalog() {
      return structuredClone(data);
    },
    async saveCategory(id, input) {
      writes++;
      if (data.categories.some((c) => c.slug === input.slug && c.id !== id))
        throw Object.assign(new Error("duplicate"), { code: "23505" });
      if (id) {
        const index = data.categories.findIndex((c) => c.id === id);
        if (index < 0) return undefined;
        return (data.categories[index] = { ...input, id });
      }
      const result = { ...input, id: randomUUID() };
      data.categories.push(result);
      return result;
    },
    async saveProduct(id, input) {
      writes++;
      if (id) {
        const index = data.products.findIndex((p) => p.id === id);
        if (index < 0) return undefined;
        return (data.products[index] = { ...input, id });
      }
      const result = { ...input, id: randomUUID() };
      data.products.push(result);
      return result;
    },
    async saveSettings(settings) {
      writes++;
      data.settings = settings;
    },
  };
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).isAuthenticated = () => req.get("x-test-user") !== undefined;
    (req as any).user = { claims: { sub: req.get("x-test-user") } };
    next();
  });
  app.use("/api/admin", protegerAdmin);
  registerShopCatalogRoutes(app, store, protegerAdmin);
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const request = (
    path: string,
    method = "GET",
    body?: unknown,
    headers: Record<string, string> = {},
  ) =>
    fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  const auth = { "x-admin-token": "test-only-token" };
  try {
    for (const [path, method, body] of [
      ["/api/admin/shop", "GET", undefined],
      ["/api/admin/shop/products", "POST", {}],
      ["/api/admin/shop/categories", "POST", {}],
      ["/api/admin/shop/settings", "PUT", {}],
    ]) {
      assert.equal(
        (await request(path as string, method as string, body)).status,
        403,
      );
    }
    assert.equal(writes, 0);
    assert.equal(
      (
        await request("/api/admin/shop", "GET", undefined, {
          "x-test-user": "outsider",
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await request("/api/admin/shop", "GET", undefined, {
          "x-test-user": "approved",
        })
      ).status,
      200,
    );
    const created = await request(
      "/api/admin/shop/categories",
      "POST",
      { name: "Sinalização", slug: "sinalizacao" },
      auth,
    );
    assert.equal(created.status, 201);
    const draft = await created.json();
    assert.equal(draft.published, false);
    let visible = await (await request("/api/shop/catalog")).json();
    assert.equal(visible.categories.length, 1);
    assert.equal(
      (
        await request(
          "/api/admin/shop/categories",
          "POST",
          { name: "Duplicate", slug: "sinalizacao" },
          auth,
        )
      ).status,
      409,
    );
    assert.equal(
      (await request("/api/admin/shop/categories/bad-id", "PUT", {}, auth))
        .status,
      400,
    );
    assert.equal(
      (
        await request(
          `/api/admin/shop/categories/${randomUUID()}`,
          "PUT",
          { name: "Missing", slug: "missing" },
          auth,
        )
      ).status,
      404,
    );
    const { id: _id, ...input } = product;
    assert.equal(
      (
        await request(
          "/api/admin/shop/products",
          "POST",
          { ...input, slug: "draft", published: false },
          auth,
        )
      ).status,
      201,
    );
    visible = await (await request("/api/shop/catalog")).json();
    assert.equal(visible.products.length, 1);
    assert.equal(
      (
        await request(
          "/api/admin/shop/products",
          "POST",
          { ...input, categoryId: randomUUID() },
          auth,
        )
      ).status,
      400,
    );
    const quoteResponse = await request("/api/shop/quote", "POST", {
      items: [ready()],
      delivery: "pickup",
    });
    assert.equal(quoteResponse.status, 200);
    assert.equal((await quoteResponse.json()).total, 18.45);
    assert.equal(
      (
        await request("/api/shop/quote", "POST", {
          items: [null],
          delivery: "pickup",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          "/api/admin/shop/settings",
          "PUT",
          { ...DEFAULT_SHOP_SETTINGS, shippingCents: 1500 },
          auth,
        )
      ).status,
      200,
    );
    const quote2 = await (
      await request("/api/shop/quote", "POST", {
        items: [ready()],
        delivery: "delivery",
      })
    ).json();
    assert.equal(quote2.envio, 15);
    data.categories[0].published = false;
    visible = await (await request("/api/shop/catalog")).json();
    assert.equal(visible.products.length, 0);
    assert.equal(
      (
        await request("/api/shop/quote", "POST", {
          items: [ready()],
          delivery: "pickup",
        })
      ).status,
      400,
    );
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    for (const [key, value] of Object.entries(savedEnv))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
});
