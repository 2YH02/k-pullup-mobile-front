import { Favorite, fetchFavoritesMarker } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useMarkerFavorites = () => {
  return useQuery<Favorite[]>({
    queryKey: ["marker-favorites"],
    queryFn: fetchFavoritesMarker,
    gcTime: 0,
  });
};
