import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Trash2, Plus, Minus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// ==========================
// CONFIG: mínimos de medidas
// ==========================
const MIN_LARGURA_CM = 100;
const MIN_ALTURA_CM = 100;

// Unified CartItem interface that supports both product types
interface CartItem {
  id: string;
  type: "papel-parede" | "quadros-canvas";

  // Wallpaper properties
  textureName?: string;
  textureImage?: string;
  category?: string;
  preco?: number;
  acabamento?: "brilho" | "mate";
  laminacao?: boolean;
  tipoCola?: "com-cola" | "sem-cola";

  // Canvas properties
  canvasName?: string;
  canvasImage?: string;
  tamanho?: string;

  // Common properties
  largura?: number; // metros
  altura?: number; // metros
  larguraCm?: number | null; // cm
  alturaCm?: number | null; // cm
  area?: number; // m2
  precoBase?: number;
  precoTotal: number;
  quantity?: number;
  quantidade?: number;

  // Material (obrigatório para papel-parede, começa null)
  material?: "papel" | "vinil" | null;
}

function toIntOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.floor(n);
}

function validateWallpaper(item: CartItem) {
  const missingMaterial = !item.material;

  const w = item.larguraCm ?? null;
  const h = item.alturaCm ?? null;

  const invalidWidth = w === null || w < MIN_LARGURA_CM;
  const invalidHeight = h === null || h < MIN_ALTURA_CM;

  return {
    missingMaterial,
    invalidWidth,
    invalidHeight,
    isValid: !missingMaterial && !invalidWidth && !invalidHeight,
  };
}

