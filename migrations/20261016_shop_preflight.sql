-- Diagnóstico apenas de leitura. Não mostra passwords nem dados de clientes.
BEGIN TRANSACTION READ ONLY;
SELECT current_database() AS base_de_dados,
       to_regclass('orders') AS pedidos_site,
       to_regclass('service_sections') AS paginas_servicos,
       to_regclass('pedidos') AS pedidos_calculadora,
       to_regclass('shop_categories') AS categorias_loja,
       to_regclass('shop_products') AS produtos_loja,
       to_regclass('shop_settings') AS precos_loja;
SELECT CASE WHEN EXISTS (
 SELECT 1 FROM pg_attribute WHERE attrelid = to_regclass('orders')
 AND attname = 'numero_encomenda' AND NOT attisdropped
) THEN 'Esquema de encomendas do site principal identificado.'
ELSE 'PARAR: confirmar a base do site principal antes de instalar o catálogo.' END AS verificacao;
COMMIT;
