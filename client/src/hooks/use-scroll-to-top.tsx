import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash) {
      const scrollToElement = () => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          return true;
        }
        return false;
      };

      // Retry mechanism for lazy-loaded content (up to 2 seconds)
      let attempts = 0;
      const maxAttempts = 20;
      
      const tryScroll = () => {
        if (scrollToElement()) return;
        attempts++;
        if (attempts < maxAttempts) {
          requestAnimationFrame(() => setTimeout(tryScroll, 100));
        }
      };
      
      // Start after a brief delay to let initial render complete
      setTimeout(tryScroll, 50);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }, [location]);
}
