import { create } from "zustand";

interface BottomSheetState {
  isView: boolean;
  show: VoidFunction;
  hide: VoidFunction;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isView: false,
  hide: () => set({ isView: false }),
  show: () => set({ isView: true }),
}));
