import { useQuery } from "@tanstack/react-query";
import { fetchMarkerFacilities, Facilities } from "@/api/marker";

export const useMarkerFacilities = (id: number) => {
  return useQuery<Facilities[]>({
    queryKey: ["markerFacilities", id],
    queryFn: () => fetchMarkerFacilities(id),
    enabled: !!id,
  });
};
