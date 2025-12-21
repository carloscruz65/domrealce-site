import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./replitAuth";
import {
  insertContactSchema,
  insertProductSchema,
  insertNewsSchema,
  insertSlideSchema,
  insertPageConfigSchema,
  insertOrderSchema,
  insertServiceGallerySchema,
  insertServiceHeroSchema,
  type Contact,
  type Order
} from "@shared/schema";
import { sendContactEmail, sendAutoReplyEmail } from "./email";
import { ObjectStorageService } from "./objectStorage";
import { createIfthenPayService, type PaymentMethod } from "./ifthenpay";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { protegerAdmin } from "./middleware";
import { randomUUID } from "crypto";

// ✅ Recriar __dirname para ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

import {
  getPageContent,
  savePageContentEndpoint,
  getMediaIndex,
  getMediaFolders,
  syncGlobalImages,
  uploadMediaFiles,
  deleteMediaFiles
} from "./visual-editor";

/**
 * Helpers
 */
function makeRequestId() {
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function safeErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function logRouteError(requestId: string, label: string, err: unknown) {
  console.error(`❌ [${requestId}] ${label}`);
  if (err instanceof Error) {
    console.error(err.message);
    if (err.stack) console.error(err.stack);
  } else {
    console.error(err);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit authentication
  await setupAuth(app);

  // Rate limiting for contact form
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
      success: false,
      message: "Muitas tentativas. Tente novamente em 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  // Object storage service
  const objectStorageService = new ObjectStorageService();

  // Configure multer for file uploads (genérico)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  });

  // Multer específico para o formulário de contacto (até 5 ficheiros, 20MB cada)
  const contactUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024,
      files: 5
    }
  });

  // IfthenPay service
  const ifthenPayService = createIfthenPayService();

  // =========================================
  // AUTH STATUS
  // =========================================
  app.get("/api/auth/status", async (req: Request, res: Response) => {
    const isLocalhost =
      req.hostname === "localhost" ||
      req.hostname === "127.0.0.1" ||
      req.hostname.startsWith("192.168.");

    if (process.env.NODE_ENV === "development" && isLocalhost) {
      return res.json({
        authenticated: true,
        user: { name: "Dev User", mode: "development" }
      });
    }

    if (req.isAuthenticated && req.isAuthenticated()) {
      const user = (req as any).user;
      return res.json({
        authenticated: true,
        user: {
          name: user?.claims?.name || user?.name || "Admin",
          email: user?.claims?.email || user?.email
        }
      });
    }

    return res.json({ authenticated: false });
  });

  // =========================================
  // MEDIA MANAGEMENT (Object Storage) - PROTECTED
  // =========================================

  // List all files organized by folders
  app.get("/api/media/list", protegerAdmin, async (req: Request, res: Response) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();

      const organized: Record<string, string[]> = {};
      files.forEach(filePath => {
        const parts = filePath.split("/");
        if (parts.length > 1) {
          const folder = parts[0];
          if (!organized[folder]) organized[folder] = [];
          organized[folder].push(filePath);
        } else {
          if (!organized["root"]) organized["root"] = [];
          organized["root"].push(filePath);
        }
      });

      res.json({
        success: true,
        files: organized,
        total: files.length
      });
    } catch (error) {
      logRouteError(requestId, "GET /api/media/list failed", error);
      res.status(500).json({
        success: false,
        error: "Failed to list media files",
        requestId
      });
    }
  });

  /**
   * ✅ FIX: /api/media/upload estava DUPLICADO (admin single + visual-editor multi).
   * Agora existe UMA rota só, protegida por admin, que aceita:
   * - single file (field: "file") -> comportamento antigo de admin upload por categoria
   * - multi files (field: "files") -> encaminha para uploadMediaFiles do visual-editor
   */
  app.post("/api/media/upload", protegerAdmin, upload.any(), async (req: Request, res: Response, next: NextFunction) => {
    const requestId = makeRequestId();
    try {
      const files = (req.files as Express.Multer.File[]) || [];

      if (!files.length) {
        return res.status(400).json({
          success: false,
          error: "No file(s) provided",
          requestId
        });
      }

      // Se vier com fieldname "files" (multi) ou vierem vários ficheiros, usa o visual-editor handler
      const looksLikeMulti =
        files.length > 1 ||
        files.some(f => f.fieldname === "files") ||
        (Array.isArray(req.body?.files) && req.body.files.length > 0);

      if (looksLikeMulti) {
        // delega para o handler do visual editor (já com req.files preenchido)
        return uploadMediaFiles(req, res, next);
      }

      // Caso single (compatibilidade com o endpoint antigo)
      const file = files[0];
      const category = (req.body?.category as string) || "outros";
      const fileName = file.originalname;
      const filePath = `${category}/${fileName}`;

      await objectStorageService.uploadPublicFile(filePath, file.buffer, file.mimetype);

      return res.json({
        success: true,
        filePath,
        message: "File uploaded successfully",
        requestId
      });
    } catch (error) {
      logRouteError(requestId, "POST /api/media/upload failed", error);
      return res.status(500).json({
        success: false,
        error: "Failed to upload file(s)",
        requestId,
        details: safeErrorMessage(error)
      });
    }
  });

  // Delete file from object storage
  app.delete("/api/media/delete", protegerAdmin, async (req: Request, res: Response) => {
    const requestId = makeRequestId();
    try {
      const { filePath } = req.body;

      if (!filePath) {
        return res.status(400).json({
          success: false,
          error: "File path is required",
          requestId
        });
      }

      const deleted = await objectStorageService.deletePublicFile(filePath);

      if (deleted) {
        return res.json({
          success: true,
          message: "File deleted successfully",
          requestId
        });
      }

      return res.status(404).json({
        success: false,
        error: "File not found",
        requestId
      });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/media/delete failed", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete file",
        requestId
      });
    }
  });

  // =========================================
  // OBJECT STORAGE endpoints for Visual Editor
  // =========================================

  app.post("/api/objects/upload-file", upload.single("file"), async (req, res) => {
    const requestId = makeRequestId();
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided", requestId });
      }

      const folder = (req.body.folder as string) || "uploads";
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}-${req.file.originalname}`;

      console.log(`📤 Uploading file: ${fileName}`);

      await objectStorageService.uploadPublicFile(fileName, req.file.buffer, req.file.mimetype);

      const publicUrl = `/public-objects/${fileName}`;
      console.log(`✅ Upload successful: ${publicUrl}`);

      res.json({
        success: true,
        url: publicUrl,
        fileName: req.file.originalname,
        requestId
      });
    } catch (error) {
      logRouteError(requestId, "POST /api/objects/upload-file failed", error);
      res.status(500).json({ error: "Failed to upload file", requestId });
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { fileName } = req.body;
      if (!fileName) {
        return res.status(400).json({ error: "fileName is required", requestId });
      }

      console.log(`📤 Generating upload URL for: ${fileName}`);
      const uploadURL = await objectStorageService.getPublicUploadURL(fileName);
      console.log(`✅ Upload URL generated successfully`);
      res.json({ uploadURL, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/objects/upload failed", error);
      res.status(500).json({ error: "Internal server error", requestId });
    }
  });

  app.get("/api/objects/images", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const folder = req.query.folder as string | undefined;
      console.log(`📁 Listing images from folder: "${folder}"`);

      const allFiles = await objectStorageService.listPublicFiles();
      console.log(`📦 Total files in storage: ${allFiles.length}`);

      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      const filteredFiles = allFiles.filter(filePath => {
        const matchesFolder = !folder || filePath.startsWith(`${folder}/`);
        const isImage = imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
        return matchesFolder && isImage;
      });

      console.log(`🖼️ Filtered to ${filteredFiles.length} images`);

      const images = filteredFiles.map(filePath => ({
        name: filePath.split("/").pop() || filePath,
        url: `/public-objects/${filePath}`,
        size: 0,
        updated: new Date().toISOString()
      }));

      console.log(`✅ Returning ${images.length} images`);
      res.json({ images, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/objects/images failed", error);
      res.status(500).json({ error: "Failed to list images", requestId });
    }
  });

  app.post("/api/images/normalize", async (req, res) => {
    const requestId = makeRequestId();
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required", requestId });
    }

    try {
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      res.json({ objectPath: normalizedPath, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/images/normalize failed", error);
      res.status(500).json({ error: "Internal server error", requestId });
    }
  });

  // =========================================
  // CONFIG
  // =========================================
  app.get("/api/config/google-maps-key", (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Google Maps API key not configured" });
    }
    res.json({ apiKey });
  });

  // =========================================
  // SITEMAP + ROBOTS
  // =========================================
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = "https://www.domrealce.com";
    const pages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/servicos", priority: "0.9", changefreq: "weekly" },
      { url: "/portfolio", priority: "0.8", changefreq: "weekly" },
      { url: "/loja", priority: "0.8", changefreq: "daily" },
      { url: "/loja-papel-parede", priority: "0.8", changefreq: "daily" },
      { url: "/contactos", priority: "0.7", changefreq: "monthly" },
      { url: "/sobre", priority: "0.6", changefreq: "monthly" },
      { url: "/noticias", priority: "0.7", changefreq: "weekly" },
      { url: "/servico-design-grafico", priority: "0.8", changefreq: "monthly" },
      { url: "/servico-impressao-digital", priority: "0.8", changefreq: "monthly" },
      { url: "/servico-papel-parede", priority: "0.8", changefreq: "monthly" },
      { url: "/servico-telas-artisticas", priority: "0.7", changefreq: "monthly" },
      { url: "/servico-autocolantes", priority: "0.7", changefreq: "monthly" },
      { url: "/servico-decoracao-viaturas", priority: "0.8", changefreq: "monthly" },
      { url: "/servico-espacos-comerciais", priority: "0.7", changefreq: "monthly" },
      { url: "/servico-peliculas-protecao-solar", priority: "0.7", changefreq: "monthly" },
      { url: "/como-aplicar-papel-parede", priority: "0.6", changefreq: "monthly" },
      { url: "/politica-privacidade", priority: "0.3", changefreq: "yearly" },
      { url: "/termos-condicoes", priority: "0.3", changefreq: "yearly" },
      { url: "/politica-cookies", priority: "0.3", changefreq: "yearly" },
      { url: "/aviso-legal", priority: "0.3", changefreq: "yearly" }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.set("Content-Type", "text/xml");
    res.send(sitemap);
  });

  app.get("/robots.txt", (req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: https://www.domrealce.com/sitemap.xml`;
    res.set("Content-Type", "text/plain");
    res.send(robots);
  });

  // =========================================
  // PUBLIC OBJECTS (serve files)
  // =========================================
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const requestId = makeRequestId();
    const filePath = req.params.filePath;
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found", requestId });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      logRouteError(requestId, "GET /public-objects/:filePath failed", error);
      return res.status(500).json({ error: "Internal server error", requestId });
    }
  });

  // =========================================
  // GALLERY + LOGOS + LOJA IMAGES + SLIDER
  // =========================================
  app.get("/api/gallery/images", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();
      const portfolioImages = files.filter(
        file =>
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file) &&
          file.startsWith("portfolio/") &&
          !file.startsWith("loja/")
      );

      res.json({ images: portfolioImages, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/gallery/images failed", error);
      res.status(500).json({ error: "Failed to list images", requestId });
    }
  });

  app.get("/api/client-logos", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();

      const logoImages = files.filter(
        file =>
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file) &&
          (file.startsWith("inicio/logos-clientes/") ||
            file.startsWith("logos-clientes/") ||
            file.includes("logos-clientes"))
      );

      const logos = logoImages.map(file => {
        const fileName = file.split("/").pop() || "";
        const clientName = fileName
          .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase());

        return {
          id: fileName,
          url: `/public-objects/${file}`,
          clientName: clientName || "Cliente",
          fileName
        };
      });

      res.json({ logos, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/client-logos failed", error);
      res.status(500).json({ error: "Failed to list client logos", requestId });
    }
  });

  app.get("/api/loja/images", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();
      const lojaImages = files.filter(
        file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file.startsWith("loja/")
      );
      res.json({ images: lojaImages, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/loja/images failed", error);
      res.status(500).json({ error: "Failed to list loja images", requestId });
    }
  });

  app.get("/api/slider/images", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();

      const sliderImages = files.filter(
        file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file.startsWith("inicio/slider/")
      );

      // Auto-sync slider images to database
      for (const imagePath of sliderImages) {
        const fileName =
          imagePath
            .split("/")
            .pop()
            ?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "") || "";
        const imageUrl = `/public-objects/${imagePath}`;

        const existingSlides = await storage.getSlides();
        const slideExists = existingSlides.some(slide => slide.image === imageUrl);

        if (!slideExists) {
          const slideData = {
            image: imageUrl,
            title: fileName
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            text: `Conheça os nossos serviços de qualidade`,
            order_position: (existingSlides.length + 1).toString(),
            active: true
          };

          await storage.createSlide(slideData);
          console.log(`Auto-created slide for: ${fileName}`);
        }
      }

      res.json({ images: sliderImages, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/slider/images failed", error);
      res.status(500).json({ error: "Failed to process slider images", requestId });
    }
  });

  // =========================================
  // DOWNLOAD ALL IMAGES (ZIP) - ADMIN
  // =========================================
  app.get("/api/admin/download-all-images", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const files = await objectStorageService.listPublicFiles();
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      if (imageFiles.length === 0) {
        return res.status(404).json({ error: "Nenhuma imagem encontrada", requestId });
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=domrealce-imagens.zip");

      const archive = archiver("zip", { zlib: { level: 5 } });

      archive.on("error", (err: Error) => {
        logRouteError(requestId, "ZIP archive error", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Erro ao criar arquivo ZIP", requestId });
        }
      });

      archive.pipe(res);

      for (const filePath of imageFiles) {
        try {
          const fileBuffer = await objectStorageService.downloadFile(filePath);
          if (fileBuffer) archive.append(fileBuffer, { name: filePath });
        } catch (err) {
          console.error(`Error adding file ${filePath} to archive:`, err);
        }
      }

      await archive.finalize();
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/download-all-images failed", error);
      res.status(500).json({ error: "Failed to create image archive", requestId });
    }
  });

  // =========================================
  // CONTACT FORM
  // =========================================
  app.post("/api/contact", contactLimiter, contactUpload.array("files", 5), async (req, res) => {
    const requestId = makeRequestId();
    try {
      const submissionId = randomUUID();
      const files = (req.files as Express.Multer.File[]) || [];

      const uploadedFileEntries: string[] = [];

      for (const file of files) {
        const originalName = (file.originalname || "ficheiro")
          .replace(/[/\\?%*:|"<>]/g, "-")
          .trim();

        const targetPath = `contactos/${submissionId}/${Date.now()}-${originalName}`;

        await objectStorageService.uploadPublicFile(targetPath, file.buffer, file.mimetype);

        const publicUrl = `/public-objects/${targetPath}`;
        uploadedFileEntries.push(`${originalName}|${publicUrl}`);
      }

      const validatedData = insertContactSchema.parse({
        ...req.body,
        ficheiros: uploadedFileEntries
      });

      if (validatedData.ficheiros && validatedData.ficheiros.length > 0) {
        validatedData.ficheiros = validatedData.ficheiros.map(entry => {
          if (entry.includes("|")) {
            const [name, url] = entry.split("|");
            const normalizedUrl = objectStorageService.normalizeObjectEntityPath(url);
            return `${name}|${normalizedUrl}`;
          }
          return objectStorageService.normalizeObjectEntityPath(entry);
        });
      }

      const contact = await storage.createContact(validatedData);

      Promise.all([sendContactEmail(contact), sendAutoReplyEmail(contact)]).catch(error => {
        console.error("Error sending emails:", error);
      });

      res.json({
        success: true,
        message: "Mensagem enviada com sucesso. Entraremos em contacto brevemente.",
        files: uploadedFileEntries.map(f => {
          const [name, url] = f.split("|");
          return { name, url };
        }),
        requestId
      });
    } catch (error) {
      logRouteError(requestId, "POST /api/contact failed", error);
      res.status(400).json({
        success: false,
        message: "Erro ao enviar mensagem. Por favor, tente novamente.",
        requestId
      });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      logRouteError(requestId, "GET /api/contacts failed", error);
      res.status(500).json({ message: "Erro interno do servidor", requestId });
    }
  });

  app.get("/api/contacts/attachment/:contactId/:fileName", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { contactId, fileName } = req.params;

      const contacts = await storage.getAllContacts();
      const contact = contacts.find(c => c.id === contactId);

      if (!contact) {
        return res.status(404).json({ error: "Contacto não encontrado", requestId });
      }

      if (!contact.ficheiros || contact.ficheiros.length === 0) {
        return res.status(404).json({ error: "Nenhum ficheiro encontrado para este contacto", requestId });
      }

      const decoded = decodeURIComponent(fileName);
      const fileInfo = contact.ficheiros.find(f => {
        if (f.includes("|")) {
          const [originalName] = f.split("|");
          return originalName.includes(decoded);
        }
        return f.includes(decoded);
      });

      if (!fileInfo) {
        return res.status(404).json({ error: "Ficheiro não encontrado", requestId });
      }

      if (fileInfo.includes("|")) {
        const [, fileUrl] = fileInfo.split("|");
        if (fileUrl) return res.redirect(fileUrl);
      }

      return res.status(404).json({
        error: "URL do ficheiro não encontrado - ficheiro não foi carregado correctamente",
        requestId
      });
    } catch (error) {
      logRouteError(requestId, "GET /api/contacts/attachment failed", error);
      res.status(500).json({ error: "Erro interno do servidor", requestId });
    }
  });

  // =========================================
  // PRODUCTS
  // =========================================
  app.get("/api/products/featured", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      logRouteError(requestId, "GET /api/products/featured failed", error);
      res.status(500).json({ error: "Failed to fetch featured products", requestId });
    }
  });

  // =========================================
  // NEWS – ENDPOINTS PÚBLICOS (com debug forte)
  // =========================================

  app.get("/api/news/recent", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const news = await storage.getRecentNews();
      res.json(news);
    } catch (error) {
      logRouteError(requestId, "GET /api/news/recent failed", error);
      res.status(500).json({
        error: "Failed to fetch recent news",
        requestId,
        details: safeErrorMessage(error)
      });
    }
  });

  app.get("/api/news/categories", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const all = await storage.getAllNews();
      const categorias = Array.from(
        new Set(all.map(n => (n.categoria || "").trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, "pt-PT"));

      res.json({ categorias });
    } catch (error) {
      logRouteError(requestId, "GET /api/news/categories failed", error);
      res.status(500).json({
        error: "Failed to fetch categories",
        requestId,
        details: safeErrorMessage(error)
      });
    }
  });

  app.get("/api/news/all", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      logRouteError(requestId, "GET /api/news/all failed", error);
      res.status(500).json({
        error: "Failed to fetch all news",
        requestId,
        details: safeErrorMessage(error)
      });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      console.log(`✅ HIT /api/news/:id = ${id}`);

      const all = await storage.getAllNews();
      const noticia = all.find(n => String(n.id) === String(id));

      if (!noticia) {
        return res.status(404).json({ error: "Notícia não encontrada", requestId });
      }

      res.json(noticia);
    } catch (error) {
      logRouteError(requestId, "GET /api/news/:id failed", error);
      res.status(500).json({
        error: "Failed to fetch news",
        requestId,
        details: safeErrorMessage(error)
      });
    }
  });

  // =========================================
  // ORDERS
  // =========================================
  app.post("/api/orders", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json({ success: true, order, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/orders failed", error);
      res.status(500).json({ error: "Failed to create order", requestId });
    }
  });

  app.get("/api/admin/orders", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const orders = await storage.getAllOrders();
      res.json({ orders, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/orders failed", error);
      res.status(500).json({ error: "Failed to fetch orders", requestId });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) return res.status(404).json({ error: "Order not found", requestId });
      res.json(order);
    } catch (error) {
      logRouteError(requestId, "GET /api/orders/:id failed", error);
      res.status(500).json({ error: "Failed to fetch order", requestId });
    }
  });

  app.get("/api/orders/number/:numeroEncomenda", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { numeroEncomenda } = req.params;
      const order = await storage.getOrderByNumber(numeroEncomenda);
      if (!order) return res.status(404).json({ error: "Order not found", requestId });
      res.json(order);
    } catch (error) {
      logRouteError(requestId, "GET /api/orders/number/:numeroEncomenda failed", error);
      res.status(500).json({ error: "Failed to fetch order", requestId });
    }
  });

  app.put("/api/admin/orders/:id", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const updateData = req.body;
      const order = await storage.updateOrder(id, updateData);
      res.json({ success: true, order, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/orders/:id failed", error);
      res.status(500).json({ error: "Failed to update order", requestId });
    }
  });

  app.put("/api/admin/orders/:id/status", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const { estado, estadoPagamento } = req.body;
      const order = await storage.updateOrderStatus(id, estado, estadoPagamento);
      res.json({ success: true, order, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/orders/:id/status failed", error);
      res.status(500).json({ error: "Failed to update order status", requestId });
    }
  });

  app.delete("/api/admin/orders/:id", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const success = await storage.deleteOrder(id);
      res.json({ success, requestId });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/admin/orders/:id failed", error);
      res.status(500).json({ error: "Failed to delete order", requestId });
    }
  });

  // =========================================
  // PAYMENTS (mantive como tinhas)
  // =========================================

  app.post("/api/payments/create", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { method, orderId, amount, customerData, returnUrls } = req.body;

      if (!method || !orderId || !amount) {
        return res.status(400).json({
          success: false,
          message: "Método de pagamento, ID do pedido e valor são obrigatórios",
          requestId
        });
      }

      let paymentData: any;

      switch (method as PaymentMethod) {
        case "multibanco":
          paymentData = await ifthenPayService.createMultibancoPayment({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            customerEmail: customerData?.email
          });
          break;

        case "mbway":
          if (!customerData?.phone) {
            return res.status(400).json({
              success: false,
              message: "Número de telefone é obrigatório para MB WAY",
              requestId
            });
          }
          paymentData = await ifthenPayService.createMBWayPayment({
            orderId,
            amount: parseFloat(amount),
            phone: customerData.phone,
            description: `Papel de parede - Pedido ${orderId}`,
            customerEmail: customerData?.email
          });
          break;

        case "creditcard":
          if (!returnUrls) {
            return res.status(400).json({
              success: false,
              message: "URLs de retorno são obrigatórias para cartão de crédito",
              requestId
            });
          }
          paymentData = await ifthenPayService.createCreditCardPayment({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            successUrl: returnUrls.success,
            errorUrl: returnUrls.error,
            cancelUrl: returnUrls.cancel,
            customerEmail: customerData?.email
          });
          break;

        case "paybylink":
          paymentData = await ifthenPayService.createPayByLink({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            expiryDays: 3,
            methods: ["multibanco", "mbway", "creditcard"]
          });
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Método de pagamento não suportado",
            requestId
          });
      }

      res.json({
        success: true,
        method,
        data: paymentData,
        requestId
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      console.error("Payment method was:", req.body.method);
      console.error("Full error details:", error instanceof Error ? error.message : error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Erro ao criar pagamento. Tente novamente.",
        requestId
      });
    }
  });

  app.post("/api/payments/mbway/status", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { requestId: mbReqId } = req.body;

      if (!mbReqId) {
        return res.status(400).json({
          success: false,
          message: "Request ID é obrigatório",
          requestId
        });
      }

      try {
        const statusResponse = await ifthenPayService.checkMBWayStatus(mbReqId);

        res.json({
          success: true,
          status: statusResponse.status,
          message: statusResponse.status === "paid" ? "Pagamento confirmado!" : "Aguarde confirmação no seu telemóvel",
          requestId
        });
      } catch (statusError) {
        console.warn("MB WAY status check failed, returning pending:", statusError);
        res.json({
          success: true,
          status: "pending",
          message: "Aguarde confirmação no seu telemóvel",
          requestId
        });
      }
    } catch (error) {
      console.error("Error checking MB WAY status:", error);
      res.json({
        success: true,
        status: "pending",
        message: "Aguarde confirmação no seu telemóvel",
        requestId
      });
    }
  });

  app.get("/api/payments/callback", async (req, res) => {
    try {
      const {
        key,
        chave,
        orderId,
        amount,
        requestId,
        entity,
        entidade,
        reference,
        referencia,
        payment_datetime,
        datahorapag,
        valor
      } = req.query as any;

      console.log("IfthenPay callback received from www.domrealce.com:", {
        chave: chave ? `${String(chave).substring(0, 5)}...` : "missing",
        key: key ? `${String(key).substring(0, 5)}...` : "missing",
        entidade,
        referencia,
        valor,
        datahorapag,
        orderId,
        amount,
        requestId,
        payment_datetime
      });

      const expectedKey = process.env.IFTHENPAY_ANTI_PHISHING_KEY;
      const receivedKey = chave || key;

      if (!expectedKey) {
        console.log("Anti-phishing key not configured in environment");
        return res.status(200).send("OK");
      }

      if (receivedKey !== expectedKey) {
        console.log(
          `Invalid anti-phishing key. Expected: ${expectedKey.substring(0, 5)}..., Got: ${String(receivedKey).substring(0, 5)}...`
        );
        return res.status(403).send("Forbidden");
      }

      const finalAmount = valor || amount;
      const finalOrderId = orderId || `Ref-${referencia}`;
      const finalDateTime = datahorapag || payment_datetime;

      console.log(
        `✓ Payment confirmed! Order: ${finalOrderId}, Amount: €${finalAmount}, Entity: ${entidade}, Reference: ${referencia}, DateTime: ${finalDateTime}`
      );

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing callback:", error);
      res.status(500).send("Error processing callback");
    }
  });

  app.get("/api/payments/notification", async (req, res) => {
    try {
      console.log("IfthenPay notification received:", req.query);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error processing notification:", error);
      res.status(500).send("Error processing notification");
    }
  });

  app.get("/api/payments/success", (req, res) => {
    const { orderId, amount } = req.query as any;

    if (!orderId || !amount) {
      console.error("Payment success callback missing required parameters:", { orderId, amount });
      return res.redirect(`/checkout?error=missing-parameters`);
    }

    const amountNum = parseFloat(amount as string);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error("Payment success callback invalid amount:", amount);
      return res.redirect(`/checkout?error=invalid-amount&orderId=${orderId}`);
    }

    res.redirect(`/pedido-confirmado?orderId=${orderId}&amount=${amount}`);
  });

  app.get("/api/payments/error", (req, res) => {
    const { orderId, error } = req.query as any;
    console.error("Payment error callback received:", { orderId, error });

    const errorMsg = error || "unknown-error";
    const orderParam = orderId ? `&orderId=${orderId}` : "";

    res.redirect(`/checkout?error=${errorMsg}${orderParam}`);
  });

  app.get("/api/payments/cancel", (req, res) => {
    const { orderId } = req.query as any;
    res.redirect(`/checkout?cancelled=true&orderId=${orderId}`);
  });

  // =========================================
  // PUBLIC SLIDER API
  // =========================================
  app.get("/api/slider", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const slides = await storage.getSlides();
      res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
      res.json({ slides, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/slider failed", error);
      res.status(500).json({ error: "Failed to fetch slides", requestId });
    }
  });

  // =========================================
  // ADMIN: proteger todas /api/admin
  // =========================================
  app.use("/api/admin", protegerAdmin);

  // Admin Slider routes
  app.get("/api/admin/slider", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const slides = await storage.getSlides();
      res.json({ slides, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/slider failed", error);
      res.status(500).json({ error: "Failed to fetch slides", requestId });
    }
  });

  app.post("/api/admin/slider", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const slideData = insertSlideSchema.parse(req.body);
      const slide = await storage.createSlide(slideData);
      res.json({ success: true, slide, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/slider failed", error);
      res.status(500).json({ error: "Failed to create slide", requestId });
    }
  });

  app.put("/api/admin/slider/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const slideData = insertSlideSchema.parse(req.body);
      const slide = await storage.updateSlide(id, slideData);
      res.json({ success: true, slide, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/slider/:id failed", error);
      res.status(500).json({ error: "Failed to update slide", requestId });
    }
  });

  app.delete("/api/admin/slider/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const success = await storage.deleteSlide(id);
      res.json({ success, requestId });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/admin/slider/:id failed", error);
      res.status(500).json({ error: "Failed to delete slide", requestId });
    }
  });

  // Admin Products routes
  app.get("/api/admin/produtos", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const produtos = await storage.getAllProducts();
      res.json({ produtos, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/produtos failed", error);
      res.status(500).json({ error: "Failed to fetch products", requestId });
    }
  });

  app.post("/api/admin/produtos", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.createProduct(productData);
      res.json({ success: true, produto, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/produtos failed", error);
      res.status(500).json({ error: "Failed to create product", requestId });
    }
  });

  app.put("/api/admin/produtos/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.updateProduct(id, productData);
      res.json({ success: true, produto, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/produtos/:id failed", error);
      res.status(500).json({ error: "Failed to update product", requestId });
    }
  });

  app.delete("/api/admin/produtos/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      res.json({ success, requestId });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/admin/produtos/:id failed", error);
      res.status(500).json({ error: "Failed to delete product", requestId });
    }
  });

  // Admin News routes
  app.get("/api/admin/noticias", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const noticias = await storage.getAllNews();
      res.json({ noticias, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/noticias failed", error);
      res.status(500).json({ error: "Failed to fetch news", requestId });
    }
  });

  app.post("/api/admin/noticias", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const newsData = insertNewsSchema.parse(req.body);

      const processedData = {
        ...newsData,
        data: newsData.data
          ? typeof newsData.data === "object"
            ? newsData.data
            : new Date(newsData.data as string)
          : new Date()
      };

      const noticia = await storage.createNews(processedData as any);
      res.json({ success: true, noticia, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/noticias failed", error);
      res.status(500).json({ error: "Failed to create news", requestId });
    }
  });

  app.put("/api/admin/noticias/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const newsData = insertNewsSchema.parse(req.body);

      // Helper to convert string to Date
      const toDate = (val: any): Date | undefined => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        if (typeof val === "string") return new Date(val);
        return undefined;
      };

      // Convert string dates to Date objects for timestamp fields
      const processedData = {
        ...newsData,
        data: toDate(newsData.data),
        publishedAt: toDate(newsData.publishedAt),
        createdAt: undefined,
        updatedAt: undefined,
      };

      const noticia = await storage.updateNews(id, processedData as any);
      res.json({ success: true, noticia, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/noticias/:id failed", error);
      res.status(500).json({ error: "Failed to update news", requestId });
    }
  });

  app.delete("/api/admin/noticias/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const success = await storage.deleteNews(id);
      res.json({ success, requestId });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/admin/noticias/:id failed", error);
      res.status(500).json({ error: "Failed to delete news", requestId });
    }
  });

  // Admin Contacts routes
  app.get("/api/admin/contacts", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const contacts = await storage.getAllContacts();
      res.json({ contacts, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/contacts failed", error);
      res.status(500).json({ error: "Failed to fetch contacts", requestId });
    }
  });

  // =========================================
  // PAGE CONFIG
  // =========================================
  app.post("/api/admin/pages/:page/config", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { page } = req.params;
      const { section, element, value } = req.body;

      if (!section || !element || value === undefined) {
        return res.status(400).json({
          error: "Missing required fields: section, element, and value are required",
          requestId
        });
      }

      const configData = {
        page,
        section,
        element,
        type: "text" as const,
        value: String(value)
      };

      const config = await storage.upsertPageConfig(configData);
      res.json({ success: true, config, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/pages/:page/config failed", error);
      res.status(500).json({ error: "Failed to update page config", requestId });
    }
  });

  app.get("/api/admin/pages", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { page } = req.query;
      const configs = await storage.getPageConfigs(page as string);
      res.json({ configs, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/pages failed", error);
      res.status(500).json({ error: "Failed to fetch page configs", requestId });
    }
  });

  app.get("/api/admin/pages/:page", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { page } = req.params;
      const configs = await storage.getPageConfigs(page);
      res.json({ configs, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/pages/:page failed", error);
      res.status(500).json({ error: "Failed to fetch page configs", requestId });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.createPageConfig(configData);
      res.json({ success: true, config, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/pages failed", error);
      res.status(500).json({ error: "Failed to create page config", requestId });
    }
  });

  app.put("/api/admin/pages/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.updatePageConfig(id, configData);
      res.json({ success: true, config, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/pages/:id failed", error);
      res.status(500).json({ error: "Failed to update page config", requestId });
    }
  });

  app.delete("/api/admin/pages/:id", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { id } = req.params;
      const success = await storage.deletePageConfig(id);
      res.json({ success, requestId });
    } catch (error) {
      logRouteError(requestId, "DELETE /api/admin/pages/:id failed", error);
      res.status(500).json({ error: "Failed to delete page config", requestId });
    }
  });

  app.post("/api/admin/pages/upsert", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.upsertPageConfig(configData);
      res.json({ success: true, config, requestId });
    } catch (error) {
      logRouteError(requestId, "POST /api/admin/pages/upsert failed", error);
      res.status(500).json({ error: "Failed to upsert page config", requestId });
    }
  });

  app.get("/api/page-config/:page", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { page } = req.params;
      const configs = await storage.getPageConfigs(page);

      const structuredConfigs: Record<string, Record<string, any>> = {};
      configs.forEach(config => {
        if (!structuredConfigs[config.section]) structuredConfigs[config.section] = {};
        structuredConfigs[config.section][config.element] = {
          value: config.value,
          type: config.type,
          metadata: config.metadata ? JSON.parse(config.metadata) : null
        };
      });

      res.json({ configs: structuredConfigs, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/page-config/:page failed", error);
      res.status(500).json({ error: "Failed to fetch page config", requestId });
    }
  });

  // =========================================
  // SERVICE GALLERIES API routes
  // =========================================
  
  // Public endpoint - get gallery for a service
  app.get("/api/service-galleries/:serviceId", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { serviceId } = req.params;
      const gallery = await storage.getServiceGallery(serviceId);
      
      if (!gallery) {
        return res.json({ images: [], requestId });
      }
      
      res.json({ images: gallery.images || [], requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/service-galleries/:serviceId failed", error);
      res.status(500).json({ error: "Failed to fetch service gallery", requestId });
    }
  });
  
  // Admin endpoints - list all galleries
  app.get("/api/admin/service-galleries", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const galleries = await storage.getAllServiceGalleries();
      res.json({ galleries, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/admin/service-galleries failed", error);
      res.status(500).json({ error: "Failed to fetch service galleries", requestId });
    }
  });
  
  // Admin endpoint - update/create gallery for a service
  app.put("/api/admin/service-galleries/:serviceId", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { serviceId } = req.params;
      const { images } = req.body;
      
      const parseResult = insertServiceGallerySchema.safeParse({
        serviceId,
        images: images || []
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parseResult.error.errors,
          requestId 
        });
      }
      
      const gallery = await storage.upsertServiceGallery(parseResult.data);
      res.json({ success: true, gallery, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/service-galleries/:serviceId failed", error);
      res.status(500).json({ error: "Failed to update service gallery", requestId });
    }
  });

  // =========================================
  // SERVICE HEROES API routes
  // =========================================
  
  // Public endpoint - get hero for a service
  app.get("/api/service-heroes/:serviceId", async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { serviceId } = req.params;
      const hero = await storage.getServiceHero(serviceId);
      res.json({ hero, requestId });
    } catch (error) {
      logRouteError(requestId, "GET /api/service-heroes/:serviceId failed", error);
      res.status(500).json({ error: "Failed to fetch service hero", requestId });
    }
  });
  
  // Admin endpoint - update/create hero for a service
  app.put("/api/admin/service-heroes/:serviceId", protegerAdmin, async (req, res) => {
    const requestId = makeRequestId();
    try {
      const { serviceId } = req.params;
      const parseResult = insertServiceHeroSchema.safeParse({
        ...req.body,
        serviceId
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: parseResult.error.errors,
          requestId 
        });
      }
      
      const hero = await storage.upsertServiceHero(parseResult.data);
      res.json({ success: true, hero, requestId });
    } catch (error) {
      logRouteError(requestId, "PUT /api/admin/service-heroes/:serviceId failed", error);
      res.status(500).json({ error: "Failed to update service hero", requestId });
    }
  });

  // =========================================
  // VISUAL EDITOR API routes
  // =========================================
  app.get("/api/editor/page/:route", getPageContent);
  app.post("/api/editor/page", savePageContentEndpoint);

  // Media Manager API routes (visual-editor)
  app.get("/api/media/index", getMediaIndex);
  app.get("/api/media/folders", getMediaFolders);
  app.post("/api/media/sync", syncGlobalImages);
  // ✅ upload já foi definido acima (sem duplicar)
  app.delete("/api/media/files", deleteMediaFiles);

  const httpServer = createServer(app);
  return httpServer;
}