import { deleteMarker } from "@/api/marker";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMarker = () => {
  return useMutation({
    mutationFn: (id: number) => deleteMarker(id),
  });
};
