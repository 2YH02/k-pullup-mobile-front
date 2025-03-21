import { fetchMarkerRanking, RankingMarker } from "@/api/marker";
import { useQuery } from "@tanstack/react-query";

export const useMarkerRanking = () => {
  return useQuery<RankingMarker[]>({
    queryKey: ["marker-ranking"],
    queryFn: () => fetchMarkerRanking(),
    gcTime: 0,
  });
};
