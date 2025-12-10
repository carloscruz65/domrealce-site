import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo-head";

export default function Obrigado() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <SEOHead
        title="Encomenda recebida"
        description="Obrigado pela sua encomenda na DOMREALCE. Em breve entraremos em contacto para confirmar todos os detalhes."
        canonicalUrl="https://www.domrealce.com/obrigado"
      />

      <div className="max-w-lg w-full border border-white/10 rounded-2xl bg-black/70 p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-brand-turquoise">
          Encomenda recebida. Obrigado!
        </h1>

        <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
          O seu pagamento foi processado com sucesso e a sua encomenda foi registada.
          Em breve entraremos em contacto para confirmar todos os detalhes ou
          pedir informações adicionais, se necessário.
        </p>

        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Se tiver alguma dúvida, pode contactar-nos através do formulário de
          contactos, telefone ou WhatsApp disponíveis no site.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-brand-yellow text-black font-bold">
            <Link href="/portfolio">Ver alguns dos nossos trabalhos</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-brand-yellow text-brand-yellow"
          >
            <Link href="/">Voltar à página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