export default function Carrinho() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Começa SEM seleção sempre
  const [deliveryMethod, setDeliveryMethod] = useState<
    "delivery" | "pickup" | null
  >(null);

  useEffect(() => {
    // ✅ LIMPA valores antigos para nunca aparecer pré-selecionado (entrega)
    localStorage.removeItem("domrealce_delivery_method");

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const rawItems: CartItem[] = JSON.parse(savedCart);

      // ✅ Força MATERIAL sempre desselecionado no carrinho (papel-parede)
      // mesmo que viesse gravado do passado.
      const cleaned = rawItems.map((item) => {
        if (item.type !== "papel-parede") return item;

        return {
          ...item,
          material: null, // ✅ começa sempre sem seleção
          acabamento: undefined,
          laminacao: false,
        };
      });

      // Atualiza storage já limpo
      localStorage.setItem("cart", JSON.stringify(cleaned));

      // Aplica defaults seguros
      const itemsWithDefaults = cleaned.map((item) => {
        const quantidade = item.quantidade || item.quantity || 1;

        const largura = item.largura || 0;
        const altura = item.altura || 0;

        const larguraCm =
          typeof item.larguraCm === "number" && item.larguraCm > 0
            ? item.larguraCm
            : null;

        const alturaCm =
          typeof item.alturaCm === "number" && item.alturaCm > 0
            ? item.alturaCm
            : null;

        const area = Math.max(0.01, largura * altura);

        return {
          ...item,
          quantidade,
          largura,
          altura,
          larguraCm,
          alturaCm,
          area,
          tipoCola: item.tipoCola || "com-cola",

          // ✅ material já vem limpo (null) para papel-parede
          material: item.material ?? null,

          // Se material estiver null, mantém preço a 0 até escolher
          precoTotal:
            item.type === "papel-parede" && !item.material ? 0 : item.precoTotal,
        };
      });

      setCartItems(itemsWithDefaults);
    }

    setIsLoading(false);
  }, []);

  // ✅ Só guarda quando o cliente escolhe (e remove quando volta a null)
  useEffect(() => {
    if (deliveryMethod) {
      localStorage.setItem("domrealce_delivery_method", deliveryMethod);
    } else {
      localStorage.removeItem("domrealce_delivery_method");
    }
  }, [deliveryMethod]);

  const updateCartInStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id !== id) return item;

      const updatedItem: CartItem = { ...item, ...updates };

      const shouldRecalcWallpaper =
        item.type === "papel-parede" &&
        ("largura" in updates ||
          "altura" in updates ||
          "larguraCm" in updates ||
          "alturaCm" in updates ||
          "laminacao" in updates ||
          "material" in updates ||
          "preco" in updates);

      if (shouldRecalcWallpaper) {
        const largura = updatedItem.largura || 0;
        const altura = updatedItem.altura || 0;

        updatedItem.area = Math.max(0.01, largura * altura);

        // ✅ Se não escolheu material, preço fica 0
        const material = updatedItem.material;
        if (!material) {
          updatedItem.precoTotal = 0;
          return updatedItem;
        }

        const area = updatedItem.area || 0;
        const basePrice = (updatedItem.preco || 0) * area;

        const laminacaoPrice =
          material === "vinil" && updatedItem.laminacao ? 8 * area : 0;

        updatedItem.precoTotal = basePrice + laminacaoPrice;
      }

      return updatedItem;
    });

    updateCartInStorage(updatedItems);
  };

  const updateQuantity = (id: string, quantidade: number) => {
    if (quantidade < 1) return;
    updateItem(id, { quantidade });
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    updateCartInStorage(updatedItems);
    toast({
      title: "Item removido",
      description: "Produto removido do carrinho.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    setDeliveryMethod(null);
    localStorage.removeItem("domrealce_delivery_method");

    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do carrinho.",
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.precoTotal * (item.quantidade || 1);
    }, 0);
  };

  const calculateTotalWithShippingAndIVA = () => {
    const subtotal = calculateTotal();

    const shipping =
      deliveryMethod === "pickup"
        ? 0
        : deliveryMethod === "delivery"
        ? subtotal >= 100
          ? 0
          : 10
        : 0;

    const subtotalWithShipping = subtotal + shipping;
    const iva = subtotalWithShipping * 0.23;

    return {
      subtotal,
      shipping,
      iva,
      total: subtotalWithShipping + iva,
    };
  };

  // ==========================
  // ✅ Validação global (MVP)
  // ==========================
  const hasInvalidWallpaper = useMemo(() => {
    return cartItems.some((item) => {
      if (item.type !== "papel-parede") return false;
      return !validateWallpaper(item).isValid;
    });
  }, [cartItems]);

  const canProceed =
    cartItems.length > 0 && deliveryMethod !== null && !hasInvalidWallpaper;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    );
  }

  const totals = calculateTotalWithShippingAndIVA();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* Header */}
      <div className="bg-[#111111] border-b border-[#333] mt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[#FFD700]">Carrinho</span> de Compras
          </h1>
          <p className="text-gray-400">
            Revise os seus produtos antes de finalizar a compra
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              Carrinho vazio
            </h2>
            <p className="text-gray-500 mb-6">
              Adicione produtos à sua compra para continuar.
            </p>
            <Link href="/loja">
              <Button className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold">
                Ver Loja
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

              {cartItems.map((item) => {
                const wall =
                  item.type === "papel-parede" ? validateWallpaper(item) : null;

                return (
                  <Card key={item.id} className="bg-[#111111] border-[#333]">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        {/* Product Image */}
                        <div className="md:col-span-1">
                          <img
                            src={
                              item.type === "papel-parede"
                                ? item.textureImage
                                : item.canvasImage
                            }
                            alt={
                              item.type === "papel-parede"
                                ? item.textureName
                                : item.canvasName
                            }
                            className="w-full aspect-square object-cover rounded-lg border border-[#333]"
                          />
                        </div>

                        {/* Product Info & Customization */}
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#FFD700] mb-2">
                              {item.type === "papel-parede"
                                ? item.textureName
                                : item.canvasName}
                            </h3>
                            <Badge className="bg-[#20B2AA] text-black">
                              {item.type === "papel-parede"
                                ? "PAPEL DE PAREDE"
                                : "QUADROS EM CANVAS"}
                            </Badge>
                          </div>

                          {/* Canvas Size Display */}
                          {item.type === "quadros-canvas" && (
                            <div className="p-3 bg-[#0a0a0a] rounded-lg border border-[#333] space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-400">
                                  Tamanho:
                                </span>
                                <span className="text-sm font-semibold text-gray-300">
                                  {item.tamanho}cm
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Wallpaper Options */}
                          {item.type === "papel-parede" && (
                            <div className="space-y-3">
                              {/* ✅ Material: começa desselecionado + aviso */}
                              <div>
                                <label className="block text-sm font-medium text-[#FFD700] mb-2">
                                  Material
                                </label>

                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`material-${item.id}`}
                                      checked={item.material === "papel"}
                                      onChange={() =>
                                        updateItem(item.id, {
                                          material: "papel",
                                          laminacao: false,
                                          acabamento: undefined,
                                        })
                                      }
                                    />
                                    Papel de Parede
                                  </label>

                                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`material-${item.id}`}
                                      checked={item.material === "vinil"}
                                      onChange={() =>
                                        updateItem(item.id, {
                                          material: "vinil",
                                          acabamento: item.acabamento || "mate",
                                          laminacao: item.laminacao || false,
                                        })
                                      }
                                    />
                                    Vinil
                                  </label>
                                </div>

                                {/* ✅ aviso no sítio certo */}
                                {item.material == null && (
                                  <div className="mt-2 p-2 rounded border border-red-500/40 bg-red-500/10">
                                    <p className="text-xs text-red-200">
                                      ⚠️ Selecione um material para continuar.
                                    </p>
                                  </div>
                                )}

                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                  {item.material === "vinil"
                                    ? "Vinil recomendado para superfícies laváveis e zonas de maior desgaste."
                                    : item.material === "papel"
                                    ? "Papel de parede para aplicação interior. Cola não incluída."
                                    : "Selecione o material para ver recomendações."}
                                </p>
                              </div>

                              {/* ✅ Vinil extra (Mate/Brilho + Laminação) */}
                              {item.material === "vinil" && (
                                <>
                                  <div>
                                    <label className="block text-sm font-medium text-[#FFD700] mb-2">
                                      Acabamento
                                    </label>
                                    <Select
                                      value={item.acabamento || "mate"}
                                      onValueChange={(value: "brilho" | "mate") =>
                                        updateItem(item.id, { acabamento: value })
                                      }
                                    >
                                      <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#111111] border-[#333]">
                                        <SelectItem
                                          value="brilho"
                                          className="text-white hover:bg-[#333]"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            Brilho
                                          </div>
                                        </SelectItem>
                                        <SelectItem
                                          value="mate"
                                          className="text-white hover:bg-[#333]"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 bg-gray-400 rounded-full" />
                                            Mate
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      id={`laminacao-${item.id}`}
                                      checked={item.laminacao || false}
                                      onChange={(e) =>
                                        updateItem(item.id, {
                                          laminacao: e.target.checked,
                                        })
                                      }
                                      className="rounded border-[#333] bg-[#0a0a0a] text-[#FFD700] focus:ring-[#FFD700]"
                                    />
                                    <label
                                      htmlFor={`laminacao-${item.id}`}
                                      className="text-sm text-gray-300 flex-1"
                                    >
                                      Laminação (opcional) - Proteção contra riscos e
                                      raios UV
                                    </label>
                                    <Sparkles className="h-4 h-4 text-[#FFD700]" />
                                  </div>
                                </>
                              )}

                              {/* ✅ Medidas com mínimo + mensagens */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-[#FFD700] mb-2">
                                    Largura (cm)
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    step="1"
                                    value={item.larguraCm ?? ""}
                                    onChange={(e) => {
                                      const n = toIntOrNull(e.target.value);
                                      if (n === null) {
                                        updateItem(item.id, {
                                          larguraCm: null,
                                          largura: 0,
                                        });
                                        return;
                                      }
                                      if (n > 0) {
                                        updateItem(item.id, {
                                          larguraCm: n,
                                          largura: n / 100,
                                        });
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm focus:border-[#FFD700] focus:outline-none"
                                  />
                                  {wall?.invalidWidth && (
                                    <p className="mt-1 text-xs text-red-300">
                                      ⚠️ Mínimo: {MIN_LARGURA_CM} cm.
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-[#FFD700] mb-2">
                                    Altura (cm)
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    step="1"
                                    value={item.alturaCm ?? ""}
                                    onChange={(e) => {
                                      const n = toIntOrNull(e.target.value);
                                      if (n === null) {
                                        updateItem(item.id, {
                                          alturaCm: null,
                                          altura: 0,
                                        });
                                        return;
                                      }
                                      if (n > 0) {
                                        updateItem(item.id, {
                                          alturaCm: n,
                                          altura: n / 100,
                                        });
                                      }
                                    }}
                                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm focus:border-[#FFD700] focus:outline-none"
                                  />
                                  {wall?.invalidHeight && (
                                    <p className="mt-1 text-xs text-red-300">
                                      ⚠️ Mínimo: {MIN_ALTURA_CM} cm.
                                    </p>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs text-gray-400 leading-relaxed">
                                As medidas indicadas serão usadas para produzir o papel
                                de parede à medida exata da sua parede. (Mínimo{" "}
                                {MIN_LARGURA_CM}×{MIN_ALTURA_CM} cm)
                              </p>
                            </div>
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
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    (item.quantidade || 1) - 1
                                  )
                                }
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
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    (item.quantidade || 1) + 1
                                  )
                                }
                                className="border-[#333] text-white hover:bg-[#333]"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="md:col-span-1 text-right space-y-4">
                          <div>
                            {item.type === "papel-parede" && (
                              <>
                                <p className="text-sm text-[#FFD700]">Preço por m²:</p>
                                <p className="text-md font-semibold text-white">
                                  €{item.preco}/m²
                                </p>
                                {item.laminacao && (
                                  <p className="text-xs text-gray-400">
                                    + €8/m² laminação
                                  </p>
                                )}
                                <div className="mt-2 pt-2 border-t border-[#333]">
                                  <p className="text-sm text-[#FFD700]">
                                    Total área (
                                    {((item.largura || 0) * (item.altura || 0)).toFixed(
                                      2
                                    )}{" "}
                                    m²):
                                  </p>
                                  <p className="text-lg font-semibold text-[#FFD700]">
                                    €{item.precoTotal.toFixed(2)}
                                  </p>
                                </div>
                              </>
                            )}

                            {item.type === "quadros-canvas" && (
                              <>
                                <p className="text-sm text-[#FFD700]">Preço base:</p>
                                <p className="text-md font-semibold text-white">
                                  €{(item.precoBase || 0).toFixed(2)}
                                </p>
                                <div className="mt-2 pt-2 border-t border-[#333]">
                                  <p className="text-sm text-[#FFD700]">
                                    Total (c/ IVA):
                                  </p>
                                  <p className="text-lg font-semibold text-[#FFD700]">
                                    €{item.precoTotal.toFixed(2)}
                                  </p>
                                </div>
                              </>
                            )}

                            <p className="text-sm text-gray-400 mt-2">
                              Final: €
                              {(item.precoTotal * (item.quantidade || 1)).toFixed(2)}
                            </p>
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
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-[#111111] border-[#333] sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#FFD700]">
                    Resumo do Pedido
                  </h3>

                  <div className="space-y-3 mb-6 text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-gray-300">
                        €{totals.subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* ✅ Método de entrega (obrigatório) */}
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-medium text-gray-300">
                        Método de entrega
                      </div>

                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === "delivery"}
                          onChange={() => setDeliveryMethod("delivery")}
                        />
                        Envio por transportadora
                      </label>

                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === "pickup"}
                          onChange={() => setDeliveryMethod("pickup")}
                        />
                        Levantar na loja{" "}
                        <span className="text-[#FFD700]">(portes 0€)</span>
                      </label>

                      {deliveryMethod === null && (
                        <div className="mt-2 p-2 rounded border border-red-500/40 bg-red-500/10">
                          <p className="text-xs text-red-200">
                            ⚠️ Selecione um método de entrega para continuar.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ✅ Aviso global (material/medidas) */}
                    {hasInvalidWallpaper && (
                      <div className="mt-2 p-2 rounded border border-red-500/40 bg-red-500/10">
                        <p className="text-xs text-red-200">
                          ⚠️ Falta selecionar material e/ou indicar medidas mínimas
                          ({MIN_LARGURA_CM}×{MIN_ALTURA_CM} cm) em itens de papel de
                          parede.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-300">Envio:</span>
                      {deliveryMethod === null ? (
                        <span className="text-gray-500">Selecione</span>
                      ) : (
                        <span
                          className={
                            totals.shipping === 0
                              ? "text-green-400"
                              : "text-gray-300"
                          }
                        >
                          {totals.shipping === 0
                            ? "Grátis"
                            : `€${totals.shipping.toFixed(2)}`}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-300">IVA (23%):</span>
                      <span className="text-gray-300">
                        €{totals.iva.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-lg border-t border-[#333] pt-3">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-[#FFD700]">
                        €{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* ✅ Dica só faz sentido em transportadora */}
                  {deliveryMethod === "delivery" && totals.subtotal < 100 && (
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-200">
                        💡 Adicione mais €{(100 - totals.subtotal).toFixed(2)} para
                        envio gratuito!
                      </p>
                    </div>
                  )}

                  {/* ✅ Botão: só avança se estiver tudo válido */}
                  {canProceed ? (
                    <Link href="/checkout">
                      <Button
                        className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold py-3"
                        data-testid="button-finalizar-compra"
                      >
                        Finalizar Compra
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-[#333] text-gray-400 font-bold py-3 cursor-not-allowed"
                    >
                      Finalizar Compra
                    </Button>
                  )}

                  <Link href="/loja">
                    <Button
                      variant="outline"
                      className="w-full mt-3 border-[#333] text-white hover:bg-[#333]"
                    >
                      Continuar Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}