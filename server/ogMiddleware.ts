import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import fs from 'fs';
import path from 'path';

export async function ogMetaMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apenas interceptar rotas de notícias individuais
  const noticiaMatch = req.path.match(/^\/noticia\/(.+)$/);
  
  if (!noticiaMatch) {
    return next();
  }

  const noticiaId = noticiaMatch[1];
  console.log('🔍 OG Middleware: Interceptando notícia', noticiaId);

  try {
    // Buscar a notícia do storage
    const noticias = await storage.getAllNews();
    const noticia = noticias.find((n: any) => n.id === noticiaId);

    if (!noticia) {
      return next();
    }

    // Obter a primeira imagem da notícia
    const imagemNoticia = noticia.imagens?.[0] || noticia.imagem || '';
    
    // Ler o arquivo HTML base (diferente em dev vs prod)
    const isDev = process.env.NODE_ENV === 'development';
    const indexPath = isDev 
      ? path.join(process.cwd(), 'client', 'index.html')
      : path.join(process.cwd(), 'dist', 'public', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.log('HTML file not found:', indexPath);
      return next();
    }
    
    let html = fs.readFileSync(indexPath, 'utf-8');

    // Preparar os dados para as meta tags
    const titulo = noticia.titulo.replace(/"/g, '&quot;');
    const descricao = noticia.descricao.slice(0, 160).replace(/"/g, '&quot;');
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const imagem = imagemNoticia.startsWith('http') 
      ? imagemNoticia 
      : `${req.protocol}://${req.get('host')}${imagemNoticia}`;

    // Substituir/adicionar meta tags Open Graph - COMPLETAS para Facebook
    const ogTags = `
    <!-- Open Graph / Facebook - Notícia Individual -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descricao}" />
    <meta property="og:image" content="${imagem}" />
    <meta property="og:image:secure_url" content="${imagem.replace('http://', 'https://')}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${titulo}" />
    <meta property="og:locale" content="pt_PT" />
    <meta property="og:site_name" content="DOMREALCE" />
    <meta property="article:published_time" content="${noticia.data || new Date().toISOString()}" />
    <meta property="article:author" content="DOMREALCE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${titulo}" />
    <meta name="twitter:description" content="${descricao}" />
    <meta name="twitter:image" content="${imagem}" />
    
    <!-- SEO -->
    <title>${titulo} | DOMREALCE</title>
    <meta name="description" content="${descricao}" />
    <link rel="canonical" href="${url}" />
`;

    // Remover meta tags OG e Twitter existentes para evitar duplicação
    html = html.replace(/<meta\s+property="og:[^>]*>/gi, '');
    html = html.replace(/<meta\s+name="twitter:[^>]*>/gi, '');
    html = html.replace(/<meta\s+name="description"[^>]*>/gi, '');
    html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
    html = html.replace(/<title>[^<]*<\/title>/gi, '');

    // Inserir as meta tags antes do </head>
    html = html.replace('</head>', `${ogTags}</head>`);

    console.log('✅ OG Middleware: Meta tags injetadas');
    console.log('   - Título:', titulo);
    console.log('   - Imagem:', imagem);
    console.log('   - URL:', url);

    // Enviar o HTML modificado
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Erro ao gerar meta tags OG:', error);
    next();
  }
}
