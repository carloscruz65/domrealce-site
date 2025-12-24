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
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full bg-brand-yellow text-black shadow-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center"
      data-testid="button-scroll-to-top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
