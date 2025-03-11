import { signup, type SignupPayload, type SignupRes } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSignup = ({ onSuccess }: { onSuccess?: VoidFunction }) => {
  return useMutation<SignupRes, Error, SignupPayload>({
    mutationFn: (payload: SignupPayload) => signup(payload),
    onSuccess: () => {
      onSuccess?.();
    },
  });
};
