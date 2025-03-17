import { removeMomentFavorite, type Moment } from "@/api/moment";
import useToast from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveMomentFavorite = (markerId: number, momentId: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeMomentFavorite(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["moment-for-marker", markerId],
      });

      const previousMomentData: Moment[] = queryClient.getQueryData([
        "moment-for-marker",
        markerId,
      ]) as Moment[];

      const copy = [...previousMomentData];

      const selectedMomentIndex = copy.findIndex(
        (data) => data.storyID === momentId
      );


      if (selectedMomentIndex >= 0) {
        copy[selectedMomentIndex].userLiked = false;
        copy[selectedMomentIndex].thumbsUp =
          (copy[selectedMomentIndex]?.thumbsUp || 1) - 1;
      }

      queryClient.setQueryData(["moment-for-marker", markerId], copy);

      return { previousMomentData };
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["moment-for-marker", markerId],
      });
    },

    onError: (_error, _hero, context?: { previousMomentData: Moment[] }) => {
      if (context?.previousMomentData) {
        queryClient.setQueryData(
          ["moment-for-marker", markerId],
          context.previousMomentData
        );
      }
      toast("올바르지 않은 요청입니다.");
    },
  });
};
