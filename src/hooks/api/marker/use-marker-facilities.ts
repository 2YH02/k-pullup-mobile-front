import { useQuery } from "@tanstack/react-query";
import { fetchMarkerFacilities, Facilities } from "@/api/marker";

export const useMarkerFacilities = (id: number) => {
  return useQuery<Facilities[]>({
    queryKey: ["marker-facilities", id],
    queryFn: () => fetchMarkerFacilities(id),
    enabled: !!id,
  });
};
