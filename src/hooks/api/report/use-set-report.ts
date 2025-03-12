import { reportMarker, type SubmitReportPayload } from "@/api/report";
import { useMutation } from "@tanstack/react-query";

export const useSetReport = () => {
  return useMutation({
    mutationFn: (newComment: SubmitReportPayload) => {
      return reportMarker(newComment);
    },
  });
};
