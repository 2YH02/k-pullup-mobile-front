import { fetchAllMarker, type MarkerRes } from "@/api/marker";
import { useQuery } from "@tanstack/react-query";

export const useAllMarker = () => {
  return useQuery<MarkerRes[]>({
    queryKey: ["all-marker"],
    queryFn: fetchAllMarker,
  });
};
