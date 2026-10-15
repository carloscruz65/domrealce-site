BEGIN;
CREATE TABLE IF NOT EXISTS shop_categories (
 id varchar PRIMARY KEY, name text NOT NULL, slug text NOT NULL UNIQUE, description text NOT NULL DEFAULT '',
 image text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS shop_products (
 id varchar PRIMARY KEY, category_id varchar NOT NULL REFERENCES shop_categories(id), name text NOT NULL,
 slug text NOT NULL UNIQUE, description text NOT NULL DEFAULT '', specifications text NOT NULL DEFAULT '',
 image text NOT NULL DEFAULT '', price_cents integer NOT NULL CHECK(price_cents > 0),
 minimum_quantity integer NOT NULL DEFAULT 1 CHECK(minimum_quantity > 0),
 quantity_step integer NOT NULL DEFAULT 1 CHECK(quantity_step > 0),
 unit text NOT NULL DEFAULT 'unidade' CHECK(unit IN ('unidade','conjunto')),
 published boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS shop_settings (id text PRIMARY KEY, config jsonb NOT NULL);
COMMIT;
