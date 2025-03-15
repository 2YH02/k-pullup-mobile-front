import { addMarker, AddMarkerPayload } from "@/api/marker";
import { useMutation } from "@tanstack/react-query";

export const useAddNewMarker = () => {
  return useMutation({
    mutationFn: (payload: AddMarkerPayload) => addMarker(payload),
  });
};
