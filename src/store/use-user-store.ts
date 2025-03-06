import { create } from "zustand";

export interface User {
  username: string;
  email: string;
  provider?: "kakao" | "naver" | "google";
  contributionLevel: string;
  userId: number;
  contributionCount: number;
}

interface UserState {
  user: User | null;
  logout: VoidFunction;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  logout: () => set({ user: null }),
  setUser: (user) => set({ user }),
}));
