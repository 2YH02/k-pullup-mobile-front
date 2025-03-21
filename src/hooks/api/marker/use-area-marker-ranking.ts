import { type RankingMarker, fetchAroundMarkerRanking } from "@/api/marker";
import { useQuery } from "@tanstack/react-query";

export const useAreaMarkerRanking = ({
  latitude,
  longitude,
  enabled,
}: {
  enabled: boolean;
  latitude: number;
  longitude: number;
}) => {
  return useQuery<RankingMarker[]>({
    queryKey: ["around-marker-ranking"],
    queryFn: () => fetchAroundMarkerRanking({ latitude, longitude }),
    enabled: enabled,
    gcTime: 0,
  });
};
