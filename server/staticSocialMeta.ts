import { pageSEOData, DEFAULT_SOCIAL_IMAGE, SITE_CANONICAL_ORIGIN } from "../shared/page-seo";
import { getPublicServicePage } from "./service-pages/storage";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function staticSocialHtml(path: string): Promise<string | null> {
  const route = path.replace(/\/+$/, "") || "/";
  // Exact allowlist only: never intercept checkout, admin, APIs or unknown URLs.
  const page = pageSEOData[route];
  if (!page || route === "/loja-papel-parede") return null;

  let title = page.title!;
  let description = page.description!;
  if (route === "/servico-autocolantes") {
    try {
      // Match the live page's CMS precedence without initializing or changing data.
      const cms = await getPublicServicePage("autocolantes");
      title = cms?.seo?.title || title;
      description = cms?.seo?.description || description;
    } catch (error) {
      console.error("OG: não foi possível ler SEO de Autocolantes; a usar metadados estáticos.", error);
    }
  }

  const url = escapeHtml(`${SITE_CANONICAL_ORIGIN}${route}`);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const image = escapeHtml(page.image || DEFAULT_SOCIAL_IMAGE);
  return `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${page.type || "website"}" />
  <meta property="og:site_name" content="DOMREALCE" />
  <meta property="og:locale" content="pt_PT" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:alt" content="DOMREALCE — Comunicação Visual" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <h1>${safeTitle}</h1>
  <p>${safeDescription}</p>
  <a href="${url}">Ver no site DOMREALCE</a>
</body>
</html>`;
}
