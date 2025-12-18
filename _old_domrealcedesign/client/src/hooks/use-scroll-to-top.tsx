import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Check if URL has a hash for scrolling to specific element
    const hash = window.location.hash;
    
    if (hash) {
      // Wait for page to render then scroll to element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
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