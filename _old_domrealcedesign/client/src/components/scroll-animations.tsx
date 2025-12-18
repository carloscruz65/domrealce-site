import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, observerOptions);

      // Observe all elements with scroll animation classes
      const animateElements = document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right'
      );

      animateElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}