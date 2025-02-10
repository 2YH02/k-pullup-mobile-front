import { create } from "zustand";

interface SessionState {
  isFirstVisit: boolean;
  checkFirstVisit: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isFirstVisit: true,
  checkFirstVisit: () => set({ isFirstVisit: false }),
}));
