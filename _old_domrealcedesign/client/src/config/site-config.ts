// CONFIGURAÇÕES DO SITE DOMREALCE
// Edite os valores abaixo para personalizar textos, cores e tamanhos

export const siteConfig = {
  // INFORMAÇÕES BÁSICAS
  empresa: {
    nome: "DOMREALCE",
    slogan: "Comunicação Visual & Impressão Digital",
    telefone: "+351 123 456 789",
    email: "info@domrealce.com",
    endereco: "Rua Example, 123, Porto, Portugal"
  },

  // TEXTOS DA PÁGINA INICIAL
  homepage: {
    heroTitulo: "Comunicação Visual",
    heroSubtitulo: "& Impressão Digital",
    heroDescricao: "Transformamos as suas ideias em comunicação visual de excelência. Design gráfico, impressão digital, papel de parede e soluções personalizadas para empresas e particulares.",
    botaoPrincipal: "Explorar Serviços",
    botaoSecundario: "Ver Portfolio"
  },

  // CORES PRINCIPAIS (formato HSL)
  cores: {
    amarelo: "47 96% 56%",      // brand-yellow
    turquesa: "171 77% 64%",    // brand-turquoise  
    azul: "217 71% 53%",        // brand-blue
    coral: "14 86% 65%",        // brand-coral
    escuro: "217 33% 17%"       // brand-dark
  },

  // TAMANHOS DE TEXTO
  tamanhos: {
    tituloGrande: "text-4xl md:text-6xl",  // Títulos principais
    tituloMedio: "text-2xl md:text-4xl",   // Títulos de seção
    textoPequeno: "text-sm",               // Textos pequenos
    textoNormal: "text-base",              // Texto normal
    textoGrande: "text-lg"                 // Texto destacado
  },

  // IMAGENS PRINCIPAIS (URLs)
  imagens: {
    heroBackground: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    logoEmpresa: "/logo-domrealce.png",
    imagemSobre: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
  },

  // REDES SOCIAIS
  social: {
    facebook: "https://facebook.com/domrealce",
    instagram: "https://instagram.com/domrealce", 
    linkedin: "https://linkedin.com/company/domrealce",
    whatsapp: "https://wa.me/351930682725"
  },

  // CONFIGURAÇÕES DE CONTACTO
  contacto: {
    mostrarWhatsapp: true,
    mostrarTelefone: true,
    mostrarEmail: true,
    horarioFuncionamento: "Seg-Sex: 9h-18h"
  }
};

// UTILITÁRIO PARA OBTER CORES CSS
export const getCSSColor = (cor: keyof typeof siteConfig.cores) => {
  return `hsl(${siteConfig.cores[cor]})`;
};