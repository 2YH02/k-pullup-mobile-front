import { postMoment, PostMomentPayload } from "@/api/moment";
import useToast from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostMoment = (markerId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: PostMomentPayload) => postMoment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["moment-for-marker", markerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-moment"],
      });
    },
    onError: (error) => {
      if (error.message === "400") {
        toast("입력이 유효하지 않습니다. 다시 한번 확인해주세요.");
      } else if (error.message === "409") {
        toast("등록이 이미 완료되었습니다.");
      } else {
        toast("서버가 원활하지 않습니다. 잠시 후 다시 시도해주세요");
      }
    },
  });
};
