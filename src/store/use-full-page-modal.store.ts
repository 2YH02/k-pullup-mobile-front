import { create } from "zustand";

interface FullPageModalState {
  isView: boolean;
  id: string | null;
  setId: (id: string | null) => void;
  show: (id: string) => void;
  hide: VoidFunction;
}

export const useFullPageModalStore = create<FullPageModalState>((set) => ({
  isView: false,
  id: null,
  setId: (id: string | null) => set({ id }),
  hide: () => set({ isView: false }),
  show: (id: string) => set({ isView: true, id }),
}));
