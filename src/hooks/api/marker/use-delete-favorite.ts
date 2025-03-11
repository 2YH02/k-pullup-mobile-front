import { deleteFavorite } from "@/api/marker";
import useToast from "@/hooks/use-toast";
import { type MarkerDetail } from "@/types/marker.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteFavorite = (markerId?: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFavorite(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["marker-details", markerId],
      });

      const previousMarkerData: MarkerDetail = queryClient.getQueryData([
        "marker-details",
        markerId,
      ]) as MarkerDetail;

      queryClient.setQueryData(["marker-details", markerId], {
        ...previousMarkerData,
        favorited: false,
        favCount: (previousMarkerData?.favCount || 1) - 1,
      });

      return { previousMarkerData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["marker-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["marker-details", markerId] });
    },
    onError: (
      _error,
      _hero,
      context?: { previousMarkerData: MarkerDetail }
    ) => {
      if (context?.previousMarkerData) {
        queryClient.setQueryData(
          ["marker-details", markerId],
          context.previousMarkerData
        );
      }
      toast("올바르지 않은 요청입니다.");
    },
  });
};
