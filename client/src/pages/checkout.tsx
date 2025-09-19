import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  textureName: string;
  textureImage: string;
  category: string;
  preco: number;
  acabamento: "brilho" | "mate";
  laminacao: boolean;
  tipoCola?: "com-cola" | "sem-cola";
  largura?: number;
  altura?: number;
  larguraCm?: number;
  alturaCm?: number;
  area?: number;
  precoTotal: number;
  quantidade?: number;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dados do cliente
  const [customerData, setCustomerData] = useState({
    nome: "",
    email: "",
    telefone: "",
    morada: "",
    codigoPostal: "",
    cidade: "",
    nif: "",
  });

  // Dados de pagamento
  const [paymentData, setPaymentData] = useState({
    metodoPagamento: "mbway", // MB WAY como padrão (mais popular)
  });

  useEffect(() => {
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);

      // Verificar se há itens sem medidas
      const itemsSemMedidas = items.filter(
        (item: CartItem) =>
          !item.larguraCm ||
          !item.alturaCm ||
          item.larguraCm === 0 ||
          item.alturaCm === 0,
      );

      if (itemsSemMedidas.length > 0) {
        toast({
          title: "Medidas em falta",
          description:
            "Por favor, complete as medidas no carrinho antes de finalizar.",
          variant: "destructive",
        });
        setLocation("/carrinho");
        return;
      }

      setCartItems(items);
    } else {
      setLocation("/carrinho");
    }
  }, []);

  const totalCarrinho = cartItems.reduce(
    (total, item) => total + item.precoTotal * (item.quantidade || 1),
    0,
  );

  const custoEnvio = totalCarrinho > 100 ? 0 : 15;
  const ivaRate = 0.23; // 23% IVA em Portugal
  const totalSemIva = totalCarrinho + custoEnvio;
  const valorIva = totalSemIva * ivaRate;
  const totalFinal = totalSemIva + valorIva;

  const handleFinalizarPedido = async () => {
    // Validar dados obrigatórios
    if (
      !customerData.nome ||
      !customerData.email ||
      !customerData.telefone ||
      !customerData.morada ||
      !customerData.codigoPostal ||
      !customerData.cidade
    ) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação do método de pagamento
    if (!paymentData.metodoPagamento) {
      toast({
        title: "Método de pagamento não selecionado",
        description: "Por favor, escolha um método de pagamento.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `DP${Date.now()}`;
      // Melhor geração de número para evitar conflitos
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
      const numeroEncomenda = `EN-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}-${randomSuffix}`;

      // Criar encomenda na base de dados primeiro
      const orderData = {
        numeroEncomenda,
        clienteNome: customerData.nome,
        clienteEmail: customerData.email,
        clienteTelefone: customerData.telefone,
        clienteMorada: customerData.morada,
        clienteCodigoPostal: customerData.codigoPostal,
        clienteCidade: customerData.cidade,
        clienteNIF: customerData.nif || null,
        itens: cartItems,
        subtotal: totalCarrinho.toString(),
        envio: custoEnvio.toString(),
        iva: valorIva.toString(),
        total: totalFinal.toString(),
        metodoPagamento: getPaymentMethod(),
        estado: "pendente",
        estadoPagamento: "pendente"
      };

      console.log("🛒 Criando encomenda:", orderData);

      // Criar encomenda
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();
      console.log("📦 Encomenda criada:", orderResult);

      if (!orderResult.success) {
        throw new Error("Erro ao criar encomenda");
      }

      // Preparar dados para o pagamento
      const paymentRequest = {
        method: getPaymentMethod(),
        orderId: orderResult.order.id, // Usar o ID da encomenda
        amount: totalFinal,
        customerData: {
          email: customerData.email,
          phone: customerData.telefone,
        },
        returnUrls: {
          success: `${window.location.origin}/pedido-confirmado?numeroEncomenda=${numeroEncomenda}`,
          error: `${window.location.origin}/checkout`,
          cancel: `${window.location.origin}/checkout`,
        },
      };

      // Criar pagamento
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();
      console.log("💳 Payment API result:", result);

      if (!result.success) {
        throw new Error(result.message || "Erro ao processar pagamento");
      }

      // Atualizar encomenda com dados do pagamento
      if (result.data) {
        await fetch(`/api/admin/orders/${orderResult.order.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referenciaIfthenpay: result.data.requestId || result.data.reference,
            dadosPagamento: result.data
          }),
        });
      }

      // Processar resposta baseada no método de pagamento
      const method = getPaymentMethod();

      if (method === "mbway") {
        // Mostrar instruções MB WAY
        toast({
          title: "📱 MB WAY enviado!",
          description: "Confirme o pagamento no seu telemóvel.",
          duration: 6000,
        });

        // Monitorizar status do pagamento
        monitorMBWayPayment(result.data.requestId, numeroEncomenda, orderResult.order.id);
      } else {
        // Multibanco - mostrar referências
        showPaymentInstructions(method, result.data, numeroEncomenda, orderResult.order.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Erro no processamento",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethod = () => {
    switch (paymentData.metodoPagamento) {
      case "transferencia":
        return "multibanco";
      case "mbway":
        return "mbway";
      default:
        return "mbway"; // Padrão para MB WAY
    }
  };

  const monitorMBWayPayment = async (requestId: string, numeroEncomenda: string, orderId: string) => {
    const maxAttempts = 48; // 4 minutos (48 x 5 segundos)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch("/api/payments/mbway/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        });

        const result = await response.json();

        if (result.status === "000") {
          // Pagamento confirmado - atualizar estado da encomenda
          await fetch(`/api/admin/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              estado: "paga",
              estadoPagamento: "pago"
            }),
          });

          localStorage.removeItem("cart");
          toast({
            title: "Pagamento confirmado!",
            description: "O seu pedido foi processado com sucesso.",
          });
          setLocation(`/pedido-confirmado?numeroEncomenda=${numeroEncomenda}`);
        } else if (result.status === "101") {
          // Pagamento expirado
          await fetch(`/api/admin/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              estadoPagamento: "falhado"
            }),
          });
          
          toast({
            title: "Pagamento expirado",
            description: "O pagamento MB WAY expirou. Tente novamente.",
            variant: "destructive",
          });
        } else if (attempts < maxAttempts) {
          // Continuar a verificar
          setTimeout(checkStatus, 5000);
          attempts++;
        } else {
          // Timeout
          toast({
            title: "Timeout do pagamento",
            description:
              "Não foi possível confirmar o pagamento. Contacte-nos se já efectuou o pagamento.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkStatus();
  };

  const showPaymentInstructions = (
    method: string,
    data: any,
    numeroEncomenda: string,
    orderId: string,
  ) => {
    if (method === "multibanco") {
      toast({
        title: "✅ Referência Multibanco gerada",
        description: "Consulte os detalhes de pagamento abaixo.",
        duration: 5000,
      });
    }

    // Guardar dados do pedido temporariamente
    localStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        orderId,
        numeroEncomenda,
        method,
        data,
        amount: totalFinal,
        customerData,
      }),
    );

    // Redirecionar para página de instruções
    setLocation(`/instrucoes-pagamento?method=${method}&numeroEncomenda=${numeroEncomenda}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/carrinho">
            <Button
              variant="outline"
              size="sm"
              className="border-[#333] text-white hover:bg-[#333]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#FFD700]">
            <CreditCard className="inline-block w-8 h-8 mr-3" />
            Finalizar Compra
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de dados */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do cliente */}
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#FFD700]">
                  Dados de Facturação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-gray-300">
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome"
                      value={customerData.nome}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          nome: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#333] text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          email: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#333] text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone" className="text-gray-300">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      value={customerData.telefone}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          telefone: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#333] text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nif" className="text-gray-300">
                      NIF (opcional)
                    </Label>
                    <Input
                      id="nif"
                      value={customerData.nif}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          nif: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#333] text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="morada" className="text-gray-300">
                    Morada *
                  </Label>
                  <Input
                    id="morada"
                    value={customerData.morada}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        morada: e.target.value,
                      })
                    }
                    className="bg-[#0a0a0a] border-[#333] text-white"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigoPostal" className="text-gray-300">
                      Código Postal *
                    </Label>
                    <Input
                      id="codigoPostal"
                      value={customerData.codigoPostal}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          codigoPostal: e.target.value,
                        })
                      }
                      placeholder="0000-000"
                      className="bg-[#0a0a0a] border-[#333] text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade" className="text-gray-300">
                      Cidade *
                    </Label>
                    <Input
                      id="cidade"
                      value={customerData.cidade}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          cidade: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#333] text-white"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Método de pagamento */}
            <Card className="bg-[#111111] border-[#333]">
              <CardHeader>
                <CardTitle className="text-[#FFD700]">
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={paymentData.metodoPagamento}
                  onValueChange={(value) =>
                    setPaymentData({ ...paymentData, metodoPagamento: value })
                  }
                >
                  <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem
                      value="mbway"
                      className="text-white hover:bg-[#333]"
                    >
                      💚 MB WAY (Recomendado)
                    </SelectItem>
                    <SelectItem
                      value="transferencia"
                      className="text-white hover:bg-[#333]"
                    >
                      🏧 Multibanco
                    </SelectItem>
                  </SelectContent>
                </Select>

                {paymentData.metodoPagamento === "transferencia" && (
                  <div className="p-4 bg-[#0a0a0a] rounded border border-[#333]">
                    <p className="text-gray-300 text-sm">
                      Após confirmar o pedido, receberá os dados bancários por
                      email para efectuar a transferência.
                    </p>
                  </div>
                )}

                {paymentData.metodoPagamento === "mbway" && (
                  <div className="p-4 bg-[#0a0a0a] rounded border border-[#333]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-green-400 font-medium">
                        MB WAY - Pagamento Instantâneo
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Será enviado um pedido MB WAY para o número de telefone
                      indicado. Confirme no seu telemóvel para finalizar o
                      pagamento.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <Card className="bg-[#111111] border-[#333] sticky top-24">
              <CardHeader>
                <CardTitle className="text-[#FFD700] flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Itens do carrinho */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-[#0a0a0a] rounded border border-[#333]"
                    >
                      <img
                        src={item.textureImage}
                        alt={item.textureName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {item.textureName}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {item.larguraCm}×{item.alturaCm}cm ={" "}
                          {((item.largura || 0) * (item.altura || 0)).toFixed(
                            2,
                          )}
                          m²
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.acabamento} •{" "}
                          {item.tipoCola === "com-cola"
                            ? "Com cola"
                            : "Sem cola"}
                          {item.laminacao && " • Laminação"}
                        </p>
                        <p className="text-sm font-semibold text-[#FFD700]">
                          €
                          {(item.precoTotal * (item.quantidade || 1)).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-[#333]" />

                {/* Totais */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white">
                      €{totalCarrinho.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Envio:
                    </span>
                    <span className="text-white">
                      {custoEnvio === 0
                        ? "Grátis"
                        : `€${custoEnvio.toFixed(2)}`}
                    </span>
                  </div>
                  {custoEnvio === 0 && (
                    <p className="text-xs text-green-400">
                      Envio grátis para compras acima de €100
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">IVA (23%):</span>
                    <span className="text-white">€{valorIva.toFixed(2)}</span>
                  </div>

                  <Separator className="bg-[#333]" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#FFD700]">Total:</span>
                    <span className="text-[#FFD700]">
                      €{totalFinal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>Pagamento seguro e protegido</span>
                </div>

                {/* Botão finalizar */}
                <Button
                  onClick={handleFinalizarPedido}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 hover:opacity-90 disabled:opacity-50"
                >
                  {isProcessing
                    ? "A processar..."
                    : `Finalizar Pedido - €${totalFinal.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
