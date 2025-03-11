import { deleteReport, type ReportPayload } from "@/api/report";
import useToast from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ReportPayload) =>
      deleteReport({ markerId: body.markerId, reportId: body.reportId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-marker"] });
    },
    onError: () => {
      toast("잘못된 요청입니다. 잠시 후 다시 시도해주세요.");
    },
  });
};
