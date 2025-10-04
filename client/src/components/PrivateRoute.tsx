import { Redirect } from "wouter";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

export default function PrivateRoute({ component: Component }: PrivateRouteProps) {
  console.log("🔒 PrivateRoute chamado");
  const isAuth = false; // força sempre bloqueado
  return isAuth ? <Component /> : <Redirect to="/login" />;
}
