import type { Express, RequestHandler } from "express";
import { z } from "zod";
import {
  categoryInput,
  productInput,
  settingsInput,
} from "../../shared/shop-catalog";
import { quoteShopCart } from "../../shared/shop-pricing";
import type { CatalogStore } from "./store";

export function registerShopCatalogRoutes(
  app: Express,
  store: CatalogStore,
  admin: RequestHandler,
) {
  const wrap =
    (fn: RequestHandler): RequestHandler =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        if (error instanceof z.ZodError)
          return res
            .status(400)
            .json({ error: error.issues.map((i) => i.message).join(" ") });
        const code = error?.code ?? error?.cause?.code;
        if (code === "23505")
          return res
            .status(409)
            .json({
              error:
                "Já existe um artigo ou categoria com este endereço. Escolha outro slug.",
            });
        console.error("Falha no catálogo da loja", error);
        res
          .status(503)
          .json({
            error:
              "A loja está temporariamente indisponível. Tente novamente mais tarde.",
          });
      });
    };
  app.get(
    "/api/shop/catalog",
    wrap(async (_req, res) => {
      const catalog = await store.getCatalog({ allowLegacy: true });
      const categories = catalog.categories.filter((c) => c.published);
      res.setHeader("Cache-Control", "no-store");
      res.json({
        categories,
        products: catalog.products.filter(
          (p) => p.published && categories.some((c) => c.id === p.categoryId),
        ),
        settings: catalog.settings,
      });
    }),
  );
  app.post(
    "/api/shop/quote",
    wrap(async (req, res) => {
      const catalog = await store.getCatalog({ allowLegacy: true });
      try {
        res.setHeader("Cache-Control", "no-store");
        res.json(quoteShopCart(req.body.items, catalog, req.body.delivery));
      } catch (error) {
        if (error instanceof Error && !("code" in error))
          return res.status(400).json({ error: error.message });
        throw error;
      }
    }),
  );
  app.get(
    "/api/admin/shop",
    admin,
    wrap(async (_req, res) => {
      res.setHeader("Cache-Control", "no-store");
      res.json(await store.getCatalog());
    }),
  );
  const id = z.string().uuid();
  for (const method of ["post", "put"] as const) {
    app[method](
      "/api/admin/shop/categories" + (method === "put" ? "/:id" : ""),
      admin,
      wrap(async (req, res) => {
        const key = method === "put" ? id.parse(req.params.id) : null;
        const saved = await store.saveCategory(
          key,
          categoryInput.parse(req.body),
        );
        if (!saved)
          return res.status(404).json({ error: "Categoria não encontrada." });
        res.status(key ? 200 : 201).json(saved);
      }),
    );
    app[method](
      "/api/admin/shop/products" + (method === "put" ? "/:id" : ""),
      admin,
      wrap(async (req, res) => {
        const key = method === "put" ? id.parse(req.params.id) : null;
        const input = productInput.parse(req.body);
        if (
          !(await store.getCatalog()).categories.some(
            (c) => c.id === input.categoryId,
          )
        )
          return res
            .status(400)
            .json({ error: "Escolha uma categoria existente." });
        const saved = await store.saveProduct(key, input);
        if (!saved)
          return res.status(404).json({ error: "Produto não encontrado." });
        res.status(key ? 200 : 201).json(saved);
      }),
    );
  }
  app.put(
    "/api/admin/shop/settings",
    admin,
    wrap(async (req, res) => {
      const input = settingsInput.parse(req.body);
      await store.saveSettings(input);
      res.json(input);
    }),
  );
}
