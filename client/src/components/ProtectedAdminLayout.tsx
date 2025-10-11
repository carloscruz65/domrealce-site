import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthStatus {
  authenticated: boolean;
  user?: {
    name: string;
    email?: string;
    mode?: string;
  };
}

interface ProtectedAdminLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const [, setLocation] = useLocation();

  const { data: authStatus, isLoading, error } = useQuery<AuthStatus>({
    queryKey: ["/api/auth/status"],
    refetchInterval: 60000, // Recheck every minute
    retry: 1,
  });

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && authStatus && !authStatus.authenticated) {
      console.log("❌ Not authenticated - redirecting to login");
      window.location.href = "/api/login";
    }
  }, [isLoading, authStatus]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">A verificar autenticação...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Erro de Autenticação</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível verificar o seu estado de autenticação.
          </p>
          <button
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect happening via useEffect
  if (!authStatus?.authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">A redirecionar para login...</p>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}
