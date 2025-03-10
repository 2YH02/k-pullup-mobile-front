"use client";

import { type UserInfo } from "@/api/user";
import { useUserStore } from "@/store/use-user-store";
import { useEffect } from "react";

const UserProvider = ({
  user,
  children,
}: React.PropsWithChildren<{
  user: UserInfo | null;
}>) => {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user);
  }, [user]);

  return <>{children}</>;
};

export default UserProvider;
