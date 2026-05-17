// Plasmic temporariamente desabilitado para evitar erros de importação
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

// Páginas críticas
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Obrigado from "@/pages/Obrigado";
import PagamentoErro from "@/pages/PagamentoErro";
import ContactosMaquinas from "@/pages/contactos-maquinas";
import LandingViaturasEmpresas from "@/pages/landing-viaturas-empresas";

// Lazy loading
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

  // Google Analytics + Ads
  useEffect(() => {
    const loadGA = () => {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-S51RFB39HK";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-S51RFB39HK', {'send_page_view': true});
        gtag('config', 'AW-11438840519');
      `;
      document.head.appendChild(script2);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    };

    setTimeout(loadGA, 500);
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
            <Switch>
              {/* Home */}
              <Route path="/" component={HomeV2} />

              {/* Notícias */}
              <Route path="/noticias" component={Noticias} />
              <Route path="/noticia/:id" component={NoticiaDetalhes} />

              {/* Portfolio */}
              <Route path="/portfolio" component={PortfolioV2} />
              <Route path="/portfolio-v2" component={PortfolioV2} />

              {/* Serviços */}
              <Route path="/servico-design-grafico" component={ServicoDesignGrafico} />
              <Route path="/servico-impressao-digital" component={ServicoImpressaoDigital} />
              <Route path="/servico-papel-parede" component={ServicoPapelParede} />
              <Route path="/servico-telas-artisticas" component={ServicoTelasArtisticas} />
              <Route path="/servico-autocolantes" component={ServicoAutocolantes} />
              <Route path="/servico-decoracao-viaturas" component={ServicoDecoracaoViaturas} />
              <Route path="/servico-espacos-comerciais" component={ServicoEspacosComerciais} />
              <Route path="/servico-peliculas-protecao-solar" component={ServicoPeliculasProtecaoSolar} />
              <Route path="/servico-pelicula-solar" component={ServicoPeliculaSolar} />

              {/* Loja */}
              <Route path="/loja" component={Loja} />
              <Route path="/loja/papel-de-parede" component={LojaPapelParede} />
              <Route path="/loja/quadros-em-canvas" component={LojaQuadrosCanvas} />
              <Route path="/loja/quadros-em-canvas/:id" component={LojaCanvasDetalhes} />
              <Route path="/loja/papel-de-parede/:textura" component={LojaTexturaDetalhes} />
              <Route path="/loja/papel-parede/textura/:textura" component={LojaTexturaDetalhes} />
              <Route path="/carrinho" component={Carrinho} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/pagamento" component={InstrucoesPagamento} />
              <Route path="/pedido-confirmado" component={PedidoConfirmado} />

              {/* Contactos / Sobre */}
              <Route path="/contactos" component={Contactos} />
              <Route path="/contact" component={Contactos} />
              <Route path="/sobre" component={Sobre} />
              <Route path="/contactos-maquinas" component={ContactosMaquinas} />
              <Route path="/viaturas-empresas" component={LandingViaturasEmpresas} />

              {/* Como aplicar */}
              <Route path="/como-aplicar-papel-de-parede" component={ComoAplicarPapelParede} />

              {/* Páginas legais */}
              <Route path="/politica-privacidade" component={PoliticaPrivacidade} />
              <Route path="/termos-condicoes" component={TermosCondicoes} />
              <Route path="/politica-cookies" component={PoliticaCookies} />
              <Route path="/aviso-legal" component={AvisoLegal} />

              {/* Confirmações de pagamento */}
              <Route path="/obrigado" component={Obrigado} />
              <Route path="/obrigado-orcamento" component={ObrigadoOrcamento} />
              <Route path="/pagamento-erro" component={PagamentoErro} />

              {/* Admin */}
              <Route path="/admin" component={Admin} />
              <Route path="/exportar-site" component={ExportarSite} />

              {/* Dev / Demo */}
              <Route path="/editor" component={VisualEditorDemo} />
              <Route path="/demo-interativo" component={DemoInterativo} />
              <Route path="/teste-cores" component={TesteCores} />

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>

            <WhatsAppFAB />
            <ScrollToTopButton />
          </Suspense>
        </VisualEditorProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;