import { SetFacilitiesPayload, setNewFacilities } from "@/api/marker";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSetNewFacilities = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SetFacilitiesPayload) => setNewFacilities(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marker-facilities", id] });
    },
  });
};
