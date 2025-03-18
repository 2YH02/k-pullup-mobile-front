import { create } from "zustand";

interface ChatState {
  isView: boolean;
  cid: string | null;
  code: string | null;
  title: string;
  setCid: (cid: string | null) => void;
  setCode: (code: string | null) => void;
  setTitle: (title: string) => void;
  show: ({ code, cid }: { code: string; cid: string }) => void;
  hide: VoidFunction;
}

export const useChatStore = create<ChatState>((set) => ({
  isView: false,
  cid: null,
  code: null,
  title: "",
  setCid: (cid: string | null) => set({ cid }),
  setCode: (code: string | null) => set({ code }),
  setTitle: (title: string) => set({ title }),
  hide: () => set({ isView: false, cid: null, code: null }),
  show: ({ code, cid }) => set({ isView: true, code, cid }),
}));
