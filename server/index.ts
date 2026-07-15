import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ogMetaMiddleware } from "./ogMiddleware";

const app = express();

// ✅ DEBUG: confirma que este ficheiro é mesmo o que está a correr
log(`✅ BOOT entrypoint: ${import.meta.url}`);

// ✅ DEBUG: marca e loga qualquer chamada /api logo à entrada (não responde, só observa)
app.use("/api", (req, _res, next) => {
  log(`🔎 API IN: ${req.method} ${req.originalUrl}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",

      // script-src: controla eval/inline e scripts genéricos
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://www.googletagmanager.com https://www.google-analytics.com " +
        "https://www.googleadservices.com https://googleads.g.doubleclick.net " +
        "https://maps.googleapis.com " +
        "https://www.paypal.com https://www.sandbox.paypal.com " +
        "https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms " +
        "https://connect.facebook.net " +
        "https://app.trysoro.com",

      // script-src-elem: controla <script src="..."> — browsers modernos verificam esta separadamente
      "script-src-elem 'self' 'unsafe-inline' " +
        "https://www.googletagmanager.com https://www.google-analytics.com " +
        "https://www.googleadservices.com https://googleads.g.doubleclick.net " +
        "https://maps.googleapis.com " +
        "https://www.paypal.com https://www.sandbox.paypal.com " +
        "https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms " +
        "https://connect.facebook.net " +
        "https://app.trysoro.com",

      // Styles
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

      // Fonts
      "font-src 'self' https://fonts.gstatic.com",

      // Imagens (inclui pixel img/track)
      "img-src 'self' data: blob: https: http: " +
        "https://www.google.com https://www.google-analytics.com " +
        "https://www.googleadservices.com https://googleads.g.doubleclick.net " +
        "https://www.facebook.com https://connect.facebook.net " +
        "https://maps.gstatic.com https://maps.googleapis.com " +
        "https://www.paypal.com https://www.sandbox.paypal.com " +
        "https://*.clarity.ms https://*.bing.com",

      // Ligações (calls do pixel/analytics)
      "connect-src 'self' " +
        "https://www.googletagmanager.com " +
        "https://www.google-analytics.com https://region1.google-analytics.com " +
        "https://*.google-analytics.com " +
        "https://region1.analytics.google.com https://*.analytics.google.com " +
        "https://www.googleadservices.com " +
        "https://www.google.com https://*.google.com " +
        "https://www.doubleclick.net https://*.doubleclick.net " +
        "https://ad.doubleclick.net https://googleads.g.doubleclick.net " +
        "https://stats.g.doubleclick.net " +
        "https://www.facebook.com https://connect.facebook.net " +
        "https://graph.facebook.com " +
        "https://maps.googleapis.com " +
        "https://www.paypal.com https://www.sandbox.paypal.com " +
        "https://www.clarity.ms https://*.clarity.ms https://*.bing.com https://bat.bing.com " +
        "https://app.trysoro.com https://*.trysoro.com",

      // Iframes
      "frame-src 'self' " +
        "https://www.googletagmanager.com " +
        "https://www.facebook.com https://connect.facebook.net " +
        "https://app.trysoro.com https://*.trysoro.com",
    ].join("; ")
  );

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger só para /api (mantém o teu)
app.use((req, res, next) => {
  const start = Date.now();
  const p = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (p.startsWith("/api")) {
      let logLine = `${req.method} ${p} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // ✅ 404 JSON para /api/* que não exista (ANTES do Vite/Static)
  app.use("/api", (req, res) => {
    // header para confirmar no DevTools
    res.setHeader("X-DOMREALCE-API-404", "1");
    res.status(404).json({
      error: "API route not found",
      method: req.method,
      path: req.originalUrl,
    });
  });

  // Error handler (sem throw)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    if (res.headersSent) return;
    res.status(status).json({ message });
    log(`❌ Error ${status}: ${message}`);
    if (err?.stack) log(err.stack);
  });

  // OG middleware só para frontend (nunca /api)
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) return next();
    return ogMetaMiddleware(req, res, next);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
