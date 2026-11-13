import express, { type Express } from "express";
import type { Server } from "http";
import fs from "fs";
import path from "path";
import { frontendHtml } from "./frontendHtml";

export function log(message: string) {
  console.log(message);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await (
    await import("vite")
  ).createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  // ✅ API fallback: nunca servir SPA para /api/*
  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "API route not found",
      method: req.method,
      path: req.originalUrl,
    });
  });

  // ✅ SPA fallback (apenas para rotas não-API)
  app.use("*", async (req, res, next) => {
    try {
      if (req.method !== "GET" && req.method !== "HEAD") {
        return res.set("Allow", "GET, HEAD").status(405).end();
      }
      const url = req.originalUrl;

      // Segurança extra: se por alguma razão chegar aqui com /api, devolve JSON
      if (url.startsWith("/api")) {
        return res.status(404).json({
          error: "API route not found",
          method: req.method,
          path: req.originalUrl,
        });
      }

      const indexPath = path.resolve(process.cwd(), "client", "index.html");
      let template = fs.readFileSync(indexPath, "utf-8");

      template = await vite.transformIndexHtml(url, template);

      const page = frontendHtml(template, req.originalUrl.split("?")[0]);
      if (page.status === 404) res.set("X-Robots-Tag", "noindex");
      res.status(page.status).type("html").end(page.html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  // Static assets
  // A homepage passa pelo mesmo HTML inicial que as restantes rotas.
  app.use(express.static(distPath, { index: false }));

  // ✅ API fallback em produção (mesma regra)
  app.use("/api", (req, res) => {
    res.status(404).json({
      error: "API route not found",
      method: req.method,
      path: req.originalUrl,
    });
  });

  // ✅ SPA fallback (apenas não-API)
  app.use("*", (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return res.set("Allow", "GET, HEAD").status(405).end();
    }
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({
        error: "API route not found",
        method: req.method,
        path: req.originalUrl,
      });
    }

    const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
    const page = frontendHtml(template, req.originalUrl.split("?")[0]);
    if (page.status === 404) res.set("X-Robots-Tag", "noindex");
    res.status(page.status).type("html").send(page.html);
  });
}

