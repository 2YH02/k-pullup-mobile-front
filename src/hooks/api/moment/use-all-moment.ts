import { getAllMoment, type Moment } from "@/api/moment";
import { useQuery } from "@tanstack/react-query";

export const useAllMoment = () => {
  return useQuery<Moment[]>({
    queryKey: ["all-moment"],
    queryFn: () => getAllMoment(),
    gcTime: 0,
  });
};
