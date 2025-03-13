import { create } from "zustand";

interface ViewDetailState {
  isView: boolean;
  id: number | null;
  setId: (id: number | null) => void;
  show: (id: number) => void;
  hide: VoidFunction;
}

export const useViewDetailStore = create<ViewDetailState>((set) => ({
  isView: false,
  id: null,
  setId: (id: number | null) => set({ id }),
  hide: () => set({ isView: false, id: null }),
  show: (id: number) => set({ isView: true, id }),
}));
