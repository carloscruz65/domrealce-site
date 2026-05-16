export const trackWhatsAppConversion = (url: string) => {
  if (window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-11438840519/lTnXCKFU34scEMe1u84q",
      event_callback: () => {
        window.open(url, "_blank");
      },
    });
  } else {
    window.open(url, "_blank");
  }
};