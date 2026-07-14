import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";
import { useEffect } from "react";

export default function ObrigadoOrcamento() {

  useEffect(() => {
    let cancelled = false;

    const fireConversion = (retries: number) => {
      if (cancelled) return;

      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: "AW-11438840519/lTnxCKfU34scEMe1u84q",
        });
      } else if (retries > 0) {
        setTimeout(() => fireConversion(retries - 1), 300);
      }
    };

    fireConversion(15);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <SEOHead
        title="Pedido enviado com sucesso"
        description="Obrigado pelo seu pedido de orçamento. Entraremos em contacto brevemente."
        canonicalUrl="https://www.domrealce.com/obrigado-orcamento"
      />

      <div className="max-w-lg w-full border border-white/10 rounded-2xl bg-black/70 p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-brand-turquoise">
          Pedido enviado com sucesso!
        </h1>

        <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
          Recebemos o seu pedido de orçamento e entraremos em contacto brevemente.
        </p>

        <p className="text-xs text-gray-400 mb-6">
          Se precisar de falar connosco com urgência, pode usar o WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand-yellow text-black font-bold">
            <Link href="/portfolio">Ver trabalhos</Link>
          </Button>

          <Button asChild variant="outline" className="border-brand-yellow text-brand-yellow">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
