import { useEffect } from 'react';
import { useLocation } from 'wouter';

import { pageSEOData, DEFAULT_SOCIAL_IMAGE, type SEOProps } from '@shared/page-seo';

export default function SEO({ title, description, image, type = 'website', keywords = [], noIndex = false }: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Get page-specific SEO data or use provided props
    const pageData = pageSEOData[location] || {};
    const finalTitle = title || pageData.title || 'DOMREALCE | Impressão Digital e Comunicação Visual';
    const finalDescription = description || pageData.description || 'Impressão digital e comunicação visual. Produção em Paredes e fornecimento de produtos para Portugal.';
    const finalKeywords = [...(pageData.keywords || []), ...keywords];
    const finalType = type || pageData.type || 'website';
    const finalImage = image || pageData.image || DEFAULT_SOCIAL_IMAGE;

    // Update document title
    document.title = finalTitle;

    // Update meta description
    updateMetaTag('description', finalDescription);

    // Update keywords
    if (finalKeywords.length > 0) {
      updateMetaTag('keywords', finalKeywords.join(', '));
    }

    // Update robots
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update canonical URL
    updateLinkTag('canonical', `https://www.domrealce.com${location}`);

    // Update Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:type', finalType);
    updateMetaProperty('og:url', `https://www.domrealce.com${location}`);
    updateMetaProperty('og:image', finalImage);

    // Update Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:image', finalImage);

    // Update additional SEO tags
    updateMetaName('author', 'DOMREALCE');
    updateMetaProperty('og:locale', 'pt_PT');
    updateMetaProperty('og:site_name', 'DOMREALCE');

    // Add preconnect for performance
    addPreconnectLink('https://fonts.googleapis.com');
    addPreconnectLink('https://fonts.gstatic.com');
    addPreconnectLink('https://www.google-analytics.com');

  }, [location, title, description, image, type, keywords, noIndex]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function addPreconnectLink(href: string) {
  if (!document.querySelector(`link[href="${href}"][rel="preconnect"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'preconnect');
    link.setAttribute('href', href);
    link.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(link);
  }
}
