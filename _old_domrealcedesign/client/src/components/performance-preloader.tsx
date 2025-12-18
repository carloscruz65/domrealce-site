import { useEffect } from 'react';

export default function PerformancePreloader() {
  useEffect(() => {
    // Preload critical resources
    const criticalAssets = [
      '/assets/domrealce-logo.png',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
    ];

    // Preload critical assets
    criticalAssets.forEach(asset => {
      if (asset.includes('fonts.googleapis.com')) {
        // Preload CSS
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = asset;
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      } else {
        // Preload images
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = asset;
        document.head.appendChild(link);
      }
    });

    // Add resource hints for external domains
    const resourceHints = [
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
    ];

    resourceHints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"][rel="${hint.rel}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.crossOrigin = hint.crossorigin;
        }
        document.head.appendChild(link);
      }
    });

    // Service Worker registration for caching
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, but don't break the app
      });
    }

    // Optimize images loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Critical CSS inlining detection
    const criticalCSS = document.getElementById('critical-css');
    if (!criticalCSS) {
      // Add minimal critical CSS inline for better LCP
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = `
        body { margin: 0; font-family: Inter, system-ui, sans-serif; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `;
      document.head.appendChild(style);
    }

  }, []);

  return null;
}