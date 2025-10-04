import PrivateRoute from "@/components/PrivateRoute";
import Login from "@/pages/Login";

// ...

<Switch>
  <Route path="/" component={Home} />
  <Route path="/sobre" component={Sobre} />
  <Route path="/contactos" component={Contactos} />
  <Route path="/login" component={Login} />

  {/* Rotas ADMIN protegidas */}
  <Route path="/admin" component={() => <PrivateRoute component={AdminDashboard} />} />
  <Route path="/admin/texturas" component={() => <PrivateRoute component={AdminTexturas} />} />
  <Route path="/admin/contactos" component={() => <PrivateRoute component={AdminContactos} />} />
  <Route path="/admin/portfolio" component={() => <PrivateRoute component={AdminPortfolio} />} />
  <Route path="/admin/slider" component={() => <PrivateRoute component={AdminSlider} />} />
  <Route path="/admin/pages" component={() => <PrivateRoute component={AdminPages} />} />
  <Route path="/admin/produtos" component={() => <PrivateRoute component={AdminProdutos} />} />
  <Route path="/admin/noticias" component={() => <PrivateRoute component={AdminNoticias} />} />
  <Route path="/admin/loja" component={() => <PrivateRoute component={AdminLoja} />} />
  <Route path="/admin/encomendas" component={() => <PrivateRoute component={AdminEncomendas} />} />
  <Route path="/admin/editor" component={() => <PrivateRoute component={AdminEditor} />} />
  <Route path="/admin/media" component={() => <PrivateRoute component={AdminMedia} />} />
</Switch>
