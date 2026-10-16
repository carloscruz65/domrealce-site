import assert from "node:assert/strict";
import { test } from "node:test";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { build } from "esbuild";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import express from "express";
import { DEFAULT_SHOP_SETTINGS } from "../shared/shop-catalog";

test("real order and PayPal routes price the same cart, reject changed totals and never charge a substituted amount", async () => {
  const categoryId = randomUUID(),
    productId = randomUUID();
  const data = {
    categories: [{ id: categoryId, name: "Autocolantes", published: true }],
    products: [
      {
        id: productId,
        categoryId,
        name: "Ângulo morto",
        image: "/public-objects/a.png",
        specifications: "Conjunto de 3",
        unit: "conjunto",
        published: true,
        priceCents: 500,
        minimumQuantity: 3,
        quantityStep: 2,
      },
    ],
    settings: DEFAULT_SHOP_SETTINGS,
  };
  const orders: any[] = [],
    paypalAmounts: any[] = [];
  (globalThis as any).__shopCheckoutFixture = {
    catalog: data,
    storage: {
      async createOrder(input: any) {
        const order = { ...input, id: randomUUID() };
        orders.push(order);
        return order;
      },
    },
  };
  const mocks: Record<string, string> = {
    "./storage":
      "export const storage = globalThis.__shopCheckoutFixture.storage;",
    "./replitAuth": "export async function setupAuth() {}",
    "./email":
      "export const sendContactEmail=()=>{}; export const sendAutoReplyEmail=()=>{}; export const testEmailConnection=()=>{};",
    "./objectStorage": "export class ObjectStorageService {}",
    "./ifthenpay": "export const createIfthenPayService=()=>({});",
    "./service-pages/routes": "export function registerServicePageRoutes() {}",
    "./shop/store":
      "export const catalogStore={getCatalog:async(options)=>{if(options?.allowLegacy!==true)throw new Error('Checkout must allow existing shop before catalog migration');return globalThis.__shopCheckoutFixture.catalog;}};",
    "./visual-editor": [
      "getPageContent",
      "savePageContentEndpoint",
      "getMediaIndex",
      "getMediaFolders",
      "syncGlobalImages",
      "uploadMediaFiles",
      "deleteMediaFiles",
    ]
      .map((name) => `export const ${name}=()=>{};`)
      .join("\n"),
  };
  const temp = path.resolve(
    "node_modules/.cache/shop-checkout-routes.test.mjs",
  );
  await mkdir(path.dirname(temp), { recursive: true });
  await build({
    entryPoints: ["server/routes.ts"],
    outfile: temp,
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    logLevel: "silent",
    plugins: [
      {
        name: "isolated-services",
        setup(b) {
          b.onResolve({ filter: /.*/ }, (args) =>
            args.importer.endsWith("/server/routes.ts") && mocks[args.path]
              ? { path: args.path, namespace: "fixture" }
              : undefined,
          );
          b.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
            contents: mocks[args.path],
            loader: "js",
          }));
        },
      },
    ],
  });
  const originalFetch = globalThis.fetch,
    savedId = process.env.PAYPAL_CLIENT_ID,
    savedSecret = process.env.PAYPAL_CLIENT_SECRET;
  process.env.PAYPAL_CLIENT_ID = "test-only";
  process.env.PAYPAL_CLIENT_SECRET = "test-only";
  globalThis.fetch = (async (url: any, options: any) => {
    if (String(url).startsWith("https://api-m.paypal.com")) {
      if (String(url).endsWith("/v1/oauth2/token"))
        return new Response(
          JSON.stringify({ access_token: "fake-test-token" }),
          { status: 200 },
        );
      paypalAmounts.push(
        JSON.parse(options.body).purchase_units[0].amount.value,
      );
      return new Response(JSON.stringify({ id: "PAYPAL-TEST" }), {
        status: 200,
      });
    }
    throw new Error("External requests are forbidden during this test");
  }) as typeof fetch;
  const { registerRoutes } = await import(pathToFileURL(temp).href);
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const input = {
    numeroEncomenda: "TEST",
    clienteNome: "Cliente Teste",
    clienteEmail: "teste@example.com",
    clienteMorada: "Rua Teste 123",
    clienteCodigoPostal: "1000-001",
    clienteCidade: "Lisboa",
    itens: [
      {
        type: "produto",
        shopProductId: productId,
        quantidade: 3,
        precoTotal: 0.01,
        productName: "Fake",
      },
    ],
    subtotal: "0.01",
    envio: "0",
    iva: "0",
    total: "18.45",
    metodoEntrega: "pickup",
    metodoPagamento: "mbway",
    estado: "paga",
    estadoPagamento: "pago",
  };
  const request = (route: string, body: any) =>
    originalFetch(base + route, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    const first = await request("/api/orders", input);
    assert.equal(first.status, 200);
    const saved = (await first.json()).order;
    assert.equal(saved.total, "18.45");
    assert.equal(saved.iva, "3.45");
    assert.equal(saved.subtotal, "15.00");
    assert.equal(saved.itens[0].productName, "Ângulo morto");
    assert.equal(saved.estado, "pendente");
    assert.equal(saved.estadoPagamento, "pendente");
    const paypal = await request("/api/payments/paypal/create-order", {
      ...input,
      metodoPagamento: "paypal",
    });
    assert.equal(paypal.status, 200);
    assert.deepEqual(paypalAmounts, ["18.45"]);
    assert.equal(orders[1].total, "18.45");
    for (const route of ["/api/orders", "/api/payments/paypal/create-order"]) {
      assert.equal(
        (await request(route, { ...input, total: "0.01" })).status,
        409,
      );
      assert.equal(
        (
          await request(route, {
            ...input,
            itens: [{ ...input.itens[0], quantidade: 1 }],
          })
        ).status,
        400,
      );
    }
    assert.equal(orders.length, 2);
    data.products[0].priceCents = 600;
    for (const route of ["/api/orders", "/api/payments/paypal/create-order"])
      assert.equal((await request(route, input)).status, 409);
    assert.equal(orders.length, 2);
    assert.deepEqual(paypalAmounts, ["18.45"]);
    data.products[0].published = false;
    for (const route of ["/api/orders", "/api/payments/paypal/create-order"])
      assert.equal((await request(route, input)).status, 400);
  } finally {
    globalThis.fetch = originalFetch;
    delete (globalThis as any).__shopCheckoutFixture;
    if (savedId === undefined) delete process.env.PAYPAL_CLIENT_ID;
    else process.env.PAYPAL_CLIENT_ID = savedId;
    if (savedSecret === undefined) delete process.env.PAYPAL_CLIENT_SECRET;
    else process.env.PAYPAL_CLIENT_SECRET = savedSecret;
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(temp, { force: true });
  }
});
