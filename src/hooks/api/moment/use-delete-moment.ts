import { deleteMoment } from "@/api/moment";
import useToast from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteMoment = (markerId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: { markerId: number; momentId: number }) =>
      deleteMoment(payload.markerId, payload.momentId),
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
        toast("존재하지 않는 모먼트 입니다. 다시 한번 확인해주세요.");
      } else if (error.message === "401") {
        toast("삭제 권한이 없습니다.");
      } else if (error.message === "404") {
        toast("존재하지 않는 모먼트 입니다. 다시 한번 확인해주세요.");
      } else {
        toast("서버가 원활하지 않습니다. 잠시 후 다시 시도해주세요");
      }
    },
  });
};
