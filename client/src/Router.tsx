import { Switch, Route, useLocation } from "wouter";
import SEO from "@/components/seo";
import StructuredData from "@/components/structured-data";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Contactos from "@/pages/contactos";
import Sobre from "@/pages/sobre";
import Servicos from "@/pages/servicos";
import Portfolio from "@/pages/portfolio";
import Noticias from "@/pages/noticias";
import Loja from "@/pages/loja";
import LojaQuadrosCanvas from "@/pages/loja-quadros-canvas";
import LojaPapelParede from "@/pages/loja-papel-parede";
import CanvasDetalhes from "@/pages/canvas-detalhes";
import TexturaDetalhes from "@/pages/textura-detalhes";
import Carrinho from "@/pages/carrinho";
import Checkout from "@/pages/checkout";
import PedidoConfirmado from "@/pages/pedido-confirmado";
import Pagamento from "@/pages/pagamento";
import ComoAplicar from "@/pages/como-aplicar";

// Páginas de serviços
import ServicoDesignGrafico from "@/pages/servico-design-grafico";
import ServicoImpressaoDigital from "@/pages/servico-impressao-digital";
import ServicoPapelParede from "@/pages/servico-papel-parede";
import ServicoTelasArtisticas from "@/pages/servico-telas-artisticas";
import ServicoAutocolantes from "@/pages/servico-autocolantes";
import ServicoDecoracaoViaturas from "@/pages/servico-decoracao-viaturas";
import ServicoEspacosComerciais from "@/pages/servico-espacos-comerciais";
import ServicoPeliculaProtecaoSolar from "@/pages/servico-peliculas-protecao-solar";

// Páginas legais
import PoliticaPrivacidade from "@/pages/politica-privacidade";
import PoliticaCookies from "@/pages/politica-cookies";
import TermosCondicoes from "@/pages/termos-condicoes";
import AvisoLegal from "@/pages/aviso-legal";

// Login e proteção
import Login from "@/pages/Login";
import PrivateRoute from "@/components/PrivateRoute";

// Admin pages
import AdminDashboard from "@/pages/admin-dashboard";
import AdminSlider from "@/pages/admin-slider";
import AdminPages from "@/pages/admin-pages";
import AdminProdutos from "@/pages/admin-produtos";
import AdminNoticias from "@/pages/admin-noticias";
import AdminPortfolio from "@/pages/admin-portfolio";
import AdminContactos from "@/pages/admin-contactos";
import AdminLoja from "@/pages/admin-loja";
import AdminEncomendas from "@/pages/admin-encomendas";
import AdminEditor from "@/pages/admin-editor";
import AdminMedia from "@/pages/admin-media";
import AdminTexturas from "@/pages/admin-texturas";

function Router() {
  const [location] = useLocation();

  return (
    <>
      <SEO />
      <StructuredData />
      <Switch>
        {/* Rotas públicas principais */}
        <Route path="/" component={Home} />
        <Route path="/sobre" component={Sobre} />
        <Route path="/contactos" component={Contactos} />
        <Route path="/servicos" component={Servicos} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/noticias" component={Noticias} />

        {/* Loja */}
        <Route path="/loja" component={Loja} />
        <Route path="/loja-quadros-canvas" component={LojaQuadrosCanvas} />
        <Route path="/loja-papel-parede" component={LojaPapelParede} />
        <Route path="/canvas/:id" component={CanvasDetalhes} />
        <Route path="/textura/:id" component={TexturaDetalhes} />
        <Route path="/carrinho" component={Carrinho} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/pedido-confirmado" component={PedidoConfirmado} />
        <Route path="/pagamento" component={Pagamento} />
        <Route path="/como-aplicar" component={ComoAplicar} />

        {/* Páginas de serviços */}
        <Route path="/servico-design-grafico" component={ServicoDesignGrafico} />
        <Route path="/servico-impressao-digital" component={ServicoImpressaoDigital} />
        <Route path="/servico-papel-parede" component={ServicoPapelParede} />
        <Route path="/servico-telas-artisticas" component={ServicoTelasArtisticas} />
        <Route path="/servico-autocolantes" component={ServicoAutocolantes} />
        <Route path="/servico-decoracao-viaturas" component={ServicoDecoracaoViaturas} />
        <Route path="/servico-espacos-comerciais" component={ServicoEspacosComerciais} />
        <Route path="/servico-peliculas-protecao-solar" component={ServicoPeliculaProtecaoSolar} />

        {/* Páginas legais */}
        <Route path="/politica-privacidade" component={PoliticaPrivacidade} />
        <Route path="/politica-cookies" component={PoliticaCookies} />
        <Route path="/termos-condicoes" component={TermosCondicoes} />
        <Route path="/aviso-legal" component={AvisoLegal} />

        {/* Login */}
        <Route path="/login" component={Login} />

        {/* Admin routes - TODAS PROTEGIDAS */}
        <Route path="/admin">
          <PrivateRoute component={AdminDashboard} />
        </Route>
        <Route path="/admin/slider">
          <PrivateRoute component={AdminSlider} />
        </Route>
        <Route path="/admin/pages">
          <PrivateRoute component={AdminPages} />
        </Route>
        <Route path="/admin/produtos">
          <PrivateRoute component={AdminProdutos} />
        </Route>
        <Route path="/admin/noticias">
          <PrivateRoute component={AdminNoticias} />
        </Route>
        <Route path="/admin/portfolio">
          <PrivateRoute component={AdminPortfolio} />
        </Route>
        <Route path="/admin/contactos">
          <PrivateRoute component={AdminContactos} />
        </Route>
        <Route path="/admin/loja">
          <PrivateRoute component={AdminLoja} />
        </Route>
        <Route path="/admin/encomendas">
          <PrivateRoute component={AdminEncomendas} />
        </Route>
        <Route path="/admin/editor">
          <PrivateRoute component={AdminEditor} />
        </Route>
        <Route path="/admin/media">
          <PrivateRoute component={AdminMedia} />
        </Route>
        <Route path="/admin/texturas">
          <PrivateRoute component={AdminTexturas} />
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Router;
