import { sendSignupCode } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useSendSignupCode = () => {
  return useMutation({
    mutationFn: (email: string) => sendSignupCode(email),
  });
};
