import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          data-testid="scroll-to-top-button"
          className="fixed bottom-8 right-8 bg-brand-yellow text-black p-3 rounded-full hover:opacity-90 transition-opacity duration-300 z-40 shadow-lg"
          aria-label="Voltar para o topo"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
}
