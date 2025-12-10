import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";

export default function PagamentoErro() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <SEOHead
        title="Problema ao processar o pagamento"
        description="Ocorreu um problema ao processar o pagamento da sua encomenda na DOMREALCE. Pode tentar novamente ou contactar-nos para obter ajuda."
        canonicalUrl="https://www.domrealce.com/pagamento-erro"
      />

      <div className="max-w-lg w-full border border-red-500/30 rounded-2xl bg-black/75 p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-red-400">
          Não foi possível concluir o pagamento.
        </h1>

        <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
          Ocorreu um problema ao processar o pagamento da sua encomenda
          ou a operação foi cancelada antes de ser concluída.
        </p>

        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Não se preocupe: a encomenda só é considerada válida depois do
          pagamento ser confirmado. Pode tentar novamente ou, se preferir,
          falar connosco para o ajudarmos a finalizar o pedido.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand-yellow text-black font-bold">
            <Link href="/loja">Voltar à loja</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-brand-yellow text-brand-yellow"
          >
            <Link href="/contactos">Contactar a DOMREALCE</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
