import { SetFacilitiesPayload, setNewFacilities } from "@/api/marker";
import { useMutation } from "@tanstack/react-query";

export const useSetNewFacilities = () => {
  return useMutation({
    mutationFn: (body: SetFacilitiesPayload) => setNewFacilities(body),
  });
};
