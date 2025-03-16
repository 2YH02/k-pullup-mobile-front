import { create } from "zustand";

interface ViewSigninState {
  isView: boolean;
  openSignin: () => void;
  closeSignin: () => void;
}

const useViewSigninStore = create<ViewSigninState>()((set) => ({
  isView: false,
  openSignin: () => set({ isView: true }),
  closeSignin: () => set({ isView: false }),
}));

export default useViewSigninStore;
