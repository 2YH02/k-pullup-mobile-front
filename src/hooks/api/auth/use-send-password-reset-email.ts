import { sendPasswordResetEmail } from "@/api/auth";
import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export const useSendPasswordResetEmail = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (email: string) => sendPasswordResetEmail(email),
    onSuccess: () => {
      toast("이메일을 확인한 후 비밀번호 초기화를 완료해주세요.");
    },
  });
};
