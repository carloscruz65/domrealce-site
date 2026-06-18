import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const SOCIAL_BOT_UA =
  /facebookexternalhit|facebot|twitterbot|whatsapp|linkedinbot|telegrambot|slackbot|discordbot|applebot|rogerbot|embedly|quora|outbrain|pinterest|vkshare|w3c_validator|redditbot/i;

function isSocialBot(ua: string): boolean {
  return SOCIAL_BOT_UA.test(ua);
}

function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function ogMetaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path.startsWith("/api")) return next();
  if (req.path.startsWith("/public-objects") || req.path.includes(".")) return next();
  if (req.method !== "GET") return next();

  const noticiaMatch = req.path.match(/^\/noticia\/(.+)$/);
  if (!noticiaMatch) return next();

  const ua = req.headers["user-agent"] || "";
  if (!isSocialBot(ua)) return next();

  const noticiaId = noticiaMatch[1];

  try {
    const noticias = await storage.getAllNews();
    const noticia = noticias.find(
      (n: any) => String(n.id) === String(noticiaId) || (n.slug && n.slug === noticiaId)
    );

    if (!noticia) return next();

    const origin = `${req.protocol}://${req.get("host")}`;
    const canonicalSlug = (noticia as any).slug || noticiaId;
    const pageUrl = `${origin}/noticia/${canonicalSlug}`;

    // Seleccionar a melhor imagem disponível:
    // 1. shareImage (definido manualmente no CMS — melhor opção)
    // 2. heroImageUrl (campo dedicado ao hero)
    // 3. Primeira imagem com "heroes" ou "hero" no caminho (dentro do array imagens)
    // 4. Primeira imagem do array que NÃO seja card/thumbnail
    // 5. Qualquer imagem disponível
    const imagensArr: string[] = Array.isArray(noticia.imagens) ? noticia.imagens : [];
    const heroFromArray =
      imagensArr.find((u) => /heroes?/i.test(u)) ||
      imagensArr.find((u) => !/cards?|thumb/i.test(u)) ||
      imagensArr[0] ||
      "";

    const rawHeroImage =
      (noticia as any).shareImage ||
      (noticia as any).heroImageUrl ||
      heroFromArray ||
      (noticia as any).imagem ||
      "";

    const rawImageUrl = rawHeroImage || `${origin}/og-default.jpg`;
    // Garantir URL absoluta
    const imageUrl = rawImageUrl.startsWith("http")
      ? rawImageUrl
      : `${origin}${rawImageUrl}`;

    const title = escapeHtml(
      (noticia as any).shareTitle || noticia.titulo || "DOMREALCE"
    );
    const description = escapeHtml(
      (
        (noticia as any).shareDescription ||
        noticia.descricao ||
        (noticia as any).resumo ||
        "Comunicação Visual e Impressão Digital — Portugal"
      ).slice(0, 200)
    );

    const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>${title} | DOMREALCE</title>
  <meta name="description" content="${description}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="DOMREALCE — Comunicação Visual" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="pt_PT" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

  <link rel="canonical" href="${escapeHtml(pageUrl)}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <a href="${escapeHtml(pageUrl)}">Ver no site DOMREALCE</a>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).send(html);
  } catch (error) {
    console.error("❌ OG Middleware erro:", error);
    return next();
  }
}
