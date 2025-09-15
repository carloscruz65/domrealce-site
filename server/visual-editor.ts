import type { Request, Response } from "express";
import { ObjectStorageService } from "./objectStorage";
import { storage } from "./storage";
import type { InsertPageConfig } from "@shared/schema";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'gallery' | 'grid' | 'cta' | 'separator' | 'section';
  content: any;
  styles: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    width?: string;
  };
  position: number;
}

interface PageContent {
  id: string;
  route: string;
  title: string;
  blocks: Block[];
  metadata: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string;
  };
  version: number;
  status: 'draft' | 'published';
  updatedAt: string;
}

interface MediaFile {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
  dimensions?: { width: number; height: number };
  pageRoute?: string;
  category?: string;
  alt?: string;
  tags?: string[];
  hash: string;
  uploadedAt: string;
}

const objectStorageService = new ObjectStorageService();

// Simulate JSON storage for development (in production, use database)
const CONTENT_DIR = './temp-content';
const MEDIA_INDEX_FILE = path.join(CONTENT_DIR, 'media-index.json');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

function getPageContentPath(route: string): string {
  const sanitizedRoute = route.replace(/[^a-zA-Z0-9-_]/g, '_');
  return path.join(CONTENT_DIR, `page_${sanitizedRoute}.json`);
}

function loadPageContent(route: string): PageContent | null {
  try {
    const filePath = getPageContentPath(route);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading page content:', error);
  }
  return null;
}

function savePageContent(pageContent: PageContent): void {
  try {
    const filePath = getPageContentPath(pageContent.route);
    fs.writeFileSync(filePath, JSON.stringify(pageContent, null, 2));
  } catch (error) {
    console.error('Error saving page content:', error);
    throw error;
  }
}

