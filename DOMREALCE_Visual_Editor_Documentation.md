# DOMREALCE - Manual do Editor Visual
**Sistema Avançado de Edição de Conteúdo Web**

---

## 📋 Índice

1. [Introdução](#introdução)
2. [Acesso ao Sistema](#acesso-ao-sistema)
3. [Interface do Editor](#interface-do-editor)
4. [Edição de Páginas](#edição-de-páginas)
5. [Upload de Imagens](#upload-de-imagens)
6. [Publicação de Conteúdo](#publicação-de-conteúdo)
7. [Edição Inline (Páginas Públicas)](#edição-inline)
8. [Funcionalidades Avançadas](#funcionalidades-avançadas)
9. [Resolução de Problemas](#resolução-de-problemas)
10. [Melhores Práticas](#melhores-práticas)

---

## 🎯 Introdução

O Sistema de Edição Visual da DOMREALCE é uma plataforma avançada que permite editar o conteúdo do website de forma intuitiva e em tempo real. Este sistema oferece duas formas principais de edição:

- **Editor Visual Centralizado**: Interface administrativa completa em `/admin/editor`
- **Edição Inline**: Edição direta nas páginas públicas (funcionalidade avançada)

### ✨ Características Principais

- ✅ **Edição em Tempo Real**: Mudanças visíveis imediatamente
- ✅ **Upload de Imagens**: Suporte para arquivos e URLs
- ✅ **Sincronização Automática**: Entre sistema administrativo e páginas públicas
- ✅ **Interface Intuitiva**: Fácil de usar, sem conhecimentos técnicos
- ✅ **Persistência Segura**: Dados guardados em base de dados PostgreSQL
- ✅ **Responsive Design**: Funciona em desktop, tablet e móvel

---

## 🔐 Acesso ao Sistema

### URL de Acesso
```
https://domrealce.com/admin/editor
```

### Páginas Disponíveis para Edição

| Página | Rota | Descrição |
|--------|------|-----------|
| **Página Inicial** | `/` | Homepage principal do site |
| **Sobre Nós** | `/sobre` | Informações sobre a empresa |
| **Serviços** | `/servicos` | Lista de serviços oferecidos |
| **Portfólio** | `/portfolio` | Galeria de trabalhos realizados |
| **Contactos** | `/contactos` | Informações de contacto |
| **Loja Online** | `/loja` | E-commerce da empresa |

---

## 🖥️ Interface do Editor

### Layout Principal

A interface do editor está dividida em várias secções principais:

#### 📍 Barra Superior (Header)
- **Logo DOMREALCE**: Ligação para voltar ao site principal
- **Navegação**: Links para todas as secções do site
- **Carrinho**: Acesso direto à loja online

#### 🎛️ Painel de Controlo
- **Dashboard**: Botão para voltar ao painel principal
- **Refazer/Desfazer**: Controlos de histórico de edições
- **Guardar**: Guardar como rascunho
- **Publicar**: Publicar mudanças ao vivo

#### 📝 Área de Edição
- **Selector de Página**: Dropdown para escolher que página editar
- **Botão Preview**: Visualizar mudanças antes de publicar
- **Formulários de Edição**: Campos específicos para cada tipo de conteúdo

---

## ✏️ Edição de Páginas

### 1. Seleccionar Página para Editar

1. **Abrir o Editor**: Navegar para `/admin/editor`
2. **Escolher Página**: No dropdown "Página", seleccionar a página desejada
   - Página Inicial
   - Sobre Nós  
   - Serviços
   - Portfólio
   - Contactos
   - Loja Online

### 2. Tipos de Conteúdo Editável

#### 🏆 Hero Banner (Secção Principal)
- **Título**: Título principal da página
- **Subtítulo**: Descrição secundária
- **Descrição**: Texto descritivo mais longo
- **Imagem de Fundo**: Imagem de fundo da secção

#### 📝 Blocos de Texto
- **Títulos**: Títulos de secções
- **Parágrafos**: Conteúdo textual
- **Descrições**: Textos descritivos

#### 🖼️ Elementos Visuais
- **Imagens**: Upload ou URL de imagens
- **Galerias**: Colecções de imagens
- **Ícones**: Elementos decorativos

### 3. Como Editar Conteúdo

#### ✏️ Edição de Texto
1. **Localizar Campo**: Encontrar o campo de texto que quer editar
2. **Clicar para Editar**: Clicar no campo de texto
3. **Inserir Conteúdo**: Digitar o novo conteúdo
4. **Guardar**: O conteúdo é guardado automaticamente

#### 🎨 Personalização de Estilo
- **Cores**: Personalizar cores de texto e fundo
- **Tipografia**: Ajustar tamanhos e tipos de letra
- **Espaçamento**: Controlar margens e padding
- **Alinhamento**: Esquerda, centro, direita

---

## 📸 Upload de Imagens

O sistema oferece duas formas de adicionar imagens:

### 🔗 Método 1: URL da Imagem

1. **Seleccionar Tab "URL"** no campo de imagem
2. **Inserir URL**: Colar o endereço da imagem
   ```
   Exemplos válidos:
   - https://exemplo.com/imagem.jpg
   - /public-objects/imagens/foto.png
   ```
3. **Preview Automático**: A imagem aparece automaticamente
4. **Limpar**: Usar o botão "X" para remover

### 📁 Método 2: Upload de Arquivo

1. **Seleccionar Tab "Upload"** no campo de imagem
2. **Clicar "Seleccionar Imagem"**: Abre o gestor de ficheiros
3. **Escolher Arquivo**: Seleccionar imagem do computador
4. **Upload Automático**: O sistema faz upload para cloud storage
5. **URL Gerada**: Sistema gera automaticamente a URL final

#### 📋 Especificações de Upload

| Característica | Valor |
|----------------|--------|
| **Formatos Suportados** | JPG, JPEG, PNG, GIF, WebP |
| **Tamanho Máximo** | 5MB por arquivo |
| **Quantidade** | 1 arquivo por campo |
| **Resolução Recomendada** | 1920x1080px para banners |
| **Armazenamento** | Google Cloud Storage |

---

## 🚀 Publicação de Conteúdo

### Estados do Conteúdo

#### 📝 Rascunho (Draft)
- **Guardado Localmente**: Mudanças guardadas mas não públicas
- **Não Visível**: Visitantes do site não vêem as mudanças
- **Reversível**: Pode desfazer mudanças facilmente

#### ✅ Publicado (Published)
- **Visível ao Público**: Mudanças aparecem no site principal
- **Sincronização Automática**: Conteúdo sincroniza com base de dados
- **Permanente**: Mudanças ficam permanentes até nova edição

### Como Publicar

1. **Fazer Edições**: Completar todas as mudanças desejadas
2. **Revisar**: Usar botão "Preview" para verificar resultado
3. **Publicar**: Clicar no botão **"Publicar"**
4. **Confirmação**: Aguardar mensagem "Página publicada!"
5. **Verificar**: Navegar para página pública para confirmar mudanças

### ⚠️ Importante - Processo de Sincronização

O sistema usa **sincronização automática** quando publica:

1. **Rascunho**: Guardado em arquivos temporários JSON
2. **Publicação**: Conteúdo é transferido para base de dados PostgreSQL
3. **Página Pública**: Carrega conteúdo da base de dados
4. **Resultado**: Mudanças aparecem imediatamente na página pública

---

## 🎯 Edição Inline (Funcionalidade Avançada)

### O que é Edição Inline

A edição inline permite editar conteúdo diretamente nas páginas públicas do site, sem precisar ir ao painel administrativo.

### Como Activar

Para páginas compatíveis (como `/sobre`):
1. **Duplo Clique**: Fazer duplo clique num texto editável
2. **Modo de Edição**: O texto fica editável com borda destacada
3. **Editar**: Alterar o conteúdo directamente
4. **Enter**: Pressionar Enter para guardar
5. **Escape**: Pressionar Escape para cancelar

### 📝 Elementos Editáveis Inline

- ✅ Títulos principais
- ✅ Descrições e textos
- ✅ Parágrafos de conteúdo
- ❌ Imagens (apenas via admin)
- ❌ Elementos estruturais

### 🔧 Indicadores Visuais

- **Texto Editável**: Cursor muda para texto ao passar por cima
- **Modo de Edição**: Borda azul à volta do elemento
- **Data-testid**: Elementos têm identificadores únicos para teste

---

## ⚙️ Funcionalidades Avançadas

### 📊 Histórico de Versões

- **Desfazer/Refazer**: Controlos de histórico na barra superior
- **Múltiplas Versões**: Sistema mantém histórico de mudanças
- **Reversão**: Possível voltar a versões anteriores

### 🔄 Sincronização de Dados

#### Fluxo de Dados
```
Editor Visual → JSON temporário → PostgreSQL → Página Pública
```

#### APIs Utilizadas
- **`/api/editor/page`**: Gestão de conteúdo no admin
- **`/api/admin/pages`**: Sincronização com base de dados
- **`/api/objects/upload`**: Upload de imagens
- **`/api/images/normalize`**: Processamento de URLs de imagem

### 🎨 Personalização Avançada

#### Estrutura de Blocos
Cada página é composta por blocos com:
- **Tipo**: hero, text, image, gallery, grid, cta, separator
- **Conteúdo**: Dados específicos do bloco
- **Estilos**: CSS e configurações visuais
- **Posição**: Ordem na página

#### Configurações de Página
- **SEO Title**: Título para motores de busca
- **SEO Description**: Descrição para resultados de pesquisa
- **Keywords**: Palavras-chave relevantes
- **Metadata**: Dados adicionais da página

---

## ❗ Resolução de Problemas

### Problemas Comuns e Soluções

#### 🚫 Mudanças Não Aparecem na Página Pública

**Sintomas**: Editou no admin mas página pública não mudou

**Soluções**:
1. **Verificar Publicação**: Certificar que clicou em "Publicar" (não apenas guardar)
2. **Aguardar Sincronização**: Esperar alguns segundos após publicar
3. **Refresh da Página**: Atualizar a página pública (F5 ou Ctrl+R)
4. **Limpar Cache**: Tentar navegação privada/incógnita

#### 📸 Imagem Não Carrega

**Sintomas**: Campo de imagem vazio ou erro de carregamento

**Soluções**:
1. **Verificar URL**: Confirmar que URL da imagem está correcta
2. **Formato de Arquivo**: Usar apenas JPG, PNG, GIF, WebP
3. **Tamanho do Arquivo**: Máximo 5MB por imagem
4. **Conectividade**: Verificar ligação à internet durante upload

#### ⚠️ Erro ao Guardar/Publicar

**Sintomas**: Mensagem de erro ou operação falhada

**Soluções**:
1. **Recarregar Página**: Refresh no navegador
2. **Tentar Novamente**: Repetir a operação
3. **Verificar Ligação**: Confirmar conectividade à internet
4. **Contactar Suporte**: Se problema persistir

#### 🔒 Não Consegue Aceder ao Editor

**Sintomas**: Erro 404 ou página não encontrada

**Soluções**:
1. **URL Correcta**: Verificar que está a usar `/admin/editor`
2. **Permissões**: Confirmar que tem acesso administrativo
3. **Navegador**: Tentar navegador diferente
4. **Cache**: Limpar cache e cookies

### 📞 Contactar Suporte Técnico

Se os problemas persistirem:

**Email**: suporte@domrealce.com  
**Telefone**: +351 XXX XXX XXX  
**Horário**: Segunda a Sexta, 9h-18h

**Informações a Incluir**:
- URL específica onde ocorre o problema
- Descrição detalhada do erro
- Screenshots (se aplicável)
- Navegador e versão utilizada
- Passos realizados antes do erro

---

## 💡 Melhores Práticas

### ✅ Recomendações Gerais

#### 📝 Gestão de Conteúdo
- **Revisar Antes de Publicar**: Sempre usar Preview antes de publicar
- **Guardas Regulares**: Guardar rascunhos frequentemente
- **Conteúdo Relevante**: Manter informações actualizadas e relevantes
- **Consistência**: Manter estilo consistente entre páginas

#### 🖼️ Gestão de Imagens
- **Otimização**: Usar imagens optimizadas para web
- **Resolução**: Máximo 1920px de largura para banners
- **Formato**: Preferir WebP ou PNG para qualidade
- **Tamanho**: Manter ficheiros abaixo de 1MB quando possível

#### 🎨 Design e UX
- **Legibilidade**: Garantir contraste adequado entre texto e fundo
- **Responsividade**: Testar em dispositivos móveis
- **Hierarquia Visual**: Usar títulos e subtítulos de forma lógica
- **Call-to-Actions**: Destacar botões e links importantes

### 🔐 Segurança e Backup

#### 💾 Backup de Conteúdo
- **Rascunhos**: Sistema mantém versões automáticas
- **Base de Dados**: Backups automáticos diários
- **Imagens**: Armazenadas em cloud storage seguro

#### 🛡️ Segurança
- **Acesso Controlado**: Apenas utilizadores autorizados podem editar
- **Auditoria**: Sistema regista todas as mudanças
- **Validação**: Conteúdo é validado antes de ser guardado

### 📱 Optimização Mobile

#### 🎯 Responsividade
- **Testar em Mobile**: Verificar como fica em smartphones
- **Imagens Adaptáveis**: Imagens ajustam-se automaticamente
- **Navegação**: Menus funcionam bem em ecrãs pequenos
- **Velocidade**: Site optimizado para carregamento rápido

---

## 📈 Funcionalidades Futuras

### 🚀 Em Desenvolvimento

- **Editor Visual Drag & Drop**: Interface ainda mais intuitiva
- **Biblioteca de Media**: Gestão centralizada de imagens
- **Templates**: Modelos pré-definidos para páginas
- **Colaboração**: Múltiplos editores simultâneos
- **Agendamento**: Publicação automática programada
- **Analytics**: Estatísticas de visualizações e engagement

### 💭 Sugestões de Melhorias

Para sugerir novas funcionalidades ou melhorias:
**Email**: desenvolvimento@domrealce.com

---

## 📄 Conclusão

O Sistema de Edição Visual da DOMREALCE representa uma solução moderna e eficiente para gestão de conteúdo web. Com uma interface intuitiva e funcionalidades avançadas, permite manter o website sempre actualizado e profissional.

### 🎯 Pontos-Chave

- **Fácil de Usar**: Interface intuitiva para utilizadores não técnicos
- **Poderoso**: Funcionalidades avançadas para necessidades complexas
- **Seguro**: Sistema robusto com backups e validações
- **Flexível**: Adaptável a diferentes tipos de conteúdo
- **Escalável**: Preparado para crescimento futuro

### 📚 Recursos Adicionais

- **Tutorial em Vídeo**: [Link para tutorial] (em breve)
- **FAQ**: Perguntas frequentes no site
- **Suporte**: Equipa técnica disponível para ajuda

---

**© 2025 DOMREALCE - Comunicação Visual**  
*Documentação versão 1.0 - Última actualização: Janeiro 2025*

---

*Este manual foi criado para maximizar a eficiência na utilização do sistema. Para dúvidas ou sugestões, contacte a equipa de desenvolvimento.*