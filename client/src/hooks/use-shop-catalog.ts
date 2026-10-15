import { useQuery } from "@tanstack/react-query";
import type { ShopCatalog } from "@shared/shop-catalog";
export function useShopCatalog() {
  return useQuery<ShopCatalog>({
    queryKey: ["/api/shop/catalog"],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
