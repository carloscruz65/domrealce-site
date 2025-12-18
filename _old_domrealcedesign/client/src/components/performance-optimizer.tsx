import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero image if it exists
      const heroSection = document.querySelector('section[style*="background-image"], .hero, [class*="hero"]');
      if (heroSection) {
        const bgImage = getComputedStyle(heroSection).backgroundImage;
        const imageUrl = bgImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
        
        if (imageUrl) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imageUrl;
          document.head.appendChild(link);
        }
      }

      // Preload fonts if not already done
      const fontPreloads = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
      ];

      fontPreloads.forEach(fontUrl => {
        if (!document.querySelector(`link[href="${fontUrl}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = fontUrl;
          link.onload = function() { 
            (this as any).onload = null; 
            (this as any).rel = 'stylesheet'; 
          };
          document.head.appendChild(link);
        }
      });

      // Preconnect to external domains
      const preconnectDomains = [
        'https://www.google-analytics.com',
        'https://fonts.googleapis.com', 
        'https://fonts.gstatic.com'
      ];

      preconnectDomains.forEach(domain => {
        if (!document.querySelector(`link[href="${domain}"][rel="preconnect"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // Optimize images for performance
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }

        // Add loading="lazy" for below-the-fold images
        if (!img.hasAttribute('loading')) {
          const rect = img.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('loading', 'eager');
          } else {
            img.setAttribute('loading', 'lazy');
          }
        }

        // Add error handling for broken images
        img.onerror = function() {
          this.style.display = 'none';
          console.warn('Failed to load image:', this.src);
        };
      });
    };

    // Defer non-critical resources
    const deferNonCriticalResources = () => {
      // Defer analytics and tracking scripts
      const scripts = document.querySelectorAll('script[src*="analytics"], script[src*="gtag"], script[src*="tracking"]');
      scripts.forEach(script => {
        if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
          script.setAttribute('defer', 'true');
        }
      });
    };

    // Run optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        preloadCriticalResources();
        optimizeImages();
        deferNonCriticalResources();
      });
    } else {
      preloadCriticalResources();
      optimizeImages();
      deferNonCriticalResources();
    }

    // Run image optimization again after a short delay to catch dynamically loaded images
    const timeout = setTimeout(() => {
      optimizeImages();
    }, 1000);

    // Optimize images when new ones are added to the DOM
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedImages = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === 1)
            .flatMap(node => {
              const element = node as Element;
              return element.tagName === 'IMG' ? [element] : Array.from(element.querySelectorAll('img'));
            });
          
          if (addedImages.length > 0) {
            setTimeout(optimizeImages, 100);
          }
        }
      });
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeout);
      imageObserver.disconnect();
    };
  }, []);

  return null;
}