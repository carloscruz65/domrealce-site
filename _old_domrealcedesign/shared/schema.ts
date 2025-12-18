import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  imagem: text("imagem").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
  data: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
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
