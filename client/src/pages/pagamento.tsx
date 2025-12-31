import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  CheckCircle,
  Clock,
  CreditCard,
  CheckSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo, useState } from "react";

export default function InstrucoesPagamento() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<any>(null);
  const [confirmationData, setConfirmationData] = useState({
    entity: "",
    reference: "",
    amount: "",
  });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Recuperar dados do pedido
    const pendingOrder = localStorage.getItem("pendingOrder");
    if (pendingOrder) {
      setOrderData(JSON.parse(pendingOrder));
    }
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const method = urlParams.get("method");
  const orderId = urlParams.get("orderId");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const validatePayment = async () => {
    if (!orderData) return;

    setIsValidating(true);

    try {
      const expectedEntity = orderData.data.entity;
      const expectedReference = orderData.data.reference;
      const expectedAmount = orderData.amount.toFixed(2);

      const inputEntity = confirmationData.entity.trim();
      const inputReference = confirmationData.reference.trim();
      const inputAmount = parseFloat(
        confirmationData.amount.replace(",", "."),
      ).toFixed(2);

      if (inputEntity !== expectedEntity) {
        toast({
          title: "❌ Entidade incorreta",
          description: `A entidade deve ser: ${expectedEntity}`,
          variant: "destructive",
        });
        return;
      }

      if (inputReference !== expectedReference) {
        toast({
          title: "❌ Referência incorreta",
          description: `A referência deve ser: ${expectedReference}`,
          variant: "destructive",
        });
        return;
      }

      if (inputAmount !== expectedAmount) {
        toast({
          title: "❌ Valor incorreto",
          description: `O valor deve ser: €${expectedAmount}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "✅ Dados confirmados!",
        description:
          "Os dados estão corretos. Proceda com o pagamento no Multibanco/ATM.",
      });

      setTimeout(() => {
        localStorage.removeItem("pendingOrder");
        setLocation("/pedido-confirmado?confirmed=true");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const paymentInfo = useMemo(() => {
    if (!orderData) return null;

    const entity = orderData?.data?.entity ?? "";
    const reference = orderData?.data?.reference ?? "";
    const amountNumber = Number(orderData?.amount ?? 0);

    return {
      entity,
      reference,
      amountNumber,
      amountText: Number.isFinite(amountNumber)
        ? formatCurrency(amountNumber)
        : String(orderData?.amount ?? ""),
    };
  }, [orderData]);

  if (!orderData || !method) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[#111111] border-[#333]">
          <CardContent className="pt-6">
            <p className="text-center text-gray-300">
              Dados do pagamento não encontrados.
            </p>
            <Button
              onClick={() => setLocation("/checkout")}
              className="w-full mt-4 bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold"
            >
              Voltar ao Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Top */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-full mb-4">
            <Clock className="w-7 h-7 text-[#FFD700]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[#FFD700]">Pagamento</span> Pendente
          </h1>
          <p className="text-gray-400">
            Siga as instruções abaixo para completar o seu pagamento
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Resumo do Pedido */}
          <Card className="bg-[#111111] border-[#333]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#FFD700]">
                <CheckCircle className="w-5 h-5 text-[#FFD700]" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-gray-200">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Número do Pedido:</span>
                <span className="font-mono font-semibold">{orderId}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Valor Total:</span>
                <span className="font-black text-xl text-[#FFD700]">
                  {formatCurrency(orderData.amount)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Método de Pagamento:</span>
                <span className="font-semibold">Multibanco</span>
              </div>

              <div className="pt-4 border-t border-[#222]">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-gray-200">Cliente:</strong>{" "}
                  {orderData.customerData.nome}
                  <br />
                  <strong className="text-gray-200">Email:</strong>{" "}
                  {orderData.customerData.email}
                  <br />
                  <strong className="text-gray-200">Telefone:</strong>{" "}
                  {orderData.customerData.telefone}
                </p>
              </div>

              {/* Validação manual (mantida, mas com look DOMREALCE) */}
              <div className="mt-4 rounded-xl border border-[#333] bg-[#0a0a0a] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-4 h-4 text-[#20B2AA]" />
                  <p className="text-sm font-semibold text-gray-200">
                    Confirmar dados (opcional)
                  </p>
                </div>

                <div className="grid gap-3">
                  <div>
                    <Label className="text-xs text-gray-400">Entidade</Label>
                    <Input
                      value={confirmationData.entity}
                      onChange={(e) =>
                        setConfirmationData((p) => ({
                          ...p,
                          entity: e.target.value,
                        }))
                      }
                      className="mt-1 bg-[#111111] border-[#333] text-white focus:border-[#FFD700]"
                      placeholder="Ex: 12537"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-400">Referência</Label>
                    <Input
                      value={confirmationData.reference}
                      onChange={(e) =>
                        setConfirmationData((p) => ({
                          ...p,
                          reference: e.target.value,
                        }))
                      }
                      className="mt-1 bg-[#111111] border-[#333] text-white focus:border-[#FFD700]"
                      placeholder="Ex: 442837191"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-400">Valor</Label>
                    <Input
                      value={confirmationData.amount}
                      onChange={(e) =>
                        setConfirmationData((p) => ({
                          ...p,
                          amount: e.target.value,
                        }))
                      }
                      className="mt-1 bg-[#111111] border-[#333] text-white focus:border-[#FFD700]"
                      placeholder="Ex: 34,44"
                    />
                  </div>

                  <Button
                    onClick={validatePayment}
                    disabled={isValidating}
                    className="mt-2 bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold"
                  >
                    {isValidating ? "A validar..." : "Validar dados"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções de Pagamento (Compacto + DOMREALCE) */}
          {method === "multibanco" && paymentInfo && (
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#FFD700]">
                  <CreditCard className="w-5 h-5 text-[#FFD700]" />
                  Pagamento Multibanco
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Use os dados abaixo em qualquer ATM, homebanking ou app bancária
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Estado + copiar tudo */}
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-1 text-xs font-semibold text-[#FFD700]">
                    Pendente de pagamento
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#333] text-gray-200 hover:bg-[#1a1a1a]"
                    onClick={() => {
                      const all = `Entidade: ${paymentInfo.entity} | Referência: ${paymentInfo.reference} | Valor: ${paymentInfo.amountText}`;
                      copyToClipboard(all, "Dados de pagamento");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar tudo
                  </Button>
                </div>

                {/* Bloco 3 linhas */}
                <div className="rounded-xl border border-[#333] bg-[#0a0a0a] overflow-hidden">
                  {/* Entidade */}
                  <div className="flex justify-between items-center px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Entidade
                      </p>
                      <p className="text-2xl font-mono font-black text-white mt-1">
                        {paymentInfo.entity}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#333] text-gray-200 hover:bg-[#1a1a1a]"
                      onClick={() =>
                        copyToClipboard(paymentInfo.entity, "Entidade")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-px bg-[#222]" />

                  {/* Referência */}
                  <div className="flex justify-between items-center px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Referência
                      </p>
                      <p className="text-2xl font-mono font-black text-white mt-1">
                        {paymentInfo.reference}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#333] text-gray-200 hover:bg-[#1a1a1a]"
                      onClick={() =>
                        copyToClipboard(paymentInfo.reference, "Referência")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="h-px bg-[#222]" />

                  {/* Valor */}
                  <div className="flex justify-between items-center px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Valor a pagar
                      </p>
                      <p className="text-2xl font-black text-[#FFD700] mt-1">
                        {paymentInfo.amountText}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#333] text-gray-200 hover:bg-[#1a1a1a]"
                      onClick={() =>
                        copyToClipboard(
                          paymentInfo.amountNumber.toFixed(2),
                          "Valor",
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Passos (compacto) */}
                <details className="rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3">
                  <summary className="cursor-pointer select-none text-sm font-semibold text-gray-200">
                    Como pagar (ver passos)
                  </summary>

                  <ol className="mt-3 space-y-1 text-sm text-gray-400 list-decimal pl-5">
                    <li>Aceda ao seu homebanking ou dirija-se ao ATM</li>
                    <li>Escolha “Pagamentos” ou “Pagar Serviços”</li>
                    <li>
                      Introduza a Entidade:{" "}
                      <span className="font-mono text-gray-200">
                        {paymentInfo.entity}
                      </span>
                    </li>
                    <li>
                      Introduza a Referência:{" "}
                      <span className="font-mono text-gray-200">
                        {paymentInfo.reference}
                      </span>
                    </li>
                    <li>
                      Confirme o valor:{" "}
                      <span className="font-semibold text-gray-200">
                        {paymentInfo.amountText}
                      </span>
                    </li>
                    <li>Confirme o pagamento</li>
                  </ol>
                </details>

                <p className="text-xs text-gray-500">
                  Após o pagamento, a confirmação pode demorar alguns minutos.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informações Importantes */}
        <Card className="mt-8 bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">Informações Importantes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-4">
                <h4 className="font-semibold text-gray-200 mb-2">
                  Após o Pagamento
                </h4>
                <p className="text-sm text-gray-400">
                  Receberá uma confirmação por email assim que o pagamento for
                  processado. O processamento pode demorar até 24 horas.
                </p>
              </div>

              <div className="rounded-xl border border-[#333] bg-[#0a0a0a] p-4">
                <h4 className="font-semibold text-gray-200 mb-2">Dúvidas?</h4>
                <p className="text-sm text-gray-400">
                  Se tiver alguma dúvida sobre o pagamento, contacte-nos através
                  do nosso formulário de contacto ou telefone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button
            variant="outline"
            className="border-[#333] text-white hover:bg-[#1a1a1a]"
            onClick={() => setLocation("/checkout")}
          >
            Voltar ao Checkout
          </Button>

          <Button
            className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold"
            onClick={() => setLocation("/pedido-confirmado?orderId=" + orderId)}
          >
            Já Paguei
          </Button>
        </div>
      </div>
    </div>
  );
}