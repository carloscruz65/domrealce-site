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

// Páginas com lazy loading (carregamento diferido)
const Contactos = lazy(() => import("@/pages/contactos"));
const Sobre = lazy(() => import("@/pages/sobre"));
const Loja = lazy(() => import("@/pages/loja"));
const LojaPapelParede = lazy(() => import("@/pages/loja-papel-parede"));
const LojaQuadrosCanvas = lazy(() => import("@/pages/loja-quadros-canvas"));
const LojaCanvasDetalhes = lazy(() => import("@/pages/canvas-detalhes"));
const LojaTexturaDetalhes = lazy(() => import("@/pages/textura-detalhes"));
const Carrinho = lazy(() => import("@/pages/carrinho"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
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
const DemoInterativo = lazy(() => import("@/pages/demo-interativo"));
const VisualEditorDemo = lazy(() => import("@/pages/visual-editor-demo"));

// Componentes pesados com lazy loading
const WhatsAppFAB = lazy(() => import("@/components/whatsapp-fab"));
const PerformanceOptimizer = lazy(() => import("@/components/performance-optimizer"));
const PerformancePreloader = lazy(() => import("@/components/performance-preloader"));
const VisualEditorToolbar = lazy(() => import("@/components/visual-editor").then(m => ({ default: m.VisualEditorToolbar })));

// Contexto importado diretamente (necessário para providers)
import { VisualEditorProvider } from "@/contexts/VisualEditorContext";

// Loading fallback minimalista
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Declaração global para o Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function Router() {
  useScrollToTop();
  const [location] = useLocation();
  
  // Detectar se está rodando no Replit
  const isReplitPreview = typeof window !== 'undefined' && 
    (/replit\.dev|worf\.replit\.dev|repl\.co/.test(window.location.hostname));
  const showEditor = isReplitPreview || import.meta.env.DEV;
  
  // Verificar se o modo de edição está ativo via URL
  const isEditMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('edit') === 'true';

  // Track page views when routes change
  useEffect(() => {
    console.log('📍 Mudança de página para:', location);
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('📊 Enviando pageview para GA4:', location);
      window.gtag('config', 'G-S51RFB39HK', {
        page_path: location
      });
      // Enviar evento adicional de page_view
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location
      });
    } else {
      console.warn('⚠️ window.gtag não disponível ainda');
    }
  }, [location]);

  return (
    <>
      <SEO />
      <StructuredData />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sobre" component={Sobre} />
          <Route path="/servico-design-grafico" component={ServicoDesignGrafico} />
          <Route path="/servico-impressao-digital" component={ServicoImpressaoDigital} />
          <Route path="/servico-papel-parede" component={ServicoPapelParede} />
          <Route path="/servico-telas-artisticas" component={ServicoTelasArtisticas} />
          <Route path="/servico-autocolantes" component={ServicoAutocolantes} />
          <Route path="/servico-decoracao-viaturas" component={ServicoDecoracaoViaturas} />
          <Route path="/servico-espacos-comerciais" component={ServicoEspacosComerciais} />
          <Route path="/servico-pelicula-solar" component={ServicoPeliculaSolar} />
          <Route path="/servico-peliculas-protecao-solar" component={ServicoPeliculasProtecaoSolar} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/pedido-confirmado" component={PedidoConfirmado} />
          <Route path="/instrucoes-pagamento" component={InstrucoesPagamento} />
          <Route path="/teste-cores" component={TesteCores} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/loja" component={Loja} />
          <Route path="/loja/papel-parede" component={LojaPapelParede} />
          <Route path="/loja/quadros-canvas" component={LojaQuadrosCanvas} />
          <Route path="/loja/quadros-canvas/categoria/:categoria" component={LojaCanvasDetalhes} />
          <Route path="/loja/papel-parede/textura/:textura" component={LojaTexturaDetalhes} />
          <Route path="/como-aplicar-papel-parede" component={ComoAplicarPapelParede} />
          <Route path="/carrinho" component={Carrinho} />
          <Route path="/editor" component={Admin} />
          <Route path="/admin" component={Admin} />
          <Route path="/noticias" component={Noticias} />
          <Route path="/noticia/:id" component={NoticiaDetalhes} />
          <Route path="/contactos" component={Contactos} />
          <Route path="/politica-privacidade" component={PoliticaPrivacidade} />
          <Route path="/termos-condicoes" component={TermosCondicoes} />
          <Route path="/politica-cookies" component={PoliticaCookies} />
          <Route path="/aviso-legal" component={AvisoLegal} />
          <Route path="/demo-interativo" component={DemoInterativo} />
          <Route path="/visual-editor-demo" component={VisualEditorDemo} />
          
          {showEditor && location.startsWith('/editor') && <VisualEditorToolbar />}
          
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  useLazyImages();

  // Detectar se está rodando no Replit
  const isReplitPreview = typeof window !== 'undefined' && 
    (/replit\.dev|worf\.replit\.dev|repl\.co/.test(window.location.hostname));
  const showEditor = isReplitPreview || import.meta.env.DEV;

  // Initialize Google Analytics AFTER first paint (defer to improve LCP)
  useEffect(() => {
    // Delay GA loading until after page is interactive
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
      `;
      document.head.appendChild(script2);
      
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
    };

    // Load GA after 2 seconds or when page becomes idle
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadGA, { timeout: 2000 });
    } else {
      setTimeout(loadGA, 2000);
    }
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
          <Router />
          <Suspense fallback={null}>
            <WhatsAppFAB />
          </Suspense>
        </VisualEditorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;