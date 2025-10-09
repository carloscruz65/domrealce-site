import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertContactSchema,
  insertProductSchema,
  insertNewsSchema,
  insertSlideSchema,
  insertPageConfigSchema,
  insertOrderSchema,
  type Contact,
  type Order
} from "@shared/schema";
import { sendContactEmail, sendAutoReplyEmail } from "./email";
import { ObjectStorageService } from "./objectStorage";
import { createIfthenPayService, type PaymentMethod } from "./ifthenpay";
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication first - TEMPORARILY DISABLED
  // await setupAuth(app);
  // Rate limiting for contact form
  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { 
      success: false, 
      message: "Muitas tentativas. Tente novamente em 15 minutos." 
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  // 🔐 Proteção da rota /admin
  app.get("/admin", (req: Request, res: Response, next: NextFunction) => {
    if (process.env.ADMIN_MODE !== "true") {
      return res.status(403).send("Área restrita");
    }

    res.sendFile(path.resolve("client", "public", "manuais", "admin.html"));
  });

  // Object storage service
  const objectStorageService = new ObjectStorageService();

  // Simple admin token middleware (temporary until full auth is re-enabled)
  const adminAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token'];
    // For development, allow simple token or skip auth entirely
    if (process.env.NODE_ENV === 'development' || token === process.env.ADMIN_TOKEN || !token) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Auth routes - TEMPORARILY DISABLED
  /*
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  */

  // Object Storage endpoints for Visual Editor
  // Upload endpoint for getting presigned URLs
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Normalize uploaded image path
  app.post("/api/images/normalize", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      res.json({ objectPath: normalizedPath });
    } catch (error) {
      console.error("Error normalizing image path:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // IfthenPay service
  const ifthenPayService = createIfthenPayService();

  // Google Maps API Key endpoint
  app.get("/api/config/google-maps-key", (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }
    res.json({ apiKey });
  });

  // Sitemap.xml generator
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = 'https://www.domrealce.com';
    const pages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/servicos', priority: '0.9', changefreq: 'weekly' },
      { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
      { url: '/loja', priority: '0.8', changefreq: 'daily' },
      { url: '/loja-papel-parede', priority: '0.8', changefreq: 'daily' },
      { url: '/contactos', priority: '0.7', changefreq: 'monthly' },
      { url: '/sobre', priority: '0.6', changefreq: 'monthly' },
      { url: '/noticias', priority: '0.7', changefreq: 'weekly' },
      { url: '/servico-design-grafico', priority: '0.8', changefreq: 'monthly' },
      { url: '/servico-impressao-digital', priority: '0.8', changefreq: 'monthly' },
      { url: '/servico-papel-parede', priority: '0.8', changefreq: 'monthly' },
      { url: '/servico-telas-artisticas', priority: '0.7', changefreq: 'monthly' },
      { url: '/servico-autocolantes', priority: '0.7', changefreq: 'monthly' },
      { url: '/servico-decoracao-viaturas', priority: '0.8', changefreq: 'monthly' },
      { url: '/servico-espacos-comerciais', priority: '0.7', changefreq: 'monthly' },
      { url: '/servico-peliculas-protecao-solar', priority: '0.7', changefreq: 'monthly' },
      { url: '/como-aplicar-papel-parede', priority: '0.6', changefreq: 'monthly' },
      { url: '/politica-privacidade', priority: '0.3', changefreq: 'yearly' },
      { url: '/termos-condicoes', priority: '0.3', changefreq: 'yearly' },
      { url: '/politica-cookies', priority: '0.3', changefreq: 'yearly' },
      { url: '/aviso-legal', priority: '0.3', changefreq: 'yearly' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: https://www.domrealce.com/sitemap.xml`;
    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Serve public images from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // API route to list available images for gallery (portfolio only)
  app.get("/api/gallery/images", async (req, res) => {
    try {
      const files = await objectStorageService.listPublicFiles();
      
      // Filter only portfolio images (exclude loja)
      const portfolioImages = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && 
        file.startsWith('portfolio/') && 
        !file.startsWith('loja/')
      );
      
      res.json({ images: portfolioImages });
    } catch (error) {
      console.error("Error listing images:", error);
      res.status(500).json({ error: "Failed to list images" });
    }
  });

  // API route to list client logos from logos-clientes folder
  app.get("/api/client-logos", async (req, res) => {
    try {
      const files = await objectStorageService.listPublicFiles();
      
      // Filter logo images from inicio/logos-clientes folder
      const logoImages = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file) && 
        (file.startsWith('inicio/logos-clientes/') || 
         file.startsWith('logos-clientes/') ||
         file.includes('logos-clientes'))
      );
      
      // Transform file paths to usable URLs and extract client names
      const logos = logoImages.map(file => {
        const fileName = file.split('/').pop() || '';
        const clientName = fileName.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        return {
          id: fileName,
          url: `/public-objects/${file}`,
          clientName: clientName || 'Cliente',
          fileName: fileName
        };
      });
      
      res.json({ logos });
    } catch (error) {
      console.error("Error listing client logos:", error);
      res.status(500).json({ error: "Failed to list client logos" });
    }
  });

  // API route to auto-generate texture covers from available texture folders
  app.post("/api/auto-generate-covers", async (req, res) => {
    try {
      console.log('Starting auto-generation of texture covers...');
      
      const allImages = await objectStorageService.listPublicFiles();
      
      // Find all texture categories from existing images
      const textureCategories = new Set<string>();
      
      allImages.forEach(path => {
        const match = path.match(/^loja\/papel-de-parede\/texturas\/([^\/]+)\//);
        if (match) {
          textureCategories.add(match[1]);
        }
      });
      
      console.log('Found texture categories:', Array.from(textureCategories));
      
      const generatedCovers = [];
      
      for (const category of Array.from(textureCategories)) {
        // Check if cover already exists
        const coverPath = `loja/papel-de-parede/capas-texturas/${category}.webp`;
        const coverExists = allImages.includes(coverPath);
        
        if (!coverExists) {
          // Find first texture image in this category to use as cover
          const firstTexture = allImages.find(path => 
            path.startsWith(`loja/papel-de-parede/texturas/${category}/`) &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(path)
          );
          
          if (firstTexture) {
            try {
              // Get the original image from object storage
              const file = await objectStorageService.searchPublicObject(firstTexture.replace(/^loja\/papel-de-parede\//, ''));
              
              if (file) {
                // Download the image data
                const chunks: Buffer[] = [];
                const stream = file.createReadStream();
                
                await new Promise((resolve, reject) => {
                  stream.on('data', (chunk) => chunks.push(chunk));
                  stream.on('end', resolve);
                  stream.on('error', reject);
                });
                
                const imageBuffer = Buffer.concat(chunks);
                
                // Upload as cover with .webp extension
                await objectStorageService.uploadPublicFile(
                  coverPath,
                  imageBuffer,
                  'image/webp'
                );
                
                generatedCovers.push({ category, source: firstTexture, cover: coverPath });
                console.log(`✓ Generated cover for ${category} from ${firstTexture}`);
              }
            } catch (error) {
              console.error(`✗ Error generating cover for ${category}:`, error);
            }
          }
        } else {
          console.log(`Cover for ${category} already exists`);
        }
      }
      
      res.json({ 
        message: 'Auto-generation completed',
        categoriesFound: Array.from(textureCategories),
        coversGenerated: generatedCovers
      });
      
    } catch (error) {
      console.error("Error in auto-generation:", error);
      res.status(500).json({ error: "Failed to auto-generate covers" });
    }
  });

  // File upload endpoint - simplified for direct uploads
  app.post("/api/objects/upload", async (req, res) => {
    try {
      // Simple placeholder for upload URL - the actual upload will be handled by the client differently
      const uploadURL = `http://localhost:5000/api/upload-direct`;
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Bulk upload endpoint for texture covers
  app.post("/api/upload-textures", async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const texturesPath = 'loja/papel-de-parede/capas-texturas';
      const files = fs.readdirSync(texturesPath);
      const webpFiles = files.filter(file => file.endsWith('.webp'));
      
      const uploadResults = [];
      
      for (const file of webpFiles) {
        try {
          const filePath = path.join(texturesPath, file);
          const fileBuffer = fs.readFileSync(filePath);
          const targetPath = `loja/papel-de-parede/capas-texturas/${file}`;
          
          await objectStorageService.uploadPublicFile(targetPath, fileBuffer, 'image/webp');
          uploadResults.push({ file, status: 'success' });
          console.log(`✓ Uploaded ${file}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          uploadResults.push({ file, status: 'error', error: errorMessage });
          console.error(`✗ Error uploading ${file}:`, errorMessage);
        }
      }
      
      res.json({ 
        message: 'Bulk upload completed',
        results: uploadResults,
        total: webpFiles.length,
        successful: uploadResults.filter(r => r.status === 'success').length
      });
      
    } catch (error) {
      console.error("Error in bulk upload:", error);
      res.status(500).json({ error: "Failed to upload textures" });
    }
  });

  // API route to list loja images (separate from portfolio)
  app.get("/api/loja/images", async (req, res) => {
    try {
      const files = await objectStorageService.listPublicFiles();
      
      // Filter only loja images
      const lojaImages = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && 
        file.startsWith('loja/')
      );
      
      res.json({ images: lojaImages });
    } catch (error) {
      console.error("Error listing loja images:", error);
      res.status(500).json({ error: "Failed to list loja images" });
    }
  });

  // API route to list slider images and auto-sync with database
  app.get("/api/slider/images", async (req, res) => {
    try {
      const files = await objectStorageService.listPublicFiles();
      
      // Filter only slider images in specific slider directory
      const sliderImages = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && 
        file.startsWith('inicio/slider/')
      );
      
      // Auto-sync slider images to database
      for (const imagePath of sliderImages) {
        const fileName = imagePath.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '') || '';
        const imageUrl = `/public-objects/${imagePath}`;
        
        // Check if slide already exists
        const existingSlides = await storage.getSlides();
        const slideExists = existingSlides.some(slide => slide.image === imageUrl);
        
        if (!slideExists) {
          // Create new slide automatically
          const slideData = {
            image: imageUrl,
            title: fileName.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            text: `Conheça os nossos serviços de qualidade`,
            order_position: (existingSlides.length + 1).toString(),
            active: true
          };
          
          await storage.createSlide(slideData);
          console.log(`Auto-created slide for: ${fileName}`);
        }
      }
      
      res.json({ images: sliderImages });
    } catch (error) {
      console.error("Error processing slider images:", error);
      res.status(500).json({ error: "Failed to process slider images" });
    }
  });

  // API route to handle direct file uploads
  app.post("/api/upload-direct", async (req, res) => {
    try {
      // This would handle direct file upload
      // For now, return success with a dummy path
      const fileName = `slide-${Date.now()}.jpg`;
      const targetPath = `inicio/slider/${fileName}`;
      const imageUrl = `/public-objects/${targetPath}`;
      
      res.json({ 
        success: true,
        imageUrl,
        path: targetPath,
        fileName
      });
    } catch (error) {
      console.error("Error processing direct upload:", error);
      res.status(500).json({ error: "Failed to process upload" });
    }
  });

  // API route to upload slider images
  app.post("/api/upload-slider-image", async (req, res) => {
    try {
      const { fileName, targetPath } = req.body;
      
      if (!fileName || !targetPath) {
        return res.status(400).json({ error: "fileName and targetPath are required" });
      }

      // The file should already be uploaded via the object uploader
      // This endpoint just confirms the upload location
      const imageUrl = `/public-objects/${targetPath}`;
      
      res.json({ 
        success: true,
        imageUrl,
        path: targetPath
      });
    } catch (error) {
      console.error("Error processing slider image upload:", error);
      res.status(500).json({ error: "Failed to process slider image upload" });
    }
  });

  // API route to upload individual textures for each category
  app.post("/api/upload-individual-textures", async (req, res) => {
    try {
      console.log('Starting individual textures upload...');
      
      const textureCategories = [
        '3D', 'Amostras', 'Animal', 'Arabesco', 'Azulejo', 'Baby', 'Baby-2.0', 
        'Baby-Colors', 'Baby-Paineis', 'Baby-Pantone', 'Casual', 
        'Chevron', 'Couro', 'Floral', 'Folhas', 'Geometrico'
      ];
      
      const uploadResults = [];
      
      for (const category of textureCategories) {
        const categoryPath = `loja/papel-de-parede/texturas/${category}`;
        
        // Check if directory exists
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath);
          const imageFiles = files.filter((file: string) => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
          );
          
          for (const file of imageFiles) {
            try {
              const filePath = path.join(categoryPath, file);
              const fileBuffer = fs.readFileSync(filePath);
              const targetPath = `loja/papel-de-parede/texturas/${category}/${file}`;
              
              // Determine content type
              const ext = path.extname(file).toLowerCase();
              const contentType = ext === '.webp' ? 'image/webp' : 
                                ext === '.png' ? 'image/png' : 'image/jpeg';
              
              await objectStorageService.uploadPublicFile(targetPath, fileBuffer, contentType);
              uploadResults.push({ category, file, status: 'success' });
              console.log(`✓ Uploaded ${category}/${file}`);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              uploadResults.push({ category, file, status: 'error', error: errorMessage });
              console.error(`✗ Error uploading ${category}/${file}:`, errorMessage);
            }
          }
        } else {
          console.log(`Directory ${categoryPath} does not exist, skipping...`);
        }
      }
      
      res.json({ 
        message: 'Individual textures upload completed',
        results: uploadResults,
        total: uploadResults.length,
        successful: uploadResults.filter(r => r.status === 'success').length
      });
      
    } catch (error) {
      console.error("Error in individual textures upload:", error);
      res.status(500).json({ error: "Failed to upload individual textures" });
    }
  });

  // Admin endpoint to get all contacts for email marketing
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ contacts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Admin Portfolio - Delete image
  app.delete("/api/admin/portfolio/delete", async (req, res) => {
    try {
      const { filename } = req.body;
      
      if (!filename) {
        return res.status(400).json({ error: "Filename is required" });
      }

      // Validate that it's a portfolio image
      if (!filename.startsWith('portfolio/')) {
        return res.status(400).json({ error: "Only portfolio images can be deleted" });
      }

      const deleted = await objectStorageService.deletePublicFile(filename);
      
      if (deleted) {
        res.json({ success: true, message: "Image deleted successfully" });
      } else {
        res.status(404).json({ error: "Image not found" });
      }
    } catch (error) {
      console.error('Error deleting portfolio image:', error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Admin endpoint to export contacts as CSV for email marketing
  app.get("/api/admin/contacts/export", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      
      // Create CSV content
      const csvHeader = "Nome,Email,Telefone,Empresa,Data,Mensagem\n";
      const csvContent = contacts.map((contact: Contact) => {
        const date = contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-PT') : '';
        return `"${contact.nome}","${contact.email}","${contact.telefone || ''}","${contact.empresa || ''}","${date}","${contact.mensagem.replace(/"/g, '""')}"`;
      }).join('\n');
      
      const csv = csvHeader + csvContent;
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="contactos-domrealce.csv"');
      res.send('\uFEFF' + csv); // Add BOM for Excel compatibility
    } catch (error) {
      console.error('Error exporting contacts:', error);
      res.status(500).json({ error: "Failed to export contacts" });
    }
  });

  // Contact form submission endpoint with rate limiting
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertContactSchema.parse(req.body);
      
      // Normalize file URLs if any
      if (validatedData.ficheiros && validatedData.ficheiros.length > 0) {
        validatedData.ficheiros = validatedData.ficheiros.map(url => 
          objectStorageService.normalizeObjectEntityPath(url)
        );
      }
      
      // Save contact to storage
      const contact = await storage.createContact(validatedData);
      
      // Send email notifications (don't wait for them)
      Promise.all([
        sendContactEmail(contact),
        sendAutoReplyEmail(contact)
      ]).catch(error => {
        console.error('Error sending emails:', error);
      });
      
      res.json({ 
        success: true, 
        message: "Mensagem enviada com sucesso. Entraremos em contacto brevemente." 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar mensagem. Por favor, tente novamente." 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Download attachment endpoint
  app.get('/api/contacts/attachment/:contactId/:fileName', async (req, res) => {
    try {
      const { contactId, fileName } = req.params;
      
      // Buscar o contacto para verificar se o ficheiro existe
      const contacts = await storage.getAllContacts();
      const contact = contacts.find(c => c.id === contactId);
      
      if (!contact) {
        return res.status(404).json({ error: 'Contacto não encontrado' });
      }
      
      if (!contact.ficheiros || contact.ficheiros.length === 0) {
        return res.status(404).json({ error: 'Nenhum ficheiro encontrado para este contacto' });
      }
      
      // Encontrar o ficheiro pelo nome (formato: "nome.ext|url" ou apenas "nome.ext")
      const fileInfo = contact.ficheiros.find(f => {
        if (f.includes('|')) {
          const [originalName] = f.split('|');
          return originalName.includes(decodeURIComponent(fileName));
        }
        return f.includes(decodeURIComponent(fileName));
      });
      
      if (!fileInfo) {
        return res.status(404).json({ error: 'Ficheiro não encontrado' });
      }
      
      // Se o ficheiro tem URL (formato: "nome.ext|url"), redirecionar
      if (fileInfo.includes('|')) {
        const [originalName, fileUrl] = fileInfo.split('|');
        if (fileUrl) {
          return res.redirect(fileUrl);
        }
      }
      
      // Se não tem URL, retornar erro (ficheiro antigo sem upload real)
      return res.status(404).json({ error: 'URL do ficheiro não encontrado - ficheiro não foi carregado correctamente' });
      
    } catch (error) {
      console.error('Error downloading attachment:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Get featured products for homepage
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  // Get recent news for homepage
  app.get("/api/news/recent", async (req, res) => {
    try {
      const news = await storage.getRecentNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching recent news:", error);
      res.status(500).json({ error: "Failed to fetch recent news" });
    }
  });

  // Orders management routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/admin/orders", adminAuth, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/number/:numeroEncomenda", async (req, res) => {
    try {
      const { numeroEncomenda } = req.params;
      const order = await storage.getOrderByNumber(numeroEncomenda);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order by number:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const order = await storage.updateOrder(id, updateData);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.put("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, estadoPagamento } = req.body;
      const order = await storage.updateOrderStatus(id, estado, estadoPagamento);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.delete("/api/admin/orders/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteOrder(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Payment routes
  
  // Create payment
  app.post("/api/payments/create", async (req, res) => {
    try {
      const { method, orderId, amount, customerData, returnUrls } = req.body;
      
      if (!method || !orderId || !amount) {
        return res.status(400).json({ 
          success: false, 
          message: "Método de pagamento, ID do pedido e valor são obrigatórios" 
        });
      }

      let paymentData: any;

      switch (method as PaymentMethod) {
        case 'multibanco':
          paymentData = await ifthenPayService.createMultibancoPayment({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            customerEmail: customerData?.email,
          });
          break;

        case 'mbway':
          if (!customerData?.phone) {
            return res.status(400).json({ 
              success: false, 
              message: "Número de telefone é obrigatório para MB WAY" 
            });
          }
          paymentData = await ifthenPayService.createMBWayPayment({
            orderId,
            amount: parseFloat(amount),
            phone: customerData.phone,
            description: `Papel de parede - Pedido ${orderId}`,
            customerEmail: customerData?.email,
          });
          break;


        case 'creditcard':
          if (!returnUrls) {
            return res.status(400).json({ 
              success: false, 
              message: "URLs de retorno são obrigatórias para cartão de crédito" 
            });
          }
          paymentData = await ifthenPayService.createCreditCardPayment({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            successUrl: returnUrls.success,
            errorUrl: returnUrls.error,
            cancelUrl: returnUrls.cancel,
            customerEmail: customerData?.email,
          });
          break;

        case 'paybylink':
          paymentData = await ifthenPayService.createPayByLink({
            orderId,
            amount: parseFloat(amount),
            description: `Papel de parede - Pedido ${orderId}`,
            expiryDays: 3,
            methods: ['multibanco', 'mbway', 'creditcard'],
          });
          break;

        default:
          return res.status(400).json({ 
            success: false, 
            message: "Método de pagamento não suportado" 
          });
      }

      res.json({
        success: true,
        method,
        data: paymentData,
      });

    } catch (error) {
      console.error('Error creating payment:', error);
      console.error('Payment method was:', req.body.method);
      console.error('Full error details:', error instanceof Error ? error.message : error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Erro ao criar pagamento. Tente novamente."
      });
    }
  });

  // Check MB WAY payment status
  app.post("/api/payments/mbway/status", async (req, res) => {
    try {
      const { requestId } = req.body;
      
      if (!requestId) {
        return res.status(400).json({ 
          success: false, 
          message: "Request ID é obrigatório" 
        });
      }

      try {
        // Try to check real status with IfthenPay
        const statusResponse = await ifthenPayService.checkMBWayStatus(requestId);
        
        res.json({
          success: true,
          status: statusResponse.status,
          message: statusResponse.status === "paid" 
            ? "Pagamento confirmado!" 
            : "Aguarde confirmação no seu telemóvel"
        });
      } catch (statusError) {
        // If status check fails, return pending (fallback behavior)
        console.warn('MB WAY status check failed, returning pending:', statusError);
        res.json({
          success: true,
          status: "pending",
          message: "Aguarde confirmação no seu telemóvel"
        });
      }

    } catch (error) {
      console.error('Error checking MB WAY status:', error);
      res.json({
        success: true,
        status: "pending", 
        message: "Aguarde confirmação no seu telemóvel"
      });
    }
  });

  // Payment callback (webhook) handler - IfthenPay sends GET requests
  app.get("/api/payments/callback", async (req, res) => {
    try {
      const { 
        key,             // Anti-phishing key (standard format)
        chave,           // Anti-phishing key (Portuguese format)
        orderId,         // Order ID
        amount,          // Amount
        requestId,       // Request ID
        entity,          // Entity (Multibanco)
        entidade,        // Entity (Portuguese)
        reference,       // Reference (Multibanco)
        referencia,      // Reference (Portuguese)
        payment_datetime, // Payment datetime
        datahorapag,     // Payment datetime (Portuguese)
        valor            // Amount (Portuguese)
      } = req.query;
      
      console.log('IfthenPay callback received from www.domrealce.com:', {
        chave: chave ? `${String(chave).substring(0,5)}...` : 'missing',
        key: key ? `${String(key).substring(0,5)}...` : 'missing',
        entidade,
        referencia,
        valor,
        datahorapag,
        orderId,
        amount,
        requestId,
        payment_datetime
      });
      
      // Validate anti-phishing key (support both formats)
      const expectedKey = process.env.IFTHENPAY_ANTI_PHISHING_KEY;
      const receivedKey = chave || key; // Try both parameter names
      
      if (!expectedKey) {
        console.log('Anti-phishing key not configured in environment');
        return res.status(200).send('OK'); // Don't reject if not configured yet
      }
      
      if (receivedKey !== expectedKey) {
        console.log(`Invalid anti-phishing key. Expected: ${expectedKey.substring(0,5)}..., Got: ${String(receivedKey).substring(0,5)}...`);
        return res.status(403).send('Forbidden');
      }

      // Process payment confirmation (support multiple formats)
      const finalAmount = valor || amount;
      const finalOrderId = orderId || `Ref-${referencia}`;
      const finalDateTime = datahorapag || payment_datetime;
      
      console.log(`✓ Payment confirmed! Order: ${finalOrderId}, Amount: €${finalAmount}, Entity: ${entidade}, Reference: ${referencia}, DateTime: ${finalDateTime}`);
      
      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation email to customer
      // 3. Trigger any business logic (e.g., start production)
      
      // Return HTTP 200 to acknowledge receipt (required by IfthenPay)
      res.status(200).send('OK');

    } catch (error) {
      console.error('Error processing callback:', error);
      res.status(500).send('Error processing callback');
    }
  });

  // Payment notification endpoint
  app.get("/api/payments/notification", async (req, res) => {
    try {
      console.log('IfthenPay notification received:', req.query);
      
      // Process notification (same as callback but for email notifications)
      // This endpoint is for additional notifications, main processing is in callback
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing notification:', error);
      res.status(500).send('Error processing notification');
    }
  });

  // Payment success page
  app.get("/api/payments/success", (req, res) => {
    const { orderId, amount } = req.query;
    
    // Validate required parameters
    if (!orderId || !amount) {
      console.error('Payment success callback missing required parameters:', { orderId, amount });
      return res.redirect(`/checkout?error=missing-parameters`);
    }
    
    // Validate amount format
    const amountNum = parseFloat(amount as string);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error('Payment success callback invalid amount:', amount);
      return res.redirect(`/checkout?error=invalid-amount&orderId=${orderId}`);
    }
    
    res.redirect(`/pedido-confirmado?orderId=${orderId}&amount=${amount}`);
  });

  // Payment error page
  app.get("/api/payments/error", (req, res) => {
    const { orderId, error } = req.query;
    
    // Log error for debugging
    console.error('Payment error callback received:', { orderId, error });
    
    // Ensure we have at least an error message
    const errorMsg = error || 'unknown-error';
    const orderParam = orderId ? `&orderId=${orderId}` : '';
    
    res.redirect(`/checkout?error=${errorMsg}${orderParam}`);
  });

  // Payment cancel page
  app.get("/api/payments/cancel", (req, res) => {
    const { orderId } = req.query;
    res.redirect(`/checkout?cancelled=true&orderId=${orderId}`);
  });

  // Admin API routes for managing content
  
  // Admin Slider routes
  app.get("/api/admin/slider", async (req, res) => {
    try {
      const slides = await storage.getSlides();
      res.json({ slides });
    } catch (error) {
      console.error("Error fetching slides:", error);
      res.status(500).json({ error: "Failed to fetch slides" });
    }
  });

  app.post("/api/admin/slider", async (req, res) => {
    try {
      const slideData = insertSlideSchema.parse(req.body);
      const slide = await storage.createSlide(slideData);
      res.json({ success: true, slide });
    } catch (error) {
      console.error("Error creating slide:", error);
      res.status(500).json({ error: "Failed to create slide" });
    }
  });

  app.put("/api/admin/slider/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const slideData = insertSlideSchema.parse(req.body);
      const slide = await storage.updateSlide(id, slideData);
      res.json({ success: true, slide });
    } catch (error) {
      console.error("Error updating slide:", error);
      res.status(500).json({ error: "Failed to update slide" });
    }
  });

  app.delete("/api/admin/slider/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSlide(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting slide:", error);
      res.status(500).json({ error: "Failed to delete slide" });
    }
  });

  // Admin Products routes
  app.get("/api/admin/produtos", async (req, res) => {
    try {
      const produtos = await storage.getAllProducts();
      res.json({ produtos });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/produtos", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.createProduct(productData);
      res.json({ success: true, produto });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/produtos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.updateProduct(id, productData);
      res.json({ success: true, produto });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/produtos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin News routes
  app.get("/api/admin/noticias", async (req, res) => {
    try {
      const noticias = await storage.getAllNews();
      res.json({ noticias });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/admin/noticias", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const noticia = await storage.createNews(newsData);
      res.json({ success: true, noticia });
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ error: "Failed to create news" });
    }
  });

  app.put("/api/admin/noticias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const newsData = insertNewsSchema.parse(req.body);
      const noticia = await storage.updateNews(id, newsData);
      res.json({ success: true, noticia });
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(500).json({ error: "Failed to update news" });
    }
  });

  app.delete("/api/admin/noticias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteNews(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ error: "Failed to delete news" });
    }
  });

  // Admin Loja routes (specialized for store products)
  app.get("/api/admin/loja", async (req, res) => {
    try {
      const produtos = await storage.getAllProducts();
      // Filter products that are store-related (Papel de Parede or texture categories)
      res.json({ produtos });
    } catch (error) {
      console.error("Error fetching loja products:", error);
      res.status(500).json({ error: "Failed to fetch loja products" });
    }
  });

  app.post("/api/admin/loja", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.createProduct(productData);
      res.json({ success: true, produto });
    } catch (error) {
      console.error("Error creating loja product:", error);
      res.status(500).json({ error: "Failed to create loja product" });
    }
  });

  app.put("/api/admin/loja/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.parse(req.body);
      const produto = await storage.updateProduct(id, productData);
      res.json({ success: true, produto });
    } catch (error) {
      console.error("Error updating loja product:", error);
      res.status(500).json({ error: "Failed to update loja product" });
    }
  });

  app.delete("/api/admin/loja/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduct(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting loja product:", error);
      res.status(500).json({ error: "Failed to delete loja product" });
    }
  });

  // Admin Contacts routes
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Admin Page Config routes
  // Endpoint for EditableConfigText component to save individual configurations
  // Must be BEFORE the generic /:page route to avoid conflicts
  app.post("/api/admin/pages/:page/config", async (req, res) => {
    try {
      const { page } = req.params;
      const { section, element, value } = req.body;
      
      console.log('Config update request:', { page, section, element, value });
      
      // Validate required fields
      if (!section || !element || value === undefined) {
        return res.status(400).json({ 
          error: "Missing required fields: section, element, and value are required" 
        });
      }

      const configData = {
        page,
        section,
        element,
        type: "text", // Default type, can be enhanced later
        value: String(value)
      };

      const config = await storage.upsertPageConfig(configData);
      console.log('Config saved successfully:', config);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error updating page config:", error);
      res.status(500).json({ error: "Failed to update page config" });
    }
  });

  app.get("/api/admin/pages", async (req, res) => {
    try {
      const { page } = req.query;
      const configs = await storage.getPageConfigs(page as string);
      res.json({ configs });
    } catch (error) {
      console.error("Error fetching page configs:", error);
      res.status(500).json({ error: "Failed to fetch page configs" });
    }
  });

  app.get("/api/admin/pages/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const configs = await storage.getPageConfigs(page);
      res.json({ configs });
    } catch (error) {
      console.error("Error fetching page configs:", error);
      res.status(500).json({ error: "Failed to fetch page configs" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.createPageConfig(configData);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error creating page config:", error);
      res.status(500).json({ error: "Failed to create page config" });
    }
  });

  app.put("/api/admin/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.updatePageConfig(id, configData);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error updating page config:", error);
      res.status(500).json({ error: "Failed to update page config" });
    }
  });

  app.delete("/api/admin/pages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePageConfig(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting page config:", error);
      res.status(500).json({ error: "Failed to delete page config" });
    }
  });

  app.post("/api/admin/pages/upsert", async (req, res) => {
    try {
      const configData = insertPageConfigSchema.parse(req.body);
      const config = await storage.upsertPageConfig(configData);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Error upserting page config:", error);
      res.status(500).json({ error: "Failed to upsert page config" });
    }
  });


  // API endpoint to get page configurations for frontend rendering
  app.get("/api/page-config/:page", async (req, res) => {
    try {
      const { page } = req.params;
      const configs = await storage.getPageConfigs(page);
      
      // Transform configs into a structured object for easier frontend use
      const structuredConfigs: Record<string, Record<string, any>> = {};
      
      configs.forEach(config => {
        if (!structuredConfigs[config.section]) {
          structuredConfigs[config.section] = {};
        }
        structuredConfigs[config.section][config.element] = {
          value: config.value,
          type: config.type,
          metadata: config.metadata ? JSON.parse(config.metadata) : null
        };
      });
      
      res.json({ configs: structuredConfigs });
    } catch (error) {
      console.error("Error fetching page config:", error);
      res.status(500).json({ error: "Failed to fetch page config" });
    }
  });

  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // Visual Editor API routes
  app.get("/api/editor/page/:route", getPageContent);
  app.post("/api/editor/page", savePageContentEndpoint);
  
  // Media Manager API routes
  app.get("/api/media/index", getMediaIndex);
  app.get("/api/media/folders", getMediaFolders);
  app.post("/api/media/sync", syncGlobalImages);
  app.post("/api/media/upload", upload.array('files'), uploadMediaFiles);
  app.delete("/api/media/files", deleteMediaFiles);

  const httpServer = createServer(app);

  return httpServer;
}
