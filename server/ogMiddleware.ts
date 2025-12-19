import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function ogMetaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * 🛑 REGRA DE OURO
   * Nunca, em circunstância nenhuma, interceptar rotas /api/*
   */
  if (req.path.startsWith("/api")) {
    return next();
  }

  /**
   * 🛑 Nunca mexer em assets / ficheiros
   */
  if (
    req.path.startsWith("/public-objects") ||
    req.path.includes(".")
  ) {
    return next();
  }

  /**
   * 🛑 Só responder a GET
   */
  if (req.method !== "GET") {
    return next();
  }

  /**
   * ✅ Apenas interceptar rotas de notícia individuais
   * Ex: /noticia/123
   */
  const noticiaMatch = req.path.match(/^\/noticia\/(.+)$/);

  if (!noticiaMatch) {
    return next();
  }

  const noticiaId = noticiaMatch[1];
  console.log("🔎 OG Middleware: notícia", noticiaId);

  try {
    const noticias = await storage.getAllNews();
    const noticia = noticias.find(
      (n: any) => String(n.id) === String(noticiaId)
    );

    if (!noticia) {
      return next();
    }

    const imagemNoticia =
      noticia.imagens?.[0] ||
      noticia.image ||
      "";

    const isDev = process.env.NODE_ENV === "development";

    const indexPath = isDev
      ? path.join(process.cwd(), "client", "index.html")
      : path.join(process.cwd(), "dist", "public", "index.html");

    if (!fs.existsSync(indexPath)) {
      console.error("❌ OG Middleware: index.html não encontrado");
      return next();
    }

    let html = fs.readFileSync(indexPath, "utf-8");

    html = html
      .replace(/__OG_TITLE__/g, noticia.titulo || "DOMREALCE")
      .replace(
        /__OG_DESCRIPTION__/g,
        noticia.resumo || "Notícia DOMREALCE"
      )
      .replace(
        /__OG_IMAGE__/g,
        imagemNoticia
          ? `https://www.domrealce.com${imagemNoticia}`
          : "https://www.domrealce.com/og-default.jpg"
      )
      .replace(
        /__OG_URL__/g,
        `https://www.domrealce.com/noticia/${noticiaId}`
      );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (error) {
    console.error("❌ OG Middleware erro:", error);
    return next();
  }
}
