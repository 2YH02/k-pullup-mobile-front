import { deleteComment } from "@/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteComment = (markerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", markerId] });
    },
  });
};
