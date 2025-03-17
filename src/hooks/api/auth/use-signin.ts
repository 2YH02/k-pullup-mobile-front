import { type LoginPayload, type LoginRes, signin } from "@/api/auth";
import { useUserStore } from "@/store/use-user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignin = ({ onSuccess }: { onSuccess?: VoidFunction }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setLoading } = useUserStore();

  return useMutation<LoginRes, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => signin(payload),
    onSuccess: () => {
      setLoading(true);
      queryClient.invalidateQueries();
      router.refresh();
      onSuccess?.();
    },
  });
};
