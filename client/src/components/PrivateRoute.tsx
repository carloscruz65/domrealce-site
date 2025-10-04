import { Redirect } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

export default function PrivateRoute({ component: Component }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#20B2AA] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to Replit Auth login
    window.location.href = '/api/login';
    return null;
  }

  return <Component />;
}
