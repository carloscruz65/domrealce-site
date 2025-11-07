import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, index, jsonb } from "drizzle-orm/pg-core";
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  telefone: text("telefone"),
  empresa: text("empresa"),
  mensagem: text("mensagem").notNull(),
  ficheiros: text("ficheiros").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  preco: text("preco").notNull(),
  imagem: text("imagem").notNull(),
  categoria: text("categoria").notNull(),
  destaque: boolean("destaque").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  categoria: text("categoria").notNull(),
  imagem: text("imagem").notNull(), // Imagem principal (compatibilidade)
  imagens: text("imagens").array().default([]), // Galeria de imagens
  tipoGaleria: text("tipo_galeria").default("single"), // single, slide, grid, before-after
  data: timestamp("data").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const slides = pgTable("slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  image: text("image").notNull(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  order_position: text("order_position").default("1"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pageConfigs = pgTable("page_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: text("service_id").notNull().unique(), // design-grafico, impressao-digital, etc.
  images: jsonb("images").notNull(), // Array de { src, alt, title }
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  numeroEncomenda: text("numero_encomenda").notNull().unique(),
  
  // Dados do cliente
  clienteNome: text("cliente_nome").notNull(),
  clienteEmail: text("cliente_email").notNull(),
  clienteTelefone: text("cliente_telefone"),
  clienteMorada: text("cliente_morada").notNull(),
  clienteCodigoPostal: text("cliente_codigo_postal").notNull(),
  clienteCidade: text("cliente_cidade").notNull(),
  clienteNIF: text("cliente_nif"),
  
  // Itens da encomenda (JSON array com os produtos)
  itens: jsonb("itens").notNull(), // Array de CartItem
  
  // Totais
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  envio: decimal("envio", { precision: 10, scale: 2 }).notNull(),
  iva: decimal("iva", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Estado da encomenda
  estado: text("estado").notNull().default("pendente"), // pendente, paga, processando, enviada, entregue, cancelada
  
  // Dados de pagamento
  metodoPagamento: text("metodo_pagamento").notNull(), // mbway, multibanco, payshop, creditcard
  estadoPagamento: text("estado_pagamento").notNull().default("pendente"), // pendente, pago, falhado
  referenciaIfthenpay: text("referencia_ifthenpay"), // Reference/ID from IfthenPay
  dadosPagamento: jsonb("dados_pagamento"), // Payment details from IfthenPay
  
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

export const insertContactSchema = createInsertSchema(contacts).pick({
  nome: true,
  email: true,
  telefone: true,
  empresa: true,
  mensagem: true,
  ficheiros: true,
}).extend({
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

export const insertNewsSchema = createInsertSchema(news).pick({
  titulo: true,
  descricao: true,
  categoria: true,
  imagem: true,
  imagens: true,
  tipoGaleria: true,
  data: true,
}).extend({
  data: z.string().optional(),
  imagem: z.string().optional(),
  imagens: z.array(z.string()).optional().default([]),
  tipoGaleria: z.enum(["single", "slide", "grid", "before-after"]).optional().default("single"),
});

export const insertSlideSchema = createInsertSchema(slides).pick({
  image: true,
  title: true,
  text: true,
  order_position: true,
  active: true,
});

export const insertPageConfigSchema = createInsertSchema(pageConfigs).pick({
  page: true,
  section: true,
  element: true,
  type: true,
  value: true,
  defaultValue: true,
  metadata: true,
}).extend({
  page: z.string().min(1, "Página é obrigatória"),
  section: z.string().min(1, "Secção é obrigatória"),
  element: z.string().min(1, "Elemento é obrigatório"),
  type: z.enum(["text", "color", "size", "image", "number"], {
    errorMap: () => ({ message: "Tipo deve ser: text, color, size, image ou number" })
  }),
  value: z.string().min(1, "Valor é obrigatório"),
  defaultValue: z.string().optional(),
  metadata: z.string().optional(),
});

export const insertServiceGallerySchema = createInsertSchema(serviceGalleries).pick({
  serviceId: true,
  images: true,
}).extend({
  serviceId: z.string().min(1, "ID do serviço é obrigatório"),
  images: z.array(z.object({
    src: z.string().min(1, "URL da imagem é obrigatória"),
    alt: z.string(),
    title: z.string(),
  })).min(1, "Deve ter pelo menos uma imagem"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
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
}).extend({
  clienteNome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clienteEmail: z.string().email("Email inválido"),
  clienteMorada: z.string().min(5, "Morada deve ter pelo menos 5 caracteres"),
  clienteCodigoPostal: z.string().min(8, "Código postal inválido"),
  clienteCidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  clienteTelefone: z.string().optional(),
  clienteNIF: z.string().optional(),
  estado: z.enum(["pendente", "paga", "processando", "enviada", "entregue", "cancelada"]).default("pendente"),
  metodoPagamento: z.enum(["mbway", "multibanco", "payshop", "creditcard"]),
  estadoPagamento: z.enum(["pendente", "pago", "falhado"]).default("pendente"),
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
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
