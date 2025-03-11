import { deleteUser } from "@/api/user";
import { useUserStore } from "@/store/use-user-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useDeleteUser = () => {
  const router = useRouter();
  const { logout } = useUserStore();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      logout();
      router.refresh();
    },
  });
};
