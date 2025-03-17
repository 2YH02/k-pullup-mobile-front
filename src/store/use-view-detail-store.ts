import { create } from "zustand";

interface ViewDetailState {
  isView: boolean;
  id: number | null;
  imageUrl: string | null;
  imageCache: (imageUrl: string | null) => void;
  setId: (id: number | null) => void;
  show: (id: number) => void;
  hide: VoidFunction;
}

export const useViewDetailStore = create<ViewDetailState>((set) => ({
  isView: false,
  id: null,
  imageUrl: null,
  imageCache: (imageUrl: string | null) => set({ imageUrl }),
  setId: (id: number | null) => set({ id }),
  hide: () => set({ isView: false, id: null }),
  show: (id: number) => set({ isView: true, id }),
}));
