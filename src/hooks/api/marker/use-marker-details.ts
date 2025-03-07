import { useQuery } from "@tanstack/react-query";
import { fetchMarkerDetails } from "@/api/marker";
import { MarkerDetail } from "@/types/marker.types";

export const useMarkerDetails = (id: number) => {
  return useQuery<MarkerDetail>({
    queryKey: ["markerDetails", id],
    queryFn: () => fetchMarkerDetails(id),
    enabled: !!id,
  });
};
