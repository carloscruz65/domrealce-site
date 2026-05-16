import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppFAB() {
  const whatsappUrl =
    "https://wa.me/351930682725?text=Olá!%20Quero%20um%20orçamento%20DOMREALCE";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // ⛔ trava abertura imediata

    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-11438840519/lTnXCKFU34scEMe1u84q",
        event_callback: () => {
          window.open(whatsappUrl, "_blank"); // 👉 abre depois de enviar
        },
      });
    } else {
      // fallback caso gtag não esteja carregado
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6 group"
      aria-label="Fale connosco no WhatsApp"
      data-testid="whatsapp-fab"
    >
      {/* Texto tranquilizador */}
      <div
        className="
          absolute right-0 -top-14
          text-right
          text-sm leading-tight
          text-gray-300
          whitespace-nowrap
          pointer-events-none
        "
      >
        Pode falar connosco
        <br />
        <span className="text-brand-yellow font-semibold">
          sem compromisso
        </span>
      </div>

      <Button
        size="icon"
        className="
          w-12 h-12 rounded-full
          bg-[#25D366] hover:bg-[#1EBE5A]
          text-white shadow-lg hover:shadow-xl
          transition-transform duration-200 ease-out
          hover:scale-105 active:scale-95
          ring-2 ring-[#25D366]/35 hover:ring-[#25D366]/55
          focus:outline-none focus:ring-4 focus:ring-[#25D366]/30
        "
      >
        <MessageCircle size={30} />
        <span className="sr-only">WhatsApp</span>
      </Button>

      {/* Tooltip */}
      <div
        className="
          hidden md:block
          absolute right-14 bottom-1
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-200 ease-out
          pointer-events-none
          bg-gray-900 text-white text-sm
          px-3 py-2 rounded-lg shadow-lg
          whitespace-nowrap
          before:content-[''] before:absolute before:left-[-6px] before:top-1/2
          before:-translate-y-1/2 before:border-t-[6px]
          before:border-b-[6px] before:border-r-[6px]
          before:border-transparent before:border-r-gray-900
        "
      >
        WhatsApp direto
      </div>
    </a>
  );
}