# Catálogo da loja DOMREALCE

Esta atualização pertence a `carloscruz65/domrealce-site` (site principal). Não altera a calculadora em `domrealce-impressao` nem implementa o desconto profissional da calculadora.

## O que muda

- Admin → **Loja**: criar/editar categorias e produtos compráveis, publicar ou guardar em rascunho, fotografias por upload ou URL, material/medidas em texto, unidade/conjunto, preço líquido, quantidade mínima e incremento.
- Admin → **Destaques**: os cartões de apresentação existentes continuam separados do catálogo de compra.
- O botão **Copiar ligação** copia o endereço público para utilizar em cartões, botões ou mensagens. A ligação só fica disponível quando o artigo e a categoria estão publicados.
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
2. Executar primeiro `migrations/20261016_shop_preflight.sql` (apenas leitura) e confirmar o esquema do site principal. Depois aplicar apenas `migrations/20261015_shop_catalog.sql` nessa cópia, por exemplo `psql "$DATABASE_URL_TEST" -v ON_ERROR_STOP=1 -f migrations/20261015_shop_catalog.sql`. Nunca colocar credenciais no GitHub ou em mensagens.
3. Publicar esta branch num ambiente isolado com essa base e armazenamento de imagens de teste. A autenticação continua dependente da configuração Replit existente; testar o acesso com uma conta administrativa autorizada.
4. Criar uma categoria e um produto em rascunho. Verificar foto, preço, descrição, medidas, unidade/conjunto e quantidades antes de publicar no ambiente de teste.
5. Verificar o percurso em telemóvel e computador: loja → categoria → produto → carrinho → checkout. Testar carrinho misto com canvas/papel de parede, portes e levantamento, indisponibilidade, mudança de preço e preservação dos pedidos antigos.
6. Validar pagamentos/webhooks apenas com credenciais e configuração de sandbox dos fornecedores. Esta atualização não introduz um interruptor universal de pagamentos de teste. Não efetuar cobranças reais para validar.
7. Depois da revisão e aprovação, fazer backup da base real, aplicar a migração do catálogo à base do site principal e publicar a mesma versão. A migração é aditiva e repetível; não cria categorias, produtos ou encomendas de exemplo. Reverter o código não exige apagar as tabelas novas.

A migração tem de estar aplicada **antes de ativar os novos produtos no admin**. Sem nenhuma das tabelas novas, as páginas públicas e o checkout continuam a aceitar canvas/papel de parede com a tabela anterior. O admin do novo catálogo fica indisponível até à instalação. Falhas de ligação, tabelas parcialmente instaladas ou dados inválidos continuam a falhar; não se substituem preços existentes por preços por omissão nesses casos. Nenhuma tabela é criada automaticamente.

A migração confirma `orders.numero_encomenda` antes de criar tabelas e recusa uma base da calculadora. Esta verificação complementa a confirmação humana da ligação e não substitui o backup.

## Verificação

```sh
npm ci --ignore-scripts --no-audit --no-fund
node --import tsx --test tests/shop*.test.ts
npm run build
npm run check
```

Os testes do catálogo incluem migração repetível com PostgreSQL temporário/PGlite, recusa da base incorreta, instalação gradual sem interromper a loja antiga, falhas de ligação e instalações parciais, além de preços/IVA/portes, quantidades inválidas, mínimo/incrementos, rascunhos, categorias retiradas, validação de dados, autenticação administrativa em produção, CRUD HTTP, e as rotas reais de criação de pedidos e PayPal com serviços externos simulados. Não contactam bancos, PayPal, SMTP ou bases reais.

O percurso do admin e da compra foi também verificado num navegador em 1280 × 900 e 390 × 844, com API e imagens simuladas: criação de categoria/produto, gravação de preços, navegação até ao checkout, mínimo/incremento 3/2 e total de 30,75 € para 5 conjuntos de 5 € líquidos. Os exemplos existem apenas nos testes locais.

