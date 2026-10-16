import { z } from "zod";

const image = z
  .string()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Use uma imagem carregada ou um endereço HTTPS.");
const slug = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use letras minúsculas, números e hífen.",
  );
export const categoryInput = z
  .object({
    name: z.string().trim().min(2).max(150),
    slug,
    description: z.string().trim().max(3000).default(""),
    image: image.default(""),
    published: z.boolean().default(false),
    position: z.number().int().min(0).max(100000).default(0),
  })
  .strict();
export const productInput = z
  .object({
    categoryId: z.string().uuid(),
    name: z.string().trim().min(2).max(200),
    slug,
    description: z.string().trim().max(10000).default(""),
    specifications: z.string().trim().max(3000).default(""),
    personalizationLabel: z.string().trim().max(100).default(""),
    image: image.default(""),
    priceCents: z.number().int().min(1).max(100000000),
    minimumQuantity: z.number().int().min(1).max(100000).default(1),
    quantityStep: z.number().int().min(1).max(100000).default(1),
    unit: z.enum(["unidade", "conjunto"]).default("unidade"),
    published: z.boolean().default(false),
    position: z.number().int().min(0).max(100000).default(0),
  })
  .strict()
  .refine(
    (p) => !p.published || Boolean(p.image),
    "Adicione uma imagem antes de publicar o produto.",
  );
const cents = z.number().int().min(0).max(100000000);
export const settingsInput = z
  .object({
    shippingCents: cents,
    freeShippingFromCents: cents,
    wallpaperPriceCentsM2: cents.positive(),
    wallpaperLaminationCentsM2: cents,
    canvasPricesCents: z
      .object({
        "20x30": cents.positive(),
        "30x40": cents.positive(),
        "40x50": cents.positive(),
        "50x70": cents.positive(),
        "60x80": cents.positive(),
        "70x100": cents.positive(),
        "80x120": cents.positive(),
        "100x150": cents.positive(),
      })
      .strict(),
  })
  .strict();
export type CategoryInput = z.infer<typeof categoryInput>;
export type ProductInput = z.infer<typeof productInput>;
export type ShopSettings = z.infer<typeof settingsInput>;
export type ShopCategory = CategoryInput & { id: string };
export type ShopProduct = ProductInput & { id: string };
export type ShopCatalog = {
  categories: ShopCategory[];
  products: ShopProduct[];
  settings: ShopSettings;
};
export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  shippingCents: 1000,
  freeShippingFromCents: 10000,
  wallpaperPriceCentsM2: 2000,
  wallpaperLaminationCentsM2: 800,
  canvasPricesCents: {
    "20x30": 1500,
    "30x40": 2500,
    "40x50": 3500,
    "50x70": 5000,
    "60x80": 7000,
    "70x100": 9000,
    "80x120": 12000,
    "100x150": 15000,
  },
};
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}
