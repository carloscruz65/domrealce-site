import { z } from "zod";

// Base cart item schema
const baseCartItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1).default(1),
  createdAt: z.date().default(() => new Date())
});

// Cart item schema for wallpaper textures
export const wallpaperCartItemSchema = baseCartItemSchema.extend({
  type: z.literal('papel-parede'),
  textureName: z.string(),
  textureImage: z.string(),
  acabamento: z.enum(['brilho', 'mate']),
  laminacao: z.boolean(),
  tipoCola: z.enum(['com-cola', 'sem-cola']).default('com-cola'),
  largura: z.number().min(0.01).default(0),
  altura: z.number().min(0.01).default(0),
  larguraCm: z.number().min(1).default(0),
  alturaCm: z.number().min(1).default(0),
  area: z.number().min(0.01),
  precoBase: z.number(),
  precoTotal: z.number(),
});

// Cart item schema for canvas art
export const canvasCartItemSchema = baseCartItemSchema.extend({
  type: z.literal('quadros-canvas'),
  canvasName: z.string(),
  canvasImage: z.string(),
  tamanho: z.enum(['20x30', '30x40', '40x50', '50x70', '60x80', '70x100', '80x120', '100x150']),
  larguraCm: z.number().min(1),
  alturaCm: z.number().min(1),
  area: z.number().min(0.01),
  precoBase: z.number(),
  precoTotal: z.number(),
});

// Union of all cart item types
export const cartItemSchema = z.discriminatedUnion('type', [
  wallpaperCartItemSchema,
  canvasCartItemSchema
]);

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number(),
  updatedAt: z.date().default(() => new Date())
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type WallpaperCartItem = z.infer<typeof wallpaperCartItemSchema>;
export type CanvasCartItem = z.infer<typeof canvasCartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

// Create cart item insert schemas
export const createWallpaperCartItemSchema = wallpaperCartItemSchema.omit({
  id: true,
  createdAt: true
});

export const createCanvasCartItemSchema = canvasCartItemSchema.omit({
  id: true,
  createdAt: true
});

export const createCartItemSchema = z.discriminatedUnion('type', [
  createWallpaperCartItemSchema,
  createCanvasCartItemSchema
]);

export type CreateCartItem = z.infer<typeof createCartItemSchema>;
export type CreateWallpaperCartItem = z.infer<typeof createWallpaperCartItemSchema>;
export type CreateCanvasCartItem = z.infer<typeof createCanvasCartItemSchema>;