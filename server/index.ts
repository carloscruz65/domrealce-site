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
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http: https://maps.gstatic.com https://maps.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com",
      "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com",
      "frame-src https://www.paypal.com https://www.sandbox.paypal.com",
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