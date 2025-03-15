import { verifyCode } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

interface VarifyCodePayload {
  email: string;
  code: string;
}

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: (payload: VarifyCodePayload) => verifyCode(payload),
  });
};
