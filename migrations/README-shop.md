# Catálogo da loja DOMREALCE

Esta atualização pertence a `carloscruz65/domrealce-site` (site principal). Não altera a calculadora em `domrealce-impressao` nem implementa o desconto profissional da calculadora.

## O que muda

- Admin → **Loja**: criar/editar categorias e produtos compráveis, publicar ou guardar em rascunho, fotografias por upload ou URL, material/medidas em texto, unidade/conjunto, preço líquido, quantidade mínima e incremento.
- Admin → **Destaques**: os cartões de apresentação existentes continuam separados do catálogo de compra.
- Categorias e produtos têm endereços públicos `/loja/categoria/:slug` e `/loja/produto/:slug`. Pode utilizar o endereço de um produto num botão/cartão da página de serviços.
- Novos produtos utilizam o carrinho e checkout existentes do site. Não passam pela calculadora.
- Despublicar um produto ou a sua categoria impede novas compras. O registo dos pedidos anteriores mantém os dados e os preços da compra.
- Admin → **Loja → Preços e portes**: centraliza preços de canvas, papel de parede, laminação, portes e limiar de envio gratuito.
- Preços base iniciais preservados: papel de parede 20 €/m², laminação 8 €/m², canvas 15/25/35/50/70/90/120/150 €, portes 10 €, portes grátis desde 100 € líquidos, levantamento gratuito. IVA de 23% aplicado uma única vez, incluindo portes. Os valores são em euros sem IVA no admin.
- Corrige canvas cujo IVA era somado ao preço unitário e novamente ao total; carrinhos antigos são recalculados. A lista de preços anunciados passa a usar a mesma tabela do servidor. As dimensões passam a coincidir com os nomes dos oito tamanhos.
- O servidor valida disponibilidade e quantidades e ignora preços, nomes e fotografias enviados pelo navegador para os novos produtos. Se o total mudar antes da criação do pedido, recusa o pedido até o cliente rever o preço; aplica-se a MB WAY/Multibanco e PayPal.
- A proteção global `/api/admin` é registada antes de todas as rotas administrativas. A aplicação já tinha proteção global; esta atualização uniformiza a ordem de registo, não substitui o login.

## Instalar primeiro num ambiente de teste

1. Criar uma cópia/branch de teste da base PostgreSQL **do site principal**. Não reutilizar a base de teste da calculadora sem confirmar a origem: são aplicações diferentes.
2. Aplicar apenas `migrations/20261015_shop_catalog.sql` nessa cópia, por exemplo `psql "$DATABASE_URL_TEST" -v ON_ERROR_STOP=1 -f migrations/20261015_shop_catalog.sql`. Nunca colocar credenciais no GitHub ou em mensagens.
3. Publicar esta branch num ambiente isolado com essa base e armazenamento de imagens de teste. A autenticação continua dependente da configuração Replit existente; testar o acesso com uma conta administrativa autorizada.
4. Criar uma categoria e um produto em rascunho. Verificar foto, preço, descrição, medidas, unidade/conjunto e quantidades antes de publicar no ambiente de teste.
5. Verificar o percurso em telemóvel e computador: loja → categoria → produto → carrinho → checkout. Testar carrinho misto com canvas/papel de parede, portes e levantamento, indisponibilidade, mudança de preço e preservação dos pedidos antigos.
6. Validar pagamentos/webhooks apenas com credenciais e configuração de sandbox dos fornecedores. Esta atualização não introduz um interruptor universal de pagamentos de teste. Não efetuar cobranças reais para validar.
7. Depois da revisão e aprovação, fazer backup da base real, aplicar a migração do catálogo à base do site principal e publicar a mesma versão. A migração é aditiva e repetível; não cria categorias, produtos ou encomendas de exemplo. Reverter o código não exige apagar as tabelas novas.

A migração tem de estar aplicada **antes de publicar o código**: a consulta de preços e a criação de pedidos passam a consultar o novo catálogo, mesmo para produtos antigos.

## Verificação

```sh
npm ci --ignore-scripts --no-audit --no-fund
node --import tsx --test tests/shop*.test.ts
npm run build
npm run check
```

Os testes incluem preços/IVA/portes, quantidades inválidas, mínimo/incrementos, rascunhos, categorias retiradas, validação de dados, autenticação administrativa em produção, CRUD HTTP, e as rotas reais de criação de pedidos e PayPal com serviços externos simulados. Não contactam bancos, PayPal, SMTP ou bases reais.

O percurso do admin e da compra foi também verificado num navegador em 1280 × 900 e 390 × 844, com API e imagens simuladas: criação de categoria/produto, gravação de preços, navegação até ao checkout, mínimo/incremento 3/2 e total de 30,75 € para 5 conjuntos de 5 € líquidos. Os exemplos existem apenas nos testes locais.

Na preparação desta branch, a migração e o CRUD Drizzle foram também exercitados com PostgreSQL temporário (PGlite): migração repetida, leitura e alteração de preços, settings upsert, unicidade, chave estrangeira, preço positivo e preservação de um pedido anterior.

`npm run check` já falha na base `1de2d81722cda64c2ce043aa5a2c5f6db1dd2e15`: existem 63 diagnósticos TypeScript anteriores, em autenticação/analytics, storage e componentes do editor/notícias. A comparação da alteração não acrescenta diagnósticos. O build de produção e os testes devem passar; não interpretar o build como resolução dos erros TypeScript anteriores.

## Limites desta entrega

Não migra as bibliotecas antigas de papel de parede/canvas para o novo gestor de artigos: as páginas e pastas existentes continuam disponíveis. Não implementa stock, variantes com preços próprios ou descontos de revenda no site principal. Produtos com diferentes materiais ou medidas e preços distintos podem ser criados como artigos separados. A modernização do editor geral da homepage/serviços é uma fase separada; esta entrega resolve a gestão do catálogo comprável.
