declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara conversão Google Ads (com event_callback + event_timeout)
 * e abre o WhatsApp. Tem fallback de 2 s caso o callback não seja executado.
 * Garante que o WhatsApp só é aberto uma vez por clique.
 */
export const trackWhatsAppConversion = (url: string): void => {
  let opened = false;

  const go = () => {
    if (opened) return;
    opened = true;
    window.location.href = url;
  };

  setTimeout(go, 2000);

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-11438840519/lTnXCKfU34scEMe1u84q",
      event_callback: go,
      event_timeout: 2000,
    });
  } else {
    go();
  }
};
