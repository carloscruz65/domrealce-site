import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    // Intersection Observer para fade-in ao scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Aplicar ao todos os elementos com data-scroll
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => {
      scrollElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}
