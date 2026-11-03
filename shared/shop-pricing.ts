import {
  DEFAULT_SHOP_SETTINGS,
  type ShopCatalog,
  type ShopSettings,
} from "./shop-catalog";

export const CANVAS_SIZES = [
  "20x30",
  "30x40",
  "40x50",
  "50x70",
  "60x80",
  "70x100",
  "80x120",
  "100x150",
] as const;
export const IVA_RATE = 0.23;
export const cents = (amount: number) =>
  Math.round((amount + Number.EPSILON) * 100);
export type ShopLine = Record<string, any>;
export function quantityOf(item: ShopLine): number {
  const n = item.quantidade ?? item.quantity ?? 1;
  if (typeof n !== "number" || !Number.isSafeInteger(n) || n < 1 || n > 100000)
    throw new Error("Indique uma quantidade inteira entre 1 e 100000.");
  return n;
}
export function legacyUnitPriceCents(
  item: ShopLine,
  settings: ShopSettings,
): number {
  if (item.type === "quadros-canvas") {
    const value =
      settings.canvasPricesCents[
        item.tamanho as keyof ShopSettings["canvasPricesCents"]
      ];
    if (!value) throw new Error("Tamanho de canvas inválido.");
    return value; // sempre sem IVA; o IVA é aplicado uma vez ao total
  }
  if (item.type === "papel-parede") {
    const w = Number(item.larguraCm),
      h = Number(item.alturaCm);
    if (
      !Number.isFinite(w) ||
      !Number.isFinite(h) ||
      w < 100 ||
      h < 100 ||
      w > 100000 ||
      h > 100000
    )
      throw new Error(
        "Complete as medidas do papel de parede (mínimo 100 × 100 cm).",
      );
    if (item.material !== "papel" && item.material !== "vinil")
      throw new Error("Selecione o material do papel de parede.");
    const area = (w / 100) * (h / 100);
    const price =
      settings.wallpaperPriceCentsM2 +
      (item.material === "vinil" && item.laminacao === true
        ? settings.wallpaperLaminationCentsM2
        : 0);
    return Math.round(area * price);
  }
  throw new Error("Tipo de produto não reconhecido.");
}
export function quoteShopCart(
  items: ShopLine[],
  catalog: ShopCatalog,
  delivery: unknown,
) {
  if (delivery !== "pickup" && delivery !== "delivery")
    throw new Error("Escolha envio ou levantamento.");
  if (!Array.isArray(items) || !items.length || items.length > 100)
    throw new Error("O carrinho deve conter entre 1 e 100 artigos.");
  let subtotalCents = 0;
  const canonical = items.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item))
      throw new Error("Artigo inválido no carrinho.");
    const quantidade = quantityOf(item);
    let unitPrice: number;
    let data: ShopLine = { ...item };
    if (item.type === "produto") {
      const product = catalog.products.find(
        (p) => p.id === item.shopProductId && p.published,
      );
      const category =
        product &&
        catalog.categories.find(
          (c) => c.id === product.categoryId && c.published,
        );
      if (!product || !category)
        throw new Error(
          "Um produto deixou de estar disponível. Retire-o do carrinho.",
        );
      if (
        quantidade < product.minimumQuantity ||
        (quantidade - product.minimumQuantity) % product.quantityStep !== 0
      )
        throw new Error(
          `${product.name}: mínimo ${product.minimumQuantity}, acréscimos de ${product.quantityStep}.`,
        );
      const personalizationLabel = product.personalizationLabel || "";
      let personalizationValue = "";
      if (personalizationLabel) {
        if (typeof item.personalizationValue !== "string")
          throw new Error(`${product.name}: preencha ${personalizationLabel}.`);
        personalizationValue = item.personalizationValue.trim();
        if (
          !personalizationValue ||
          personalizationValue.length > 200 ||
          /[\u0000-\u001f\u007f]/.test(personalizationValue)
        )
          throw new Error(
            `${product.name}: indique ${personalizationLabel} (1 a 200 caracteres, numa linha).`,
          );
      }
      unitPrice = product.priceCents;
      data = {
        id: String(item.id ?? product.id),
        type: "produto",
        shopProductId: product.id,
        productName: product.name,
        productImage: product.image,
        unit: product.unit,
        specifications: product.specifications,
        personalizationLabel,
        personalizationValue,
        minimumQuantity: product.minimumQuantity,
        quantityStep: product.quantityStep,
      };
    } else {
      unitPrice = legacyUnitPriceCents(item, catalog.settings);
      if (item.type === "quadros-canvas") {
        const [larguraCm, alturaCm] = String(item.tamanho)
          .split("x")
          .map(Number);
        data = {
          ...data,
          larguraCm,
          alturaCm,
          largura: larguraCm / 100,
          altura: alturaCm / 100,
          area: (larguraCm * alturaCm) / 10000,
        };
      } else {
        const larguraCm = Number(item.larguraCm),
          alturaCm = Number(item.alturaCm);
        data = {
          ...data,
          larguraCm,
          alturaCm,
          largura: larguraCm / 100,
          altura: alturaCm / 100,
          area: (larguraCm * alturaCm) / 10000,
          preco: catalog.settings.wallpaperPriceCentsM2 / 100,
        };
      }
    }
    subtotalCents += unitPrice * quantidade;
    return {
      ...data,
      quantidade,
      quantity: quantidade,
      precoTotal: unitPrice / 100,
      precoBase: unitPrice / 100,
      priceIncludesVat: false,
    };
  });
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents > 10000000000)
    throw new Error("Valor de encomenda demasiado elevado.");
  const shippingCents =
    delivery === "pickup" ||
    subtotalCents >= catalog.settings.freeShippingFromCents
      ? 0
      : catalog.settings.shippingCents;
  const ivaCents = Math.round((subtotalCents + shippingCents) * IVA_RATE);
  return {
    items: canonical,
    subtotal: subtotalCents / 100,
    envio: shippingCents / 100,
    iva: ivaCents / 100,
    total: (subtotalCents + shippingCents + ivaCents) / 100,
  };
}
/** Atualiza carrinhos antigos; preços de canvas antigos com IVA deixam de ser somados como preço líquido. */
export function normalizeShopLine<T extends ShopLine>(
  item: T,
  catalog: ShopCatalog,
): T {
  try {
    return quoteShopCart([item], catalog, "pickup").items[0] as unknown as T;
  } catch {
    const product =
      item.type === "produto"
        ? catalog.products.find((p) => p.id === item.shopProductId)
        : undefined;
    return {
      ...item,
      ...(product
        ? { personalizationLabel: product.personalizationLabel || "" }
        : {}),
      precoTotal: 0,
    };
  }
}
export function canvasOptions(settings: ShopSettings = DEFAULT_SHOP_SETTINGS) {
  return CANVAS_SIZES.map((size) => {
    const [width, height] = size.split("x").map(Number);
    return {
      size,
      width,
      height,
      price: settings.canvasPricesCents[size] / 100,
    };
  });
}
