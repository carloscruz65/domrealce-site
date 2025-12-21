import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  boolean,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Updated users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone"),
  empresa: text("empresa"),
  mensagem: text("mensagem").notNull(),
  ficheiros: text("ficheiros").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  preco: text("preco").notNull(),
  imagem: text("imagem").notNull(),
  categoria: text("categoria").notNull(),
  destaque: boolean("destaque").default(false),
  categoryPath: varchar("category_path", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// =======================
// NEWS (v2) - Projetos/Notícias
// =======================
export const news = pgTable("news", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // v1 (mantido)
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  categoria: text("categoria").notNull(),
  imagem: text("imagem").notNull(), // imagem principal (compatibilidade)
  imagens: text("imagens").array().default([]), // galeria
  tipoGaleria: text("tipo_galeria").default("single"), // single, slide, grid, before-after

  // v2 (novo)
  subtitulo: text("subtitulo"), // opcional
  intro: text("intro"), // opcional (2-3 linhas)
  heroTipo: text("hero_tipo").default("image"), // image | video
  heroUrl: text("hero_url"), // url de imagem ou vídeo (opcional)

  // Conteúdo modular (JSON)
  blocks: jsonb("blocks").default(sql`'[]'::jsonb`),
  review: jsonb("review"), // opcional

  // Serviços relacionados (CTA discreto)
  relatedServices: text("related_services").array().default([]),

  // v3: Galeria com legendas (media items)
  media: jsonb("media").default(sql`'[]'::jsonb`), // Array de { type: "image"|"video", url: string, caption?: string }
  summary: text("summary"), // resumo curto opcional
  published: boolean("published").default(false), // rascunho ou publicado
  publishedAt: timestamp("published_at"), // data de publicação efetiva
  layoutGaleria: text("layout_galeria").default("grid"), // single, slider, grid, beforeAfter

  data: timestamp("data").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const slides = pgTable("slides", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  image: text("image").notNull(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  order_position: text("order_position").default("1"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pageConfigs = pgTable("page_configs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  page: text("page").notNull(), // home, about, services, portfolio, contact, etc.
  section: text("section").notNull(), // hero, features, about, etc.
  element: text("element").notNull(), // title, subtitle, description, image, etc.
  type: text("type").notNull(), // text, color, size, image, number
  value: text("value").notNull(),
  defaultValue: text("default_value"),
  metadata: text("metadata"), // JSON string for additional config like font-size units, color format, etc.
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceGalleries = pgTable("service_galleries", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  serviceId: text("service_id").notNull().unique(), // design-grafico, impressao-digital, etc.
  images: jsonb("images").notNull(), // Array de { src, alt, title }
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceHeros = pgTable("service_heroes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  serviceId: text("service_id").notNull().unique(), // design-grafico, impressao-digital, etc.
  badge: text("badge"),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  backgroundImage: text("background_image"),
  backgroundTexture: text("background_texture"),
  gradientOverlay: text("gradient_overlay"),
  backgroundColor: text("background_color"),
  textColor: text("text_color"),
  overlayOpacity: text("overlay_opacity"),
  height: text("height"),
  primaryCtaText: text("primary_cta_text"),
  primaryCtaHref: text("primary_cta_href"),
  secondaryCtaText: text("secondary_cta_text"),
  secondaryCtaHref: text("secondary_cta_href"),

  // Mobile responsive settings
  mobileTitleSize: text("mobile_title_size"), // e.g. "1rem", "0.9rem"
  mobileDescSize: text("mobile_desc_size"), // e.g. "0.625rem", "0.7rem"
  mobileBadgeSize: text("mobile_badge_size"), // e.g. "0.5rem", "0.6rem"
  mobileSpacing: text("mobile_spacing"), // e.g. "compact", "normal"
  mobileButtonLabels: jsonb("mobile_button_labels"), // { primary: "Projeto", secondary: "Contacto", portfolio: "Portfólio" }
  mobileHeight: text("mobile_height"), // e.g. "500px", "60vh"
  mobileContentAlign: text("mobile_content_align"), // top, center, bottom

  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  numeroEncomenda: text("numero_encomenda").notNull().unique(),

  // Dados do cliente
  clienteNome: text("cliente_nome").notNull(),
  clienteEmail: text("cliente_email").notNull(),
  clienteTelefone: text("cliente_telefone"),
  clienteMorada: text("cliente_morada").notNull(),
  clienteCodigoPostal: text("cliente_codigo_postal").notNull(),
  clienteCidade: text("cliente_cidade").notNull(),
  clienteNIF: text("cliente_nif"),

  // Itens da encomenda
  itens: jsonb("itens").notNull(), // Array de CartItem

  // Totais
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  envio: decimal("envio", { precision: 10, scale: 2 }).notNull(),
  iva: decimal("iva", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),

  // Estado
  estado: text("estado").notNull().default("pendente"), // pendente, paga, processando, enviada, entregue, cancelada

  // Pagamento
  metodoPagamento: text("metodo_pagamento").notNull(), // mbway, multibanco, payshop, creditcard
  estadoPagamento: text("estado_pagamento").notNull().default("pendente"), // pendente, pago, falhado
  referenciaIfthenpay: text("referencia_ifthenpay"),
  dadosPagamento: jsonb("dados_pagamento"),

  // Tracking e notas
  codigoRastreio: text("codigo_rastreio"),
  notasInternas: text("notas_internas"),

  // Timestamps
  dataPagamento: timestamp("data_pagamento"),
  dataEnvio: timestamp("data_envio"),
  dataEntrega: timestamp("data_entrega"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertContactSchema = createInsertSchema(contacts)
  .pick({
    nome: true,
    email: true,
    telefone: true,
    empresa: true,
    mensagem: true,
    ficheiros: true,
  })
  .extend({
    email: z.string().email("Email inválido"),
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
    telefone: z.string().optional(),
    empresa: z.string().optional(),
    ficheiros: z.array(z.string()).optional().default([]),
  });

export const insertProductSchema = createInsertSchema(products).pick({
  titulo: true,
  descricao: true,
  preco: true,
  imagem: true,
  categoria: true,
  destaque: true,
});

// -----------------------
// News v2: blocos + review
// -----------------------
export const newsHeroTipoSchema = z.enum(["image", "video"]);

export const newsBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    id: z.string().optional(),
    title: z.string().optional(),
    content: z.string().min(1),
  }),
  z.object({
    type: z.literal("image"),
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().min(1),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("gallery"),
    id: z.string().optional(),
    title: z.string().optional(),
    layout: z.enum(["grid", "slider"]).optional().default("grid"),
    images: z
      .array(
        z.object({
          url: z.string().min(1),
          caption: z.string().optional(),
        }),
      )
      .min(1),
  }),
  z.object({
    type: z.literal("video"),
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().min(1),
    caption: z.string().optional(),
  }),
]);

export const newsReviewSchema = z
  .object({
    enabled: z.boolean().optional().default(true),
    score: z.number().min(0).max(10).optional(), // pontuação global
    criteria: z
      .array(
        z.object({
          label: z.string().min(1),
          score: z.number().min(0).max(10),
          notes: z.string().optional(),
        }),
      )
      .optional(),
    notes: z.string().optional(),
  })
  .optional();

// Schema para itens de media (galeria com legendas)
export const mediaItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().min(1),
  caption: z.string().optional(),
});

export type MediaItem = z.infer<typeof mediaItemSchema>;

export const insertNewsSchema = createInsertSchema(news)
  .pick({
    // v1
    titulo: true,
    descricao: true,
    categoria: true,
    imagem: true,
    imagens: true,
    tipoGaleria: true,
    data: true,

    // v2
    subtitulo: true,
    intro: true,
    heroTipo: true,
    heroUrl: true,
    blocks: true,
    review: true,
    relatedServices: true,

    // v3
    media: true,
    summary: true,
    published: true,
    publishedAt: true,
    layoutGaleria: true,
  })
  .extend({
    data: z.string().optional(),

    // v1 compat
    imagem: z.string().optional(),
    imagens: z.array(z.string()).optional().default([]),
    tipoGaleria: z
      .enum(["single", "slide", "grid", "before-after"])
      .optional()
      .default("single"),

    // v2
    subtitulo: z.string().nullish(),
    intro: z.string().nullish(),
    heroTipo: newsHeroTipoSchema.optional().default("image"),
    heroUrl: z.string().nullish(),
    blocks: z.array(newsBlockSchema).optional().default([]),
    review: newsReviewSchema.nullish(),
    relatedServices: z.array(z.string()).optional().default([]),

    // v3
    media: z.array(mediaItemSchema).optional().default([]),
    summary: z.string().nullish(),
    published: z.boolean().optional().default(false),
    publishedAt: z.string().nullish(),
    layoutGaleria: z.enum(["single", "slider", "grid", "beforeAfter"]).optional().default("grid"),
  });

export const insertSlideSchema = createInsertSchema(slides).pick({
  image: true,
  title: true,
  text: true,
  order_position: true,
  active: true,
});

export const insertPageConfigSchema = createInsertSchema(pageConfigs)
  .pick({
    page: true,
    section: true,
    element: true,
    type: true,
    value: true,
    defaultValue: true,
    metadata: true,
  })
  .extend({
    page: z.string().min(1, "Página é obrigatória"),
    section: z.string().min(1, "Secção é obrigatória"),
    element: z.string().min(1, "Elemento é obrigatório"),
    type: z.enum(["text", "color", "size", "image", "number"], {
      errorMap: () => ({
        message: "Tipo deve ser: text, color, size, image ou number",
      }),
    }),
    value: z.string().min(1, "Valor é obrigatório"),
    defaultValue: z.string().optional(),
    metadata: z.string().optional(),
  });

export const insertServiceGallerySchema = createInsertSchema(serviceGalleries)
  .pick({
    serviceId: true,
    images: true,
  })
  .extend({
    serviceId: z.string().min(1, "ID do serviço é obrigatório"),
    images: z
      .array(
        z.object({
          src: z.string().min(1, "URL da imagem é obrigatória"),
          alt: z.string(),
          title: z.string(),
        }),
      )
      .min(1, "Deve ter pelo menos uma imagem"),
  });

export const insertServiceHeroSchema = createInsertSchema(serviceHeros)
  .pick({
    serviceId: true,
    badge: true,
    title: true,
    subtitle: true,
    description: true,
    backgroundImage: true,
    backgroundTexture: true,
    gradientOverlay: true,
    backgroundColor: true,
    textColor: true,
    overlayOpacity: true,
    height: true,
    primaryCtaText: true,
    primaryCtaHref: true,
    secondaryCtaText: true,
    secondaryCtaHref: true,
    mobileTitleSize: true,
    mobileDescSize: true,
    mobileBadgeSize: true,
    mobileSpacing: true,
    mobileButtonLabels: true,
    mobileHeight: true,
    mobileContentAlign: true,
  })
  .extend({
    serviceId: z.string().min(1, "ID do serviço é obrigatório"),
    title: z.string().min(1, "Título é obrigatório"),
    badge: z.string().nullish(),
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    backgroundImage: z.string().nullish(),
    backgroundTexture: z.string().nullish(),
    gradientOverlay: z.string().nullish(),
    backgroundColor: z.string().nullish(),
    textColor: z.string().nullish(),
    overlayOpacity: z
      .union([z.string(), z.number()])
      .nullish()
      .transform((val) => (val ? String(val) : null)),
    height: z.string().nullish(),
    primaryCtaText: z.string().nullish(),
    primaryCtaHref: z.string().nullish(),
    secondaryCtaText: z.string().nullish(),
    secondaryCtaHref: z.string().nullish(),
    mobileTitleSize: z.string().nullish(),
    mobileDescSize: z.string().nullish(),
    mobileBadgeSize: z.string().nullish(),
    mobileSpacing: z.enum(["compact", "normal"]).nullish(),
    mobileButtonLabels: z
      .object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        portfolio: z.string().optional(),
      })
      .nullish(),
    mobileHeight: z.string().nullish(),
    mobileContentAlign: z.enum(["top", "center", "bottom"]).nullish(),
  });

export const insertOrderSchema = createInsertSchema(orders)
  .pick({
    numeroEncomenda: true,
    clienteNome: true,
    clienteEmail: true,
    clienteTelefone: true,
    clienteMorada: true,
    clienteCodigoPostal: true,
    clienteCidade: true,
    clienteNIF: true,
    itens: true,
    subtotal: true,
    envio: true,
    iva: true,
    total: true,
    estado: true,
    metodoPagamento: true,
    estadoPagamento: true,
    referenciaIfthenpay: true,
    dadosPagamento: true,
    codigoRastreio: true,
    notasInternas: true,
  })
  .extend({
    clienteNome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    clienteEmail: z.string().email("Email inválido"),
    clienteMorada: z.string().min(5, "Morada deve ter pelo menos 5 caracteres"),
    clienteCodigoPostal: z.string().min(8, "Código postal inválido"),
    clienteCidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    clienteTelefone: z.string().optional(),
    clienteNIF: z.string().optional(),
    estado: z
      .enum([
        "pendente",
        "paga",
        "processando",
        "enviada",
        "entregue",
        "cancelada",
      ])
      .default("pendente"),
    metodoPagamento: z.enum([
      "mbway",
      "multibanco",
      "payshop",
      "creditcard",
      "paypal",
    ]),
    estadoPagamento: z
      .enum(["pendente", "pago", "falhado"])
      .default("pendente"),
    itens: z.array(z.any()).min(1, "Deve ter pelo menos um item"),
    subtotal: z.string().or(z.number()),
    envio: z.string().or(z.number()),
    iva: z.string().or(z.number()),
    total: z.string().or(z.number()),
    referenciaIfthenpay: z.string().optional(),
    dadosPagamento: z.any().optional(),
    codigoRastreio: z.string().optional(),
    notasInternas: z.string().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slides.$inferSelect;
export type InsertPageConfig = z.infer<typeof insertPageConfigSchema>;
export type PageConfig = typeof pageConfigs.$inferSelect;
export type InsertServiceGallery = z.infer<typeof insertServiceGallerySchema>;
export type ServiceGallery = typeof serviceGalleries.$inferSelect;
export type InsertServiceHero = z.infer<typeof insertServiceHeroSchema>;
export type ServiceHero = typeof serviceHeros.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
