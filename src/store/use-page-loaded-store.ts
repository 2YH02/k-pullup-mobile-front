import { create } from "zustand";

interface PageLoadedState {
  isPageLoaded: boolean;
  setPageLoaded: (loaded: boolean) => void;
}

export const usePageLoadedStore = create<PageLoadedState>((set) => ({
  isPageLoaded: true,
  setPageLoaded: (loaded: boolean) => set({ isPageLoaded: loaded }),
}));
