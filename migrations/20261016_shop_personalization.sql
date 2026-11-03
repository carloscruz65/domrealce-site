-- Executar antes de publicar o código da personalização. Preserva produtos e pedidos existentes.
ALTER TABLE shop_products
 ADD COLUMN IF NOT EXISTS personalization_label text NOT NULL DEFAULT '';
