# 🌐 Configuração do Domínio www.domrealce.com na Hostinger

## 📋 **PASSO A PASSO COMPLETO**

### 1. **Fazer Deploy no Replit**
1. Clique no botão **"Deploy"** no canto superior direito do Replit
2. Selecione **"Static Site"** ou **"Web Service"** 
3. Configure as definições básicas e faça deploy
4. Anote o URL gerado pelo Replit (ex: `domrealce.replit.app`)

### 2. **Configurar DNS na Hostinger**
Acesse o painel da Hostinger → **Domínios** → **domrealce.com** → **Gerir DNS**

**Adicionar/Editar estes registos DNS:**

```
Tipo: CNAME
Nome: www
Destino: [SEU_URL_REPLIT].replit.app
TTL: 3600

Tipo: A (Redirect)  
Nome: @ (root domain)
Destino: www.domrealce.com
TTL: 3600
```

### 3. **Configurar no Replit Deployments**
1. No dashboard do Replit, vá para **Deployments**
2. Clique no seu deployment
3. Vá para **Settings** → **Custom Domain**
4. Adicione: `www.domrealce.com`
5. Aguarde a verificação SSL (pode demorar até 24h)

### 4. **Verificações de Funcionamento**

**Teste os URLs:**
- ✅ `https://www.domrealce.com` - Site principal
- ✅ `https://domrealce.com` - Deve redirecionar para www
- ✅ Certificado SSL ativo (ícone do cadeado)

### 5. **Configurações Adicionais (Opcional)**

**Email Forwarding na Hostinger:**
```
info@domrealce.com → [seu-email-atual]
contacto@domrealce.com → [seu-email-atual]
```

**Google Search Console:**
1. Acesse: https://search.google.com/search-console
2. Adicione propriedade: `https://www.domrealce.com`
3. Verifique com meta tag ou DNS
4. Submeta sitemap: `https://www.domrealce.com/sitemap.xml`

### 6. **Monitorização**
- Verifique funcionamento após 24-48h
- Teste velocidade: https://pagespeed.web.dev/
- Verifique SEO: https://search.google.com/test/mobile-friendly

---

## 🆘 **RESOLUÇÃO DE PROBLEMAS**

**Problema:** Site não carrega
**Solução:** Verificar se DNS propagou (pode demorar 24-48h)

**Problema:** SSL não funciona  
**Solução:** Aguardar configuração automática do Replit

**Problema:** Emails não funcionam
**Solução:** Configurar Email Forwarding na Hostinger

---

## 📞 **CONTACTOS DE APOIO**
- **Hostinger Support**: Via painel de controlo
- **Replit Support**: support@replit.com