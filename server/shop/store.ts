import { randomUUID } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  shopCategories,
  shopProducts,
  shopSettings,
} from "../../shared/schema";
import {
  DEFAULT_SHOP_SETTINGS,
  settingsInput,
  type ShopCatalog,
  type CategoryInput,
  type ProductInput,
  type ShopSettings,
} from "../../shared/shop-catalog";

export interface CatalogStore {
  getCatalog(): Promise<ShopCatalog>;
  saveCategory(id: string | null, input: CategoryInput): Promise<unknown>;
  saveProduct(id: string | null, input: ProductInput): Promise<unknown>;
  saveSettings(input: ShopSettings): Promise<void>;
}
export const catalogStore: CatalogStore = {
  async getCatalog() {
    const [categories, products, settings] = await Promise.all([
      db
        .select()
        .from(shopCategories)
        .orderBy(asc(shopCategories.position), asc(shopCategories.name)),
      db
        .select()
        .from(shopProducts)
        .orderBy(asc(shopProducts.position), asc(shopProducts.name)),
      db.select().from(shopSettings).where(eq(shopSettings.id, "main")),
    ]);
    return {
      categories,
      products,
      settings: settings.length
        ? settingsInput.parse(settings[0].config)
        : DEFAULT_SHOP_SETTINGS,
    };
  },
  async saveCategory(id, input) {
    const rows = id
      ? await db
          .update(shopCategories)
          .set(input)
          .where(eq(shopCategories.id, id))
          .returning()
      : await db
          .insert(shopCategories)
          .values({ id: randomUUID(), ...input })
          .returning();
    return rows[0];
  },
  async saveProduct(id, input) {
    const rows = id
      ? await db
          .update(shopProducts)
          .set(input)
          .where(eq(shopProducts.id, id))
          .returning()
      : await db
          .insert(shopProducts)
          .values({ id: randomUUID(), ...input })
          .returning();
    return rows[0];
  },
  async saveSettings(config) {
    await db
      .insert(shopSettings)
      .values({ id: "main", config })
      .onConflictDoUpdate({ target: shopSettings.id, set: { config } });
  },
};
