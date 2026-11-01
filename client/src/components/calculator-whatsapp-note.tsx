import { MessageCircle } from "lucide-react";

export default function CalculatorWhatsAppNote({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-left ${className}`}>
      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-white">Também pode continuar pelo WhatsApp</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-300">
          Configure o seu pedido na app e veja o preço. Depois, escolha: pagar online
          ou continuar connosco pelo WhatsApp antes de pagar.
        </p>
      </div>
    </aside>
  );
}
