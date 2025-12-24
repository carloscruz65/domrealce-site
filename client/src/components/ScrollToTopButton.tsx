import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
      data-testid="button-scroll-to-top"
    >
      <ArrowUp className="w-10 h-10 text-brand-yellow drop-shadow-lg" />
    </button>
  );
}
