import { type InfiniteMarkerRes } from "@/api/api-fetch";
import { fetchMyMarkers, type RegisteredMarker } from "@/api/marker";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteMyMarker = () => {
  return useInfiniteQuery<InfiniteMarkerRes<RegisteredMarker>>({
    queryKey: ["my-location"],
    queryFn: ({ pageParam = 1 }) => fetchMyMarkers(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    gcTime: 0,
  });
};
