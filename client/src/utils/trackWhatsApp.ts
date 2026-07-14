declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara conversão Google Ads e abre o WhatsApp imediatamente.
 * Não usa event_callback — a abertura não espera pela resposta do Google.
 */
export const trackWhatsAppConversion = (url: string): void => {
  window.gtag?.("event", "conversion", {
    send_to: "AW-11438840519/lTnxCKfU34scEMe1u84q",
  });
  window.open(url, "_blank", "noopener,noreferrer");
};
