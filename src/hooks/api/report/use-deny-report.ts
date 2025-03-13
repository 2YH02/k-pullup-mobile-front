import { denyReport } from "@/api/report";
import useToast from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDenyReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: number) => denyReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-for-my-marker"] });
    },
    onError: () => {
      toast("잘못된 요청입니다. 잠시 후 다시 시도해주세요.");
    },
  });
};
