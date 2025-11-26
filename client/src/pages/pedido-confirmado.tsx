import ScrollToTop from "@/components/scroll-to-top";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { CheckCircle, Package, Mail, Phone, Home } from "lucide-react";
import { Link } from "wouter";

export default function PedidoConfirmado() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="bg-[#111111] border-[#333] text-center mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-[#FFD700] mb-2">
                  Pedido Confirmado!
                </h1>
                <p className="text-gray-300">
                  O seu pedido foi processado com sucesso. Receberá um email de confirmação em breve.
                </p>
              </div>
              
              <div className="bg-[#0a0a0a] p-6 rounded-lg border border-[#333] mb-6">
                <h2 className="text-xl font-semibold text-[#FFD700] mb-4">
                  Próximos Passos
                </h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#20B2AA] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Email de Confirmação</h3>
                      <p className="text-sm text-gray-300">
                        Receberá um email com todos os detalhes do seu pedido e instruções de pagamento (se aplicável).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-[#20B2AA] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Produção</h3>
                      <p className="text-sm text-gray-300">
                        O seu papel de parede será produzido com alta qualidade e atenção aos detalhes. Tempo estimado: 3-5 dias úteis.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#20B2AA] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white">Contacto para Entrega</h3>
                      <p className="text-sm text-gray-300">
                        A nossa equipa entrará em contacto consigo para agendar a entrega ou recolha.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/loja/papel-parede">
                    <Button className="bg-brand-yellow text-black font-bold">
                      Continuar a Comprar
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="border-[#333] text-white hover:bg-[#333]">
                      <Home className="h-4 w-4 mr-2" />
                      Voltar ao Início
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-gray-400">
                  Dúvidas? Entre em contacto connosco através do WhatsApp: 
                  <a href="https://wa.me/351930682725" className="text-[#FFD700] hover:text-[#20B2AA] ml-1">
                    +351 930 682 725
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-[#111111] border-[#333]">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#FFD700] mb-4">
                Informações Importantes
              </h2>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Todos os produtos DOMREALCE incluem garantia de qualidade</li>
                <li>• Oferecemos suporte técnico para aplicação do papel de parede</li>
                <li>• Envio grátis para Portugal Continental em compras acima de €100</li>
                <li>• Possibilidade de instalação profissional (contacte-nos para orçamento)</li>
                <li>• Prazo de entrega: 3-7 dias úteis após confirmação do pagamento</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}