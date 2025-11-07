import { type User, type InsertUser, type UpsertUser, type Contact, type InsertContact, type Product, type InsertProduct, type News, type InsertNews, type Slide, type InsertSlide, type PageConfig, type InsertPageConfig, type Order, type InsertOrder, type ServiceGallery, type InsertServiceGallery, users, contacts, products, news, slides, pageConfigs, orders, serviceGalleries } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getAllContacts(): Promise<Contact[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  updateProduct(id: string, product: InsertProduct): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  getRecentNews(): Promise<News[]>;
  getAllNews(): Promise<News[]>;
  updateNews(id: string, news: InsertNews): Promise<News>;
  deleteNews(id: string): Promise<boolean>;
  createProduct(product: InsertProduct): Promise<Product>;
  createNews(news: InsertNews): Promise<News>;
  getSlides(): Promise<Slide[]>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: string, slide: InsertSlide): Promise<Slide>;
  deleteSlide(id: string): Promise<boolean>;
  getPageConfigs(page?: string): Promise<PageConfig[]>;
  getPageConfig(page: string, section: string, element: string): Promise<PageConfig | undefined>;
  createPageConfig(config: InsertPageConfig): Promise<PageConfig>;
  updatePageConfig(id: string, config: InsertPageConfig): Promise<PageConfig>;
  deletePageConfig(id: string): Promise<boolean>;
  upsertPageConfig(config: InsertPageConfig): Promise<PageConfig>;
  // Orders management
  createOrder(order: InsertOrder): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByNumber(numeroEncomenda: string): Promise<Order | undefined>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  updateOrderStatus(id: string, estado: string, estadoPagamento?: string): Promise<Order>;
  deleteOrder(id: string): Promise<boolean>;
  // Service galleries management
  getServiceGallery(serviceId: string): Promise<ServiceGallery | undefined>;
  getAllServiceGalleries(): Promise<ServiceGallery[]>;
  upsertServiceGallery(gallery: InsertServiceGallery): Promise<ServiceGallery>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private products: Map<string, Product>;
  private news: Map<string, News>;
  private slides: Map<string, Slide>;
  private pageConfigs: Map<string, PageConfig>;
  private orders: Map<string, Order>;
  private serviceGalleries: Map<string, ServiceGallery>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.products = new Map();
    this.news = new Map();
    this.slides = new Map();
    this.pageConfigs = new Map();
    this.orders = new Map();
    this.serviceGalleries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async upsertUser(insertUser: UpsertUser): Promise<User> {
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.id === insertUser.id,
    );
    if (existingUser) {
      const updatedUser: User = { 
        ...existingUser, 
        email: insertUser.email ?? null,
        firstName: insertUser.firstName ?? null,
        lastName: insertUser.lastName ?? null,
        profileImageUrl: insertUser.profileImageUrl ?? null,
        updatedAt: new Date() 
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const user: User = { 
        id: insertUser.id || randomUUID(),
        email: insertUser.email ?? null,
        firstName: insertUser.firstName ?? null,
        lastName: insertUser.lastName ?? null,
        profileImageUrl: insertUser.profileImageUrl ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(user.id, user);
      return user;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date(),
      telefone: insertContact.telefone ?? null,
      empresa: insertContact.empresa ?? null,
      ficheiros: insertContact.ficheiros ?? null
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(product => product.destaque)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...product,
      id,
      destaque: product.destaque ?? existingProduct.destaque
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getRecentNews(): Promise<News[]> {
    return Array.from(this.news.values())
      .sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime())
      .slice(0, 6);
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values())
      .sort((a, b) => new Date(b.data || 0).getTime() - new Date(a.data || 0).getTime());
  }

  async updateNews(id: string, newsItem: InsertNews): Promise<News> {
    const existingNews = this.news.get(id);
    if (!existingNews) {
      throw new Error(`News with id ${id} not found`);
    }
    
    const updatedNews: News = {
      ...existingNews,
      ...newsItem,
      id,
      data: newsItem.data ?? existingNews.data
    };
    
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<boolean> {
    return this.news.delete(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = { ...product, id, createdAt: new Date(), destaque: product.destaque ?? false };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const id = randomUUID();
    const newNews: News = { ...newsItem, id, createdAt: new Date(), data: newsItem.data ?? new Date() };
    this.news.set(id, newNews);
    return newNews;
  }

  async getSlides(): Promise<Slide[]> {
    return Array.from(this.slides.values())
      .filter(slide => slide.active)
      .sort((a, b) => parseInt(a.order_position || "1") - parseInt(b.order_position || "1"));
  }

  async createSlide(slide: InsertSlide): Promise<Slide> {
    const id = randomUUID();
    const newSlide: Slide = { 
      ...slide, 
      id, 
      createdAt: new Date(),
      order_position: slide.order_position ?? "1",
      active: slide.active ?? true
    };
    this.slides.set(id, newSlide);
    return newSlide;
  }

  async updateSlide(id: string, slide: InsertSlide): Promise<Slide> {
    const existingSlide = this.slides.get(id);
    if (!existingSlide) {
      throw new Error(`Slide with id ${id} not found`);
    }
    
    const updatedSlide: Slide = {
      ...existingSlide,
      ...slide,
      id,
      order_position: slide.order_position ?? existingSlide.order_position,
      active: slide.active ?? existingSlide.active
    };
    
    this.slides.set(id, updatedSlide);
    return updatedSlide;
  }

  async deleteSlide(id: string): Promise<boolean> {
    return this.slides.delete(id);
  }

  async getPageConfigs(page?: string): Promise<PageConfig[]> {
    const configs = Array.from(this.pageConfigs.values());
    return page ? configs.filter(config => config.page === page) : configs;
  }

  async getPageConfig(page: string, section: string, element: string): Promise<PageConfig | undefined> {
    return Array.from(this.pageConfigs.values()).find(
      config => config.page === page && config.section === section && config.element === element
    );
  }

  async createPageConfig(config: InsertPageConfig): Promise<PageConfig> {
    const id = randomUUID();
    const newConfig: PageConfig = { 
      ...config, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      defaultValue: config.defaultValue ?? null,
      metadata: config.metadata ?? null
    };
    this.pageConfigs.set(id, newConfig);
    return newConfig;
  }

  async updatePageConfig(id: string, config: InsertPageConfig): Promise<PageConfig> {
    const existingConfig = this.pageConfigs.get(id);
    if (!existingConfig) {
      throw new Error(`PageConfig with id ${id} not found`);
    }
    
    const updatedConfig: PageConfig = {
      ...existingConfig,
      ...config,
      id,
      updatedAt: new Date(),
      defaultValue: config.defaultValue ?? existingConfig.defaultValue,
      metadata: config.metadata ?? existingConfig.metadata
    };
    
    this.pageConfigs.set(id, updatedConfig);
    return updatedConfig;
  }

  async deletePageConfig(id: string): Promise<boolean> {
    return this.pageConfigs.delete(id);
  }

  async upsertPageConfig(config: InsertPageConfig): Promise<PageConfig> {
    const existingConfig = await this.getPageConfig(config.page, config.section, config.element);
    
    if (existingConfig) {
      return await this.updatePageConfig(existingConfig.id, config);
    } else {
      return await this.createPageConfig(config);
    }
  }

  // Orders methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      dataPagamento: null,
      dataEnvio: null,
      dataEntrega: null,
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(numeroEncomenda: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.numeroEncomenda === numeroEncomenda);
  }

  async updateOrder(id: string, orderData: Partial<InsertOrder>): Promise<Order> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    const updatedOrder: Order = {
      ...existingOrder,
      ...orderData,
      id,
      updatedAt: new Date(),
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderStatus(id: string, estado: string, estadoPagamento?: string): Promise<Order> {
    const updateData: Partial<InsertOrder> = { estado };
    if (estadoPagamento) {
      updateData.estadoPagamento = estadoPagamento;
      if (estadoPagamento === "pago") {
        updateData.dataPagamento = new Date();
      }
    }
    if (estado === "enviada") {
      updateData.dataEnvio = new Date();
    }
    if (estado === "entregue") {
      updateData.dataEntrega = new Date();
    }
    
    return await this.updateOrder(id, updateData);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Service galleries methods
  async getServiceGallery(serviceId: string): Promise<ServiceGallery | undefined> {
    return Array.from(this.serviceGalleries.values()).find(
      gallery => gallery.serviceId === serviceId
    );
  }

  async getAllServiceGalleries(): Promise<ServiceGallery[]> {
    return Array.from(this.serviceGalleries.values());
  }

  async upsertServiceGallery(insertGallery: InsertServiceGallery): Promise<ServiceGallery> {
    const existingGallery = await this.getServiceGallery(insertGallery.serviceId);
    
    if (existingGallery) {
      const updatedGallery: ServiceGallery = {
        ...existingGallery,
        ...insertGallery,
        updatedAt: new Date(),
      };
      this.serviceGalleries.set(existingGallery.id, updatedGallery);
      return updatedGallery;
    } else {
      const id = randomUUID();
      const newGallery: ServiceGallery = {
        ...insertGallery,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.serviceGalleries.set(id, newGallery);
      return newGallery;
    }
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.destaque, true)).orderBy(desc(products.createdAt));
  }

  async getRecentNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.data)).limit(3);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const [updatedProduct] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.data));
  }

  async updateNews(id: string, newsData: InsertNews): Promise<News> {
    const [updatedNews] = await db.update(news).set(newsData).where(eq(news.id, id)).returning();
    return updatedNews;
  }

  async deleteNews(id: string): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getSlides(): Promise<Slide[]> {
    return await db.select().from(slides).where(eq(slides.active, true)).orderBy(slides.order_position);
  }

  async createSlide(slide: InsertSlide): Promise<Slide> {
    const [newSlide] = await db.insert(slides).values(slide).returning();
    return newSlide;
  }

  async updateSlide(id: string, slide: InsertSlide): Promise<Slide> {
    const [updatedSlide] = await db.update(slides).set(slide).where(eq(slides.id, id)).returning();
    return updatedSlide;
  }

  async deleteSlide(id: string): Promise<boolean> {
    const result = await db.delete(slides).where(eq(slides.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getPageConfigs(page?: string): Promise<PageConfig[]> {
    if (page) {
      return await db.select().from(pageConfigs).where(eq(pageConfigs.page, page));
    }
    return await db.select().from(pageConfigs);
  }

  async getPageConfig(page: string, section: string, element: string): Promise<PageConfig | undefined> {
    const [config] = await db.select().from(pageConfigs)
      .where(and(
        eq(pageConfigs.page, page),
        eq(pageConfigs.section, section),
        eq(pageConfigs.element, element)
      ));
    return config;
  }

  async createPageConfig(config: InsertPageConfig): Promise<PageConfig> {
    const [newConfig] = await db.insert(pageConfigs).values(config).returning();
    return newConfig;
  }

  async updatePageConfig(id: string, config: InsertPageConfig): Promise<PageConfig> {
    const [updatedConfig] = await db.update(pageConfigs).set({
      ...config,
      updatedAt: new Date()
    }).where(eq(pageConfigs.id, id)).returning();
    return updatedConfig;
  }

  async deletePageConfig(id: string): Promise<boolean> {
    const result = await db.delete(pageConfigs).where(eq(pageConfigs.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async upsertPageConfig(config: InsertPageConfig): Promise<PageConfig> {
    const existingConfig = await this.getPageConfig(config.page, config.section, config.element);
    
    if (existingConfig) {
      return await this.updatePageConfig(existingConfig.id, config);
    } else {
      return await this.createPageConfig(config);
    }
  }

  // Orders methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByNumber(numeroEncomenda: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.numeroEncomenda, numeroEncomenda));
    return order;
  }

  async updateOrder(id: string, orderData: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db.update(orders).set({
      ...orderData,
      updatedAt: new Date()
    }).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  async updateOrderStatus(id: string, estado: string, estadoPagamento?: string): Promise<Order> {
    const updateData: any = { 
      estado,
      updatedAt: new Date()
    };
    
    if (estadoPagamento) {
      updateData.estadoPagamento = estadoPagamento;
      if (estadoPagamento === "pago") {
        updateData.dataPagamento = new Date();
      }
    }
    if (estado === "enviada") {
      updateData.dataEnvio = new Date();
    }
    if (estado === "entregue") {
      updateData.dataEntrega = new Date();
    }
    
    const [updatedOrder] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Service galleries methods
  async getServiceGallery(serviceId: string): Promise<ServiceGallery | undefined> {
    const [gallery] = await db.select().from(serviceGalleries).where(eq(serviceGalleries.serviceId, serviceId));
    return gallery;
  }

  async getAllServiceGalleries(): Promise<ServiceGallery[]> {
    return await db.select().from(serviceGalleries);
  }

  async upsertServiceGallery(insertGallery: InsertServiceGallery): Promise<ServiceGallery> {
    const [gallery] = await db
      .insert(serviceGalleries)
      .values(insertGallery)
      .onConflictDoUpdate({
        target: serviceGalleries.serviceId,
        set: {
          images: insertGallery.images,
          updatedAt: new Date(),
        },
      })
      .returning();
    return gallery;
  }
}

// Use database storage for production
export const storage = new DatabaseStorage();
