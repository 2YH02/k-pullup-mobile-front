import { signout } from "@/api/auth";
import { useUserStore } from "@/store/use-user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useUserStore();

  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries();
      router.refresh();
    },
  });
};
