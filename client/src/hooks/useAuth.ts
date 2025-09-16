import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // TEMPORARY: Authentication disabled - allow admin access
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user || { id: "temp-admin", email: "admin@domrealce.com", firstName: "Admin" },
    isLoading: false, // Always loaded
    isAuthenticated: true, // Always authenticated for now
  };
}