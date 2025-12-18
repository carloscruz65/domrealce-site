import { useEffect } from 'react';

export function useLazyImages() {
  useEffect(() => {
    // Add lazy loading to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });

    // Add alt text fallback for accessibility
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    imagesWithoutAlt.forEach((img, index) => {
      const src = (img.getAttribute('src') || '').split('/').pop() || `imagem-${index + 1}`;
      const altText = src.replace(/[-_]/g, ' ').replace(/\..+$/, '').trim();
      img.setAttribute('alt', altText);
    });

    // Intersection Observer for better lazy loading control
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            
            // Add fade-in animation when image loads
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
              img.style.opacity = '1';
            };
            
            lazyImageObserver.unobserve(img);
          }
        });
      });

      // Observe all lazy images
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        lazyImageObserver.observe(img);
      });

      // Cleanup observer on component unmount
      return () => {
        lazyImageObserver.disconnect();
      };
    }
  }, []);
}