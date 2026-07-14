// Plasmic temporariamente desabilitado para evitar erros de importação
// import { PlasmicRootProvider, PlasmicComponent } from "@plasmicapp/loader-react";
// import { PLASMIC } from "./Plasmic-ini";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import SEO from "@/components/seo";
import StructuredData from "@/components/structured-data";
import { useLazyImages } from "@/hooks/use-lazy-images";

import React, { useEffect, lazy, Suspense } from "react";

// Páginas críticas (carregamento imediato)
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Obrigado from "@/pages/Obrigado";
import PagamentoErro from "@/pages/PagamentoErro";
import ContactosMaquinas from "@/pages/contactos-maquinas";
import LandingViaturasEmpresas from "@/pages/landing-viaturas-empresas";

// Lazy loading (mantido igual)
const Contactos = lazy(() => import("@/pages/contactos"));
const Sobre = lazy(() => import("@/pages/sobre"));
const Loja = lazy(() => import("@/pages/loja"));
const LojaPapelParede = lazy(() => import("@/pages/loja-papel-parede"));
const LojaQuadrosCanvas = lazy(() => import("@/pages/loja-quadros-canvas"));
const LojaCanvasDetalhes = lazy(() => import("@/pages/canvas-detalhes"));
const LojaTexturaDetalhes = lazy(() => import("@/pages/textura-detalhes"));
const Carrinho = lazy(() => import("@/pages/carrinho"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const PortfolioV2 = lazy(() => import("@/pages/portfolio-v2"));
const HomeV2 = lazy(() => import("./pages/home-v2"));
const ServicoDesignGrafico = lazy(() => import("@/pages/servico-design-grafico"));
const ServicoImpressaoDigital = lazy(() => import("@/pages/servico-impressao-digital"));
const ServicoPapelParede = lazy(() => import("@/pages/servico-papel-parede"));
const ServicoTelasArtisticas = lazy(() => import("@/pages/servico-telas-artisticas"));
const ServicoAutocolantes = lazy(() => import("@/pages/servico-autocolantes"));
const ServicoDecoracaoViaturas = lazy(() => import("@/pages/servico-decoracao-viaturas"));
const ServicoEspacosComerciais = lazy(() => import("@/pages/servico-espacos-comerciais"));
const ServicoPeliculasProtecaoSolar = lazy(() => import("@/pages/servico-peliculas-protecao-solar"));
const ServicoPeliculaSolar = lazy(() => import("@/pages/servico-pelicula-solar"));
const Checkout = lazy(() => import("@/pages/checkout"));
const PedidoConfirmado = lazy(() => import("@/pages/pedido-confirmado"));
const InstrucoesPagamento = lazy(() => import("@/pages/pagamento"));
const TesteCores = lazy(() => import("@/pages/teste-cores"));
const Noticias = lazy(() => import("@/pages/noticias"));
const NoticiaDetalhes = lazy(() => import("@/pages/noticia-detalhes"));
const PoliticaPrivacidade = lazy(() => import("@/pages/politica-privacidade"));
const TermosCondicoes = lazy(() => import("@/pages/termos-condicoes"));
const PoliticaCookies = lazy(() => import("@/pages/politica-cookies"));
const AvisoLegal = lazy(() => import("@/pages/aviso-legal"));
const ComoAplicarPapelParede = lazy(() => import("@/pages/como-aplicar"));
const Admin = lazy(() => import("@/pages/admin"));
const ExportarSite = lazy(() => import("@/pages/exportar-site"));
const DemoInterativo = lazy(() => import("@/pages/demo-interativo"));
const VisualEditorDemo = lazy(() => import("@/pages/visual-editor-demo"));
const ObrigadoOrcamento = lazy(() => import("@/pages/obrigado-orcamento"));

const WhatsAppFAB = lazy(() => import("@/components/whatsapp-fab"));
const PerformanceOptimizer = lazy(() => import("@/components/performance-optimizer"));
const PerformancePreloader = lazy(() => import("@/components/performance-preloader"));
const VisualEditorToolbar = lazy(() => import("@/components/visual-editor").then(m => ({ default: m.VisualEditorToolbar })));
const ScrollToTopButton = lazy(() => import("@/components/ScrollToTopButton"));

import { VisualEditorProvider } from "@/contexts/VisualEditorContext";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function App() {
  useLazyImages();

  // Google Analytics
  useEffect(() => {
    const loadGA = () => {
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-S51RFB39HK';
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-S51RFB39HK', {'send_page_view': true});
        gtag('config', 'AW-11438840519');
      `;
      document.head.appendChild(script2);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
    };

    setTimeout(loadGA, 500);
  }, []);

  // 🔥 RADAR AUTOMÁTICO WHATSAPP (GLOBAL)
  useEffect(() => {
    const handleClick = (e: any) => {
      const target = e.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");

      if (href && href.includes("wa.me")) {
        e.preventDefault();

        if (window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-11438840519/lTnxCKfU34scEMe1u84q",
            event_callback: () => {
              window.open(href, "_blank");
            },
          });
        } else {
          window.open(href, "_blank");
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VisualEditorProvider>
          <Suspense fallback={null}>
            <PerformanceOptimizer />
            <PerformancePreloader />
          </Suspense>
          <Toaster />
          <Suspense fallback={null}>
            <WhatsAppFAB />
            <ScrollToTopButton />
          </Suspense>
        </VisualEditorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;