import ScrollToTop from "@/components/scroll-to-top";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Trash2, Sparkles, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";

// Use unified CartItem from schema that supports both types
interface CartItem {
  id: string;
  type: 'papel-parede' | 'quadros-canvas';
  // Wallpaper properties
  textureName?: string;
  textureImage?: string;
  category?: string;
  preco?: number;
  acabamento?: 'brilho' | 'mate';
  laminacao?: boolean;
  tipoCola?: 'com-cola' | 'sem-cola';
  // Canvas properties  
  canvasName?: string;
  canvasImage?: string;
  tamanho?: string;
  // Common properties
  largura?: number;
  altura?: number;
  larguraCm?: number;
  alturaCm?: number;
  area?: number;
  precoBase?: number;
  precoTotal: number;
  quantity?: number;
  quantidade?: number;
}

export default function Carrinho() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      // Add default values if not exists
      const itemsWithDefaults = items.map((item: CartItem) => ({
        ...item,
        quantidade: item.quantidade || 1,
        largura: item.largura || 0,
        altura: item.altura || 0,
        larguraCm: item.larguraCm || 0,
        alturaCm: item.alturaCm || 0,
        area: item.area || Math.max(0.01, (item.largura || 0) * (item.altura || 0)),
        tipoCola: item.tipoCola || 'com-cola'
      }));
      setCartItems(itemsWithDefaults);
    }
    setIsLoading(false);
  }, []);

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        
        // Calculate area if largura or altura changed
        if ('largura' in updates || 'altura' in updates || 'larguraCm' in updates || 'alturaCm' in updates) {
          const largura = updatedItem.largura || 0;
          const altura = updatedItem.altura || 0;
          updatedItem.area = Math.max(0.01, largura * altura);
        }
        
        // Recalculate total price based on area
        const area = updatedItem.area || 0.01;
        const basePrice = (updatedItem.preco || 0) * area;
        const laminacaoPrice = updatedItem.laminacao ? 8 * area : 0;
        updatedItem.precoTotal = basePrice + laminacaoPrice;
        
        return updatedItem;
      }
      return item;
    });
    updateCartInStorage(updatedItems);
  };

  const updateQuantity = (id: string, quantidade: number) => {
    if (quantidade < 1) return;
    updateItem(id, { quantidade });
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    updateCartInStorage(updatedItems);
    toast({
      title: "Item removido",
      description: "Produto removido do carrinho.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do carrinho.",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.precoTotal * (item.quantidade || 1));
    }, 0);
  };

  const calculateTotalWithShippingAndIVA = () => {
    const subtotal = calculateTotal();
    const shipping = subtotal >= 100 ? 0 : 15;
    const subtotalWithShipping = subtotal + shipping;
    const iva = subtotalWithShipping * 0.23; // 23% IVA
    return {
      subtotal,
      shipping,
      iva,
      total: subtotalWithShipping + iva
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="mt-4 text-brand-yellow">A carregar carrinho...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/loja">
              <Button variant="outline" size="sm" className="gap-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                <ArrowLeft className="h-4 w-4" />
                Continuar a Comprar
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-brand-yellow mb-4">
            Carrinho de <span className="text-[#FFD700]">Compras</span>
          </h1>
          <p className="text-brand-yellow text-lg">
            Personalize os seus produtos e finalize a compra
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              O seu carrinho está vazio
            </h2>
            <p className="text-gray-500 mb-8">
              Adicione algumas texturas fantásticas ao seu carrinho!
            </p>
            <Link href="/loja/papel-parede">
              <Button className="bg-brand-yellow text-black font-bold">
                Ver Texturas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#FFD700]">
                  Produtos no Carrinho ({cartItems.length})
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Limpar Carrinho
                </Button>
              </div>

              {cartItems.map((item) => (
                <Card key={item.id} className="bg-[#111111] border-[#333]">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      {/* Product Image */}
                      <div className="md:col-span-1">
                        <img
                          src={item.type === 'papel-parede' ? item.textureImage : item.canvasImage}
                          alt={item.type === 'papel-parede' ? item.textureName : item.canvasName}
                          className="w-full aspect-square object-cover rounded-lg border border-[#333]"
                        />
                      </div>

                      {/* Product Info & Customization */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#FFD700] mb-2">
                            {item.type === 'papel-parede' ? item.textureName : item.canvasName}
                          </h3>
                          <Badge className="bg-[#20B2AA] text-black">
                            {item.type === 'papel-parede' ? 'PAPEL DE PAREDE' : 'QUADROS EM CANVAS'}
                          </Badge>
                        </div>

                        {/* Customization Options */}
                        <div className="space-y-4">
                          {/* Paper wallpaper options */}
                          {item.type === 'papel-parede' && (
                            <>
                              {/* Acabamento */}
                              <div>
                                <label className="block text-sm font-medium text-brand-yellow mb-2">
                                  Acabamento
                                </label>
                                <Select 
                                  value={item.acabamento} 
                                  onValueChange={(value: 'brilho' | 'mate') => updateItem(item.id, { acabamento: value })}
                                >
                                  <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#111111] border-[#333]">
                                    <SelectItem value="brilho" className="text-white hover:bg-[#333]">
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Brilho
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="mate" className="text-white hover:bg-[#333]">
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                                        Mate
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Tipo de Cola */}
                              <div>
                                <label className="block text-sm font-medium text-brand-yellow mb-2">
                                  Tipo de Aplicação
                                </label>
                                <Select 
                                  value={item.tipoCola || 'com-cola'} 
                                  onValueChange={(value: 'com-cola' | 'sem-cola') => updateItem(item.id, { tipoCola: value })}
                                >
                                  <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#111111] border-[#333]">
                                    <SelectItem value="com-cola" className="text-white hover:bg-[#333]">
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-[#20B2AA] rounded-full"></div>
                                        Com Cola (Vinil autocolante)
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="sem-cola" className="text-white hover:bg-[#333]">
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-[#FFD700] rounded-full"></div>
                                        Sem Cola (Cola comprada separadamente)
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-400 mt-1">
                                  <a href="/como-aplicar-papel-parede" className="text-[#FFD700] hover:text-[#20B2AA] underline">
                                    Download de manuais de aplicação
                                  </a>
                                </p>
                              </div>

                          {/* Informação sobre medidas mínimas */}
                          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <h4 className="text-brand-yellow text-sm font-semibold mb-2">📏 Medidas Mínimas:</h4>
                            <div className="text-xs text-blue-200">
                              <p>• Largura mínima: <strong>100cm</strong></p>
                              <p>• Altura mínima: <strong>100cm</strong></p>
                            </div>
                          </div>

                          {/* Medidas */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-brand-yellow mb-2">
                                Largura (cm) - Min: 100cm
                              </label>
                              <input
                                type="text"
                                placeholder="Min: 100cm"
                                value={item.larguraCm || ''}
                                required
                                onChange={(e) => {
                                  const value = e.target.value.replace(',', '.');
                                  const numericValue = parseFloat(value);
                                  if (!isNaN(numericValue) && numericValue > 0) {
                                    const larguraM = numericValue / 100;
                                    updateItem(item.id, { larguraCm: numericValue, largura: larguraM });
                                  } else if (value === '') {
                                    updateItem(item.id, { larguraCm: 0, largura: 0 });
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value.replace(',', '.'));
                                  if (!isNaN(value) && value < 100 && value > 0) {
                                    // Força o mínimo se o valor for menor
                                    updateItem(item.id, { larguraCm: 100, largura: 1 });
                                    e.target.value = '100';
                                    toast({
                                      title: "Medida ajustada",
                                      description: "Largura mínima é 100cm. Valor ajustado automaticamente.",
                                    });
                                  }
                                }}
                                className={`w-full px-3 py-2 bg-[#0a0a0a] border rounded text-white text-sm focus:border-[#FFD700] focus:outline-none ${
                                  !item.larguraCm || item.larguraCm < 100 ? 'border-red-500' : 'border-[#333]'
                                }`}
                              />
                              {(!item.larguraCm || item.larguraCm < 100) && (
                                <p className="text-red-400 text-xs mt-1">
                                  {!item.larguraCm ? 'Campo obrigatório' : 'Mínimo 100cm'}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-brand-yellow mb-2">
                                Altura (cm) - Min: 100cm
                              </label>
                              <input
                                type="text"
                                placeholder="Min: 100cm"
                                value={item.alturaCm || ''}
                                required
                                onChange={(e) => {
                                  const value = e.target.value.replace(',', '.');
                                  const numericValue = parseFloat(value);
                                  if (!isNaN(numericValue) && numericValue > 0) {
                                    const alturaM = numericValue / 100;
                                    updateItem(item.id, { alturaCm: numericValue, altura: alturaM });
                                  } else if (value === '') {
                                    updateItem(item.id, { alturaCm: 0, altura: 0 });
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = parseFloat(e.target.value.replace(',', '.'));
                                  if (!isNaN(value) && value < 100 && value > 0) {
                                    // Força o mínimo se o valor for menor
                                    updateItem(item.id, { alturaCm: 100, altura: 1 });
                                    e.target.value = '100';
                                    toast({
                                      title: "Medida ajustada",
                                      description: "Altura mínima é 100cm. Valor ajustado automaticamente.",
                                    });
                                  }
                                }}
                                className={`w-full px-3 py-2 bg-[#0a0a0a] border rounded text-white text-sm focus:border-[#FFD700] focus:outline-none ${
                                  !item.alturaCm || item.alturaCm < 100 ? 'border-red-500' : 'border-[#333]'
                                }`}
                              />
                              {(!item.alturaCm || item.alturaCm < 100) && (
                                <p className="text-red-400 text-xs mt-1">
                                  {!item.alturaCm ? 'Campo obrigatório' : 'Mínimo 100cm'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Área Calculada */}
                          <div className="p-3 bg-[#0a0a0a] rounded border border-[#333]">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Área total:</span>
                              <span className="text-lg font-bold text-[#FFD700]">
                                {((item.largura || 0) * (item.altura || 0)).toFixed(2)} m²
                              </span>
                            </div>
                          </div>

                          {/* Laminação */}
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`laminacao-${item.id}`}
                              checked={item.laminacao}
                              onChange={(e) => updateItem(item.id, { laminacao: e.target.checked })}
                              className="rounded border-[#333] bg-[#0a0a0a] text-[#FFD700] focus:ring-[#FFD700]"
                            />
                            <label htmlFor={`laminacao-${item.id}`} className="text-sm text-gray-300">
                              Laminação (+€8/m²) - Proteção contra riscos e raios UV
                            </label>
                            <Sparkles className="h-4 w-4 text-[#FFD700]" />
                          </div>

                            </>
                          )}

                          {/* Quantity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Quantidade
                            </label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, (item.quantidade || 1) - 1)}
                                disabled={(item.quantidade || 1) <= 1}
                                className="border-[#333] text-white hover:bg-[#333]"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantidade || 1}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, (item.quantidade || 1) + 1)}
                                className="border-[#333] text-white hover:bg-[#333]"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="md:col-span-1 text-right space-y-4">
                        <div>
                          <p className="text-sm text-brand-yellow">Preço por m²:</p>
                          <p className="text-md font-semibold text-white">€{item.preco}/m²</p>
                          {item.laminacao && (
                            <p className="text-xs text-gray-400">+ €8/m² laminação</p>
                          )}
                          <div className="mt-2 pt-2 border-t border-[#333]">
                            <p className="text-sm text-brand-yellow">Total área ({((item.largura || 0) * (item.altura || 0)).toFixed(2)} m²):</p>
                            <p className="text-lg font-semibold text-[#FFD700]">€{item.precoTotal.toFixed(2)}</p>
                            <p className="text-sm text-gray-400">
                              Final: €{(item.precoTotal * (item.quantidade || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-[#111111] border-[#333] sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-6">
                    Resumo do Pedido
                  </h3>

                  {/* Order Details */}
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-brand-yellow">
                          {(item.textureName || item.canvasName || 'Produto')?.substring(0, 25)}... x{item.quantidade || 1}
                        </span>
                        <span className="text-white font-semibold">
                          €{(item.precoTotal * (item.quantidade || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-[#333] my-4" />

                  {/* Breakdown of costs */}
                  <div className="space-y-2 mb-4">
                    {(() => {
                      const totals = calculateTotalWithShippingAndIVA();
                      return (
                        <>
                          {/* Subtotal */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Subtotal:</span>
                            <span className="text-white">€{totals.subtotal.toFixed(2)}</span>
                          </div>
                          
                          {/* Shipping */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Portes de envio:</span>
                            <span className="text-white">
                              {totals.shipping === 0 ? (
                                <span className="text-green-400">Grátis</span>
                              ) : (
                                `€${totals.shipping.toFixed(2)}`
                              )}
                            </span>
                          </div>
                          
                          {/* IVA */}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">IVA (23%):</span>
                            <span className="text-white">€{totals.iva.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Free shipping message */}
                  {calculateTotal() >= 100 && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
                      <p className="text-green-400 text-sm text-center">
                        🚚 Portes grátis! Compra acima de €100
                      </p>
                    </div>
                  )}

                  {/* Show how much more needed for free shipping */}
                  {calculateTotal() < 100 && calculateTotal() > 0 && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <p className="text-blue-300 text-sm text-center">
                        💡 Adicione €{(100 - calculateTotal()).toFixed(2)} para portes grátis
                      </p>
                    </div>
                  )}

                  <hr className="border-[#333] my-4" />

                  {/* Total final */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#FFD700] font-bold text-lg">Total Final:</span>
                    <span className="text-[#FFD700] font-bold text-2xl">
                      €{calculateTotalWithShippingAndIVA().total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    onClick={() => {
                      // Verificar se todos os itens têm medidas
                      const itemsSemMedidas = cartItems.filter(item => 
                        !item.larguraCm || !item.alturaCm || item.larguraCm === 0 || item.alturaCm === 0
                      );
                      
                      if (itemsSemMedidas.length > 0) {
                        toast({
                          title: "Medidas em falta",
                          description: "Por favor, complete as medidas de todos os produtos antes de finalizar.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      // Redirecionar para checkout
                      window.location.href = '/checkout';
                    }}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 hover:opacity-90 mb-4"
                    disabled={cartItems.length === 0}
                    data-testid="button-checkout"
                  >
                    Finalizar Compra - €{calculateTotalWithShippingAndIVA().total.toFixed(2)}
                  </Button>

                  {/* Installation Quote Button */}
                  <Button 
                    onClick={() => {
                      const element = document.querySelector('#orcamento-colocacao');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    variant="outline" 
                    className="w-full border-[#20B2AA] text-[#20B2AA] hover:bg-[#20B2AA] hover:text-black mb-3"
                  >
                    Solicitar Orçamento de Aplicação
                  </Button>

                  {/* Continue Shopping */}
                  <Link href="/loja/papel-parede">
                    <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                      Continuar a Comprar
                    </Button>
                  </Link>

                  {/* Info */}
                  <div className="mt-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#333]">
                    <h4 className="text-sm font-semibold text-[#FFD700] mb-2">Informações:</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Produtos personalizados</li>
                      <li>• Sem trocas ou devoluções</li>
                      <li>• Prazo: 5-7 dias úteis</li>
                      <li>• Aplicação profissional disponível</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Installation Request Form */}
      <div id="orcamento-colocacao" className="bg-[#111111] border-t border-[#333]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#FFD700] mb-6 text-center">
              Solicitar Orçamento para Colocação
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Preencha o formulário abaixo e entraremos em contacto para agendar uma avaliação gratuita e fornecer um orçamento personalizado para a instalação.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#333]">
                <h3 className="text-xl font-bold text-[#FFD700] mb-4">Dados de Contacto</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="O seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="O seu número de telefone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="O seu email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localização *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="Cidade/Distrito onde será a instalação"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Área Total (m²)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="Ex: 25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Observações
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#333] rounded text-white focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                      placeholder="Informações adicionais sobre o projeto"
                    ></textarea>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#20B2AA] text-black font-bold py-3 hover:opacity-90"
                  >
                    Solicitar Orçamento
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#333]">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-4">Como Funciona</h3>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-[#FFD700] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                      <span>Preencha o formulário com os seus dados</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-[#FFD700] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                      <span>Entraremos em contacto em 24h</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-[#FFD700] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                      <span>Agendamos uma avaliação gratuita</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-[#FFD700] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                      <span>Fornecemos orçamento detalhado</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#333]">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-4">Contacto Direto</h3>
                  <div className="space-y-3 text-gray-300">
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/351917570649" className="text-[#FFD700] hover:text-[#20B2AA]">+351 917 570 649</a></p>
                    <p><strong>Email:</strong> <a href="mailto:geral@domrealce.com" className="text-[#FFD700] hover:text-[#20B2AA]">geral@domrealce.com</a></p>
                    <p className="text-sm text-gray-400 mt-4">
                      💡 Para um orçamento mais rápido, pode contactar-nos diretamente via WhatsApp com as fotos do espaço e medidas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}