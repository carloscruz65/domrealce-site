import { useEffect } from "react";
import { useLocation } from "wouter";

function findScrollableContainer(): HTMLElement | null {
  // Procura um container comum com scroll interno (caso exista)
  const candidates = Array.from(document.querySelectorAll<HTMLElement>("main, #root, body > div, [data-scroll-container]"));
  for (const el of candidates) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const canScroll = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 5;
    if (canScroll) return el;
  }
  return null;
}

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;

    const forceTop = () => {
      // Scroll normal (janela)
      window.scrollTo(0, 0);

      // Fallbacks (mobile/browser differences)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Se a app estiver a fazer scroll num container, força também
      const scroller = findScrollableContainer();
      if (scroller) scroller.scrollTop = 0;
    };

    const scrollToHashWhenReady = () => {
      const headerOffset = 100;
      let attempts = 0;
      const maxAttempts = 90; // ~1.5s (requestAnimationFrame)

      const tryScroll = () => {
        attempts += 1;
        const el = document.querySelector(hash);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

          // usa "auto" para não ser interrompido em mobile
          window.scrollTo({ top: y, left: 0, behavior: "auto" });

          // também tenta no container, se existir
          const scroller = findScrollableContainer();
          if (scroller) {
            const rect = el.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            const delta = rect.top - scrollerRect.top - headerOffset;
            scroller.scrollTop = scroller.scrollTop + delta;
          }
          return;
        }

        if (attempts < maxAttempts) {
          requestAnimationFrame(tryScroll);
        }
      };

      tryScroll();
    };

    // Se houver hash, scroll para o alvo. Se não, topo.
    if (hash) {
      // Faz um topo primeiro para evitar posições estranhas e depois procura o elemento
      forceTop();
      requestAnimationFrame(scrollToHashWhenReady);
      return;
    }

    // Sem hash: força topo e repete em 2 frames (mobile/lazy)
    forceTop();
    requestAnimationFrame(() => {
      forceTop();
      requestAnimationFrame(forceTop);
    });
  }, [location]);
}
