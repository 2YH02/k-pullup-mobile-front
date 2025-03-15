import { verifyMarkerLocation } from "@/api/marker";
import { useMutation } from "@tanstack/react-query";

export const useVerifyMarkerLocation = () => {
  return useMutation({
    mutationFn: (body: { latitude: number; longitude: number }) =>
      verifyMarkerLocation(body),
  });
};
