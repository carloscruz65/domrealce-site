import { Switch, Route, useLocation } from "wouter";
import SEO from "@/components/seo";
import StructuredData from "@/components/structured-data";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Contactos from "@/pages/contactos";
import Sobre from "@/pages/sobre";

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
        {/* Rota pública */}
        <Route path="/" component={Home} />
        <Route path="/sobre" component={Sobre} />
        <Route path="/contactos" component={Contactos} />

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