function loadMediaIndex(): MediaFile[] {
  try {
    if (fs.existsSync(MEDIA_INDEX_FILE)) {
      const content = fs.readFileSync(MEDIA_INDEX_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading media index:', error);
  }
  return [];
}

function saveMediaIndex(mediaFiles: MediaFile[]): void {
  try {
    fs.writeFileSync(MEDIA_INDEX_FILE, JSON.stringify(mediaFiles, null, 2));
  } catch (error) {
    console.error('Error saving media index:', error);
    throw error;
  }
}

function generateFileHash(key: string): string {
  return crypto.createHash('md5').update(key).digest('hex');
}

function sanitizeRoute(route: string): string {
  return route.replace(/[^a-zA-Z0-9-_/]/g, '').toLowerCase();
}

function extractPageRouteFromPath(key: string): string | undefined {
  // Extract page route from paths like "public/pages/servicos/impressao.jpg"
  const match = key.match(/^public\/pages\/([^/]+)/);
  if (match) {
    const route = match[1];
    return route === 'index' ? '/' : `/${route}`;
  }
  return undefined;
}

function extractCategoryFromPath(key: string): string | undefined {
  // Extract category from paths like "public/portfolio/Autocolantes/img.jpg"
  const portfolioMatch = key.match(/^public\/portfolio\/([^/]+)/);
  if (portfolioMatch) {
    return portfolioMatch[1];
  }
  
  // Extract from pages
  const pagesMatch = key.match(/^public\/pages\/([^/]+)/);
  if (pagesMatch) {
    return 'pages';
  }
  
  return 'media';
}

function generateAltFromFilename(filename: string): string {
  const name = path.basename(filename, path.extname(filename));
  return name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Function to convert PageContent blocks to PageConfig entries
async function syncPageContentToDatabase(pageContent: PageContent): Promise<void> {
  try {
    console.log(`🔄 Syncing page content to database: ${pageContent.route}`);
    
    // Map route to page identifier
    const pageId = pageContent.route === '/' ? 'home' : pageContent.route.replace('/', '');
    
    // Sync SEO metadata
    if (pageContent.metadata.seoTitle) {
      await storage.upsertPageConfig({
        page: pageId,
        section: 'seo',
        element: 'title',
        type: 'text',
        value: pageContent.metadata.seoTitle,
        defaultValue: null,
        metadata: null
      });
    }
    
    if (pageContent.metadata.seoDescription) {
      await storage.upsertPageConfig({
        page: pageId,
        section: 'seo',
        element: 'description',
        type: 'text',
        value: pageContent.metadata.seoDescription,
        defaultValue: null,
        metadata: null
      });
    }
    
    if (pageContent.metadata.keywords) {
      await storage.upsertPageConfig({
        page: pageId,
        section: 'seo',
        element: 'keywords',
        type: 'text',
        value: pageContent.metadata.keywords,
        defaultValue: null,
        metadata: null
      });
    }
    
    // Sync page title
    await storage.upsertPageConfig({
      page: pageId,
      section: 'page',
      element: 'title',
      type: 'text',
      value: pageContent.title,
      defaultValue: null,
      metadata: null
    });
    
    // Sync blocks
    for (const block of pageContent.blocks) {
      const blockSection = `block_${block.position}`;
      
      // Store block type
      await storage.upsertPageConfig({
        page: pageId,
        section: blockSection,
        element: 'type',
        type: 'text',
        value: block.type,
        defaultValue: null,
        metadata: null
      });
      
      // Store block content as JSON
      await storage.upsertPageConfig({
        page: pageId,
        section: blockSection,
        element: 'content',
        type: 'json',
        value: JSON.stringify(block.content),
        defaultValue: null,
        metadata: null
      });
      
      // Store block styles as JSON
      await storage.upsertPageConfig({
        page: pageId,
        section: blockSection,
        element: 'styles',
        type: 'json',
        value: JSON.stringify(block.styles),
        defaultValue: null,
        metadata: null
      });
      
      // For compatibility with existing usePageConfig, sync common content
      if (block.type === 'hero' && block.content.title) {
        await storage.upsertPageConfig({
          page: pageId,
          section: 'hero',
          element: 'title',
          type: 'text',
          value: block.content.title,
          defaultValue: null,
          metadata: null
        });
        
        if (block.content.subtitle) {
          await storage.upsertPageConfig({
            page: pageId,
            section: 'hero',
            element: 'subtitle',
            type: 'text',
            value: block.content.subtitle,
            defaultValue: null,
            metadata: null
          });
        }
        
        if (block.content.description) {
          await storage.upsertPageConfig({
            page: pageId,
            section: 'hero',
            element: 'description',
            type: 'text',
            value: block.content.description,
            defaultValue: null,
            metadata: null
          });
        }
      }
      
      if (block.type === 'text' && block.content.content) {
        await storage.upsertPageConfig({
          page: pageId,
          section: 'content',
          element: 'text',
          type: 'html',
          value: block.content.content,
          defaultValue: null,
          metadata: null
        });
      }
      
      if (block.type === 'section' && block.content.title) {
        await storage.upsertPageConfig({
          page: pageId,
          section: 'section',
          element: 'title',
          type: 'text',
          value: block.content.title,
          defaultValue: null,
          metadata: null
        });
        
        if (block.content.content) {
          await storage.upsertPageConfig({
            page: pageId,
            section: 'section',
            element: 'content',
            type: 'text',
            value: block.content.content,
            defaultValue: null,
            metadata: null
          });
        }
      }
    }
    
    console.log(`✅ Successfully synced page content to database: ${pageContent.route}`);
  } catch (error) {
    console.error(`❌ Error syncing page content to database:`, error);
    throw error;
  }
}

// Editor endpoints
export async function getPageContent(req: Request, res: Response) {
  try {
    const { route } = req.params;
    let sanitizedRoute = sanitizeRoute(route);
    
    // Convert 'index' to '/' for home page
    if (sanitizedRoute === 'index') {
      sanitizedRoute = '/';
    } else if (!sanitizedRoute.startsWith('/')) {
      sanitizedRoute = '/' + sanitizedRoute;
    }
    
    const pageContent = loadPageContent(sanitizedRoute);
    
    if (pageContent) {
      res.json(pageContent);
    } else {
      // Create a new empty page if it doesn't exist
      const newPage: PageContent = {
        id: crypto.createHash('md5').update(sanitizedRoute + Date.now()).digest('hex'),
        route: sanitizedRoute,
        title: sanitizedRoute === '/' ? 'Página Inicial' : 
               sanitizedRoute === '/sobre' ? 'Sobre Nós' :
               sanitizedRoute === '/servicos' ? 'Serviços' :
               sanitizedRoute === '/portfolio' ? 'Portfólio' :
               sanitizedRoute === '/contactos' ? 'Contactos' :
               sanitizedRoute === '/loja' ? 'Loja Online' : 'Nova Página',
        blocks: [
          {
            id: crypto.createHash('md5').update('default-hero' + Date.now()).digest('hex'),
            type: 'hero',
            content: {
              title: 'Bem-vindo',
              subtitle: 'Esta é uma página nova criada no Editor Visual',
              backgroundImage: '',
              buttonText: 'Saiba Mais',
              buttonLink: '#'
            },
            styles: {
              backgroundColor: '#0a0a0a',
              textColor: '#ffffff',
              padding: '4rem 1rem',
              textAlign: 'center'
            },
            position: 0
          }
        ],
        metadata: {
          seoTitle: sanitizedRoute === '/' ? 'DOMREALCE - Comunicação Visual' : 'DOMREALCE',
          seoDescription: 'Comunicação visual e impressão digital em Portugal',
          keywords: 'comunicação visual, impressão digital, design gráfico'
        },
        version: 1,
        status: 'draft',
        updatedAt: new Date().toISOString()
      };
      
      // Save the new page
      savePageContent(newPage);
      res.json(newPage);
    }
  } catch (error) {
    console.error('Error getting page content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function savePageContentEndpoint(req: Request, res: Response) {
  try {
    const pageContent: PageContent = req.body;
    
    // Validate required fields
    if (!pageContent.route || !pageContent.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Sanitize route
    pageContent.route = sanitizeRoute(pageContent.route);
    
    // Update timestamp
    pageContent.updatedAt = new Date().toISOString();
    
    // Save to JSON file (for editor draft/published state)
    savePageContent(pageContent);
    
    // If publishing, sync to PostgreSQL database for public pages
    if (pageContent.status === 'published') {
      console.log(`📤 Publishing page content to database: ${pageContent.route}`);
      await syncPageContentToDatabase(pageContent);
    }
    
    res.json({ success: true, pageContent });
  } catch (error) {
    console.error('Error saving page content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Media management endpoints
export async function getMediaIndex(req: Request, res: Response) {
  try {
    const mediaFiles = loadMediaIndex();
    res.json({ files: mediaFiles });
  } catch (error) {
    console.error('Error getting media index:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMediaFolders(req: Request, res: Response) {
  try {
    const mediaFiles = loadMediaIndex();
    
    // Group by category and count
    const folderMap = new Map<string, { count: number; lastModified: string }>();
    
    mediaFiles.forEach(file => {
      const category = file.category || 'media';
      const existing = folderMap.get(category) || { count: 0, lastModified: file.uploadedAt };
      
      folderMap.set(category, {
        count: existing.count + 1,
        lastModified: file.uploadedAt > existing.lastModified ? file.uploadedAt : existing.lastModified
      });
    });
    
    const folders = Array.from(folderMap.entries()).map(([name, data]) => ({
      name,
      path: name,
      count: data.count,
      lastModified: data.lastModified
    }));
    
    res.json({ folders });
  } catch (error) {
    console.error('Error getting media folders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function syncGlobalImages(req: Request, res: Response) {
  try {
    const existingFiles = loadMediaIndex();
    const existingHashes = new Set(existingFiles.map(f => f.hash));
    
    // Get all images from object storage
    const allImages = await objectStorageService.listPublicFiles();
    
    const newFiles: MediaFile[] = [];
    const updatedFiles: MediaFile[] = [];
    const errors: string[] = [];
    
    for (const imageKey of allImages) {
      try {
        // Skip non-image files
        if (!imageKey.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          continue;
        }
        
        const hash = generateFileHash(imageKey);
        
        // Skip if already exists
        if (existingHashes.has(hash)) {
          continue;
        }
        
        const mediaFile: MediaFile = {
          key: imageKey,
          name: path.basename(imageKey),
          url: `/public-objects/${imageKey}`,
          size: 0, // Would need to get actual size from storage
          type: `image/${path.extname(imageKey).slice(1).toLowerCase()}`,
          pageRoute: extractPageRouteFromPath(imageKey),
          category: extractCategoryFromPath(imageKey),
          alt: generateAltFromFilename(imageKey),
          tags: [],
          hash,
          uploadedAt: new Date().toISOString()
        };
        
        newFiles.push(mediaFile);
      } catch (error) {
        console.error(`Error processing ${imageKey}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to process ${imageKey}: ${errorMessage}`);
      }
    }
    
    // Save updated index
    const allFiles = [...existingFiles, ...newFiles];
    saveMediaIndex(allFiles);
    
    res.json({
      newFiles: newFiles.length,
      updatedFiles: updatedFiles.length,
      ignoredFiles: allImages.length - newFiles.length,
      errors
    });
  } catch (error) {
    console.error('Error syncing global images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function uploadMediaFiles(req: Request, res: Response) {
  try {
    const files = req.files as any[];
    const folder = req.body.folder || 'media';
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }
    
    const uploadedFiles: MediaFile[] = [];
    const errors: string[] = [];
    
    for (const file of files) {
      try {
        // Upload to object storage
        const key = `${folder}/${Date.now()}_${file.originalname}`;
        await objectStorageService.uploadPublicFile(key, file.buffer, file.mimetype);
        
        const mediaFile: MediaFile = {
          key,
          name: file.originalname,
          url: `/public-objects/${key}`,
          size: file.size,
          type: file.mimetype,
          category: folder,
          alt: generateAltFromFilename(file.originalname),
          tags: [],
          hash: generateFileHash(key),
          uploadedAt: new Date().toISOString()
        };
        
        uploadedFiles.push(mediaFile);
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to upload ${file.originalname}: ${errorMessage}`);
      }
    }
    
    // Update media index
    const existingFiles = loadMediaIndex();
    const allFiles = [...existingFiles, ...uploadedFiles];
    saveMediaIndex(allFiles);
    
    res.json({
      uploaded: uploadedFiles.length,
      files: uploadedFiles,
      errors
    });
  } catch (error) {
    console.error('Error uploading media files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMediaFiles(req: Request, res: Response) {
  try {
    const { keys }: { keys: string[] } = req.body;
    
    if (!keys || keys.length === 0) {
      return res.status(400).json({ error: 'No file keys provided' });
    }
    
    const errors: string[] = [];
    let deleted = 0;
    
    for (const key of keys) {
      try {
        await objectStorageService.deletePublicFile(key);
        deleted++;
      } catch (error) {
        console.error(`Error deleting ${key}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to delete ${key}: ${errorMessage}`);
      }
    }
    
    // Update media index
    const existingFiles = loadMediaIndex();
    const remainingFiles = existingFiles.filter(file => !keys.includes(file.key));
    saveMediaIndex(remainingFiles);
    
    res.json({
      deleted,
      errors
    });
  } catch (error) {
    console.error('Error deleting media files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}