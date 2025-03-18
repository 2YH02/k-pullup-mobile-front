import { create } from "zustand";

interface ChatState {
  isView: boolean;
  cid: string | null;
  setCid: (cid: string | null) => void;
  show: VoidFunction;
  hide: VoidFunction;
}

export const useChatStore = create<ChatState>((set) => ({
  isView: false,
  cid: null,
  setCid: (cid: string | null) => set({ cid }),
  hide: () => set({ isView: false, cid: null }),
  show: () => set({ isView: true }),
}));
