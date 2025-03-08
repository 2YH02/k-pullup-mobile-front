import { addComment, type AddCommentPayload } from "@/api/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddComment = (markerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: Omit<AddCommentPayload, "markerId">) => {
      return addComment({ markerId, ...newComment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", markerId] });
    },
  });
};
