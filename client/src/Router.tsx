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

// Admin
import AdminDashboard from "@/pages/admin-dashboard";

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

        {/* Admin protegida */}
        <Route path="/admin">
          <PrivateRoute component={() => <h1>Painel Admin</h1>} />
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default Router;
