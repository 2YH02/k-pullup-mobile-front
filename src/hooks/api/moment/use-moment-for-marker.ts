import { fetchMomentForMarker, type Moment } from "@/api/moment";
import { useQuery } from "@tanstack/react-query";

export const useMomentForMarker = (markerId: number) => {
  return useQuery<Moment[]>({
    queryKey: ["moment-for-marker", markerId],
    queryFn: () => fetchMomentForMarker(markerId),
  });
};
