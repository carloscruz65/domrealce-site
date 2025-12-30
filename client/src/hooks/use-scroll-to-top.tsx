import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Check if URL has a hash for scrolling to specific element
    const hash = window.location.hash;
    
    if (hash) {
      // Wait for page to render then scroll to element (longer timeout for lazy loading)
      const scrollToHash = () => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 100; // Account for fixed header
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
      
      // Try immediately, then retry with delays for lazy-loaded content
      if (!scrollToHash()) {
        setTimeout(() => {
          if (!scrollToHash()) {
            setTimeout(scrollToHash, 300);
          }
        }, 150);
      }
    } else {
      // Default behavior - scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }, [location]);
}