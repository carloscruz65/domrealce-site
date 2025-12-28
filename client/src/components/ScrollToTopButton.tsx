import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        // ✅ posição: alinhada ao nível do WhatsApp
        "fixed left-1/2 -translate-x-1/2 bottom-6 z-50",

        // ✅ círculo branco + seta preta
        "w-11 h-11 rounded-full bg-white text-black",

        // ✅ destaque e “toque premium”
        "shadow-xl ring-1 ring-black/10",
        "hover:bg-gray-100 active:scale-95 transition",
        "flex items-center justify-center",

        // ✅ acessibilidade
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow/40",
      ].join(" ")}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
