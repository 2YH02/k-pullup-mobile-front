import {
  fetchNearbyMarkers,
  type FetchNearbyMarkersParams,
  type NearbyMarkersRes,
} from "@/api/marker";
import { useQuery } from "@tanstack/react-query";

export const useNearbyMarkers = (params: FetchNearbyMarkersParams) => {
  const { latitude, longitude, distance, page, pageSize } = params;

  return useQuery<NearbyMarkersRes>({
    queryKey: ["nearby-markers"],
    queryFn: () =>
      fetchNearbyMarkers({ latitude, longitude, distance, page, pageSize }),
    enabled: false,
  });
};
