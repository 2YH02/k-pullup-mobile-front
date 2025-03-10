import { type UserInfo } from "@/api/user";
import { create } from "zustand";

interface UserState {
  user: UserInfo | null;
  logout: VoidFunction;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserInfo | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));
