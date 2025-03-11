import { fetchReport, ReportsRes } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useReportMarker = () => {
  return useQuery<ReportsRes[]>({
    queryKey: ["report-marker"],
    queryFn: fetchReport,
    gcTime: 0,
  });
};