Na preparação desta branch, a migração e o CRUD Drizzle foram também exercitados com PostgreSQL temporário (PGlite): migração repetida, leitura e alteração de preços, settings upsert, unicidade, chave estrangeira, preço positivo e preservação de um pedido anterior.

`npm run check` já falha na base `1de2d81722cda64c2ce043aa5a2c5f6db1dd2e15`: existem 63 diagnósticos TypeScript anteriores, em autenticação/analytics, storage e componentes do editor/notícias. A comparação da alteração não acrescenta diagnósticos. O build de produção e os testes devem passar; não interpretar o build como resolução dos erros TypeScript anteriores.

## Limites desta entrega

Não migra as bibliotecas antigas de papel de parede/canvas para o novo gestor de artigos: as páginas e pastas existentes continuam disponíveis. Não implementa stock, variantes com preços próprios ou descontos de revenda no site principal. Produtos com diferentes materiais ou medidas e preços distintos podem ser criados como artigos separados. A modernização do editor geral da homepage/serviços é uma fase separada; esta entrega resolve a gestão do catálogo comprável.


## Situação da publicação (16/10/2026)

Versão revista em `codex/admin-loja-catalogo`, PR 1. A main do GitHub está em `1de2d81722cda64c2ce043aa5a2c5f6db1dd2e15`. O utilizador guardou os seis commits do Replit em `backup/replit-site-20261016`, SHA `a90944602d6808f0ce50143e65d9e76889fefd94`.

A versão integrada mantém as alterações de impressão digital e partilha social do Replit, migrando os textos nacionais sem referências a Lisboa da main para o novo mapa partilhado de SEO. O commit de integração conserva ambos os históricos. Os ficheiros de metadados e a imagem de verificação da cópia do Replit são preservados sem alterações.

Validação da integração: 24 testes passam (23 do catálogo/base e um teste de metadados sociais que percorre as páginas com cinco bots, URLs individuais, CMS/fallback e notícias por ID/slug). O build passa. O TypeScript mantém os 63 diagnósticos anteriores, sem novos diagnósticos nos ficheiros integrados.

O conector identifica o site publicado como `DomrealceDesign` (`3bf90cb8-837d-49dd-b68d-11cd7e048610`), em `https://domrealce.com`, com estado success. Não foram alterados a main, a base real ou o deployment do Replit. Falta identificar/copiar a base do site principal, aplicar o diagnóstico e a migração na cópia e validar login, upload no Object Storage e pagamentos/webhooks sandbox antes da publicação.


## Personalização por produto (16/10/2026)

O campo `personalizationLabel` define o nome de uma resposta obrigatória do cliente (ex.: Número do alvará). Vazio desativa a opção. O texto é guardado como parte do artigo no JSON da encomenda, com o nome do campo definido pelo servidor; mudar o produto depois não altera pedidos anteriores. Mantém zeros iniciais e aceita até 200 caracteres numa linha. O mesmo produto adicionado duas vezes conserva linhas separadas, incluindo personalizações diferentes.

Aplicar `migrations/20261016_shop_personalization.sql` às bases de desenvolvimento e produção antes de publicar esta versão. Acrescenta apenas `shop_products.personalization_label`, com valor vazio para produtos existentes. Não altera preços, encomendas nem pagamentos. O admin permite editar o nome do campo; o cliente preenche-o na página do produto e confirma-o no carrinho e no checkout. O admin mostra a resposta nos detalhes da encomenda. Para mudar o texto antes de comprar, retirar a linha e voltar a adicionar o produto com o novo texto.

Testes: validação obrigatória também nos endpoints reais de pedidos e PayPal com serviços externos simulados; preservação do texto e do nome do campo na encomenda; rejeição de texto inválido e de rótulos falsificados; linhas distintas; migração repetida e persistência PostgreSQL/PGlite. Nenhum pagamento real é iniciado pelos testes.
