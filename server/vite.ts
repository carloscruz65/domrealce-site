import type { Express } from "express";
import type { Server } from "http";
import fs from "fs";
import path from "path";

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

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");

  // Static assets
  app.use(require("express").static(distPath));

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
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({
        error: "API route not found",
        method: req.method,
        path: req.originalUrl,
      });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}
