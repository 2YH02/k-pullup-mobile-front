import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments, CommentsRes } from "@/api/comments";

export const useInfiniteComments = (markerId: number) => {
  return useInfiniteQuery<CommentsRes>({
    queryKey: ["comments", markerId],
    queryFn: ({ pageParam = 1 }) =>
      fetchComments({ markerId, pageParam: pageParam as number }),
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
