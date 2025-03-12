import { type MyMarkerReportRes, reportForMyMarker } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useReportForMyMarker = () => {
  return useQuery<MyMarkerReportRes>({
    queryKey: ["report-for-my-marker"],
    queryFn: reportForMyMarker,
    gcTime: 0,
  });
};
