import { create } from "zustand";

interface ViewRegisterState {
  isView: boolean;
  openRegister: () => void;
  closeRegister: () => void;
}

const useViewRegisterStore = create<ViewRegisterState>()((set) => ({
  isView: false,
  openRegister: () => set({ isView: true }),
  closeRegister: () => set({ isView: false }),
}));

export default useViewRegisterStore;
