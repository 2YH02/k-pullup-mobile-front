import { updateUsername } from "@/api/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useUpdateUsername = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (username: string) => updateUsername(username),
    onSuccess: () => {
      router.refresh();
    },
  });
};
