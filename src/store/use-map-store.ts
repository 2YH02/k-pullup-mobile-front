import { KakaoMap } from "@/types/kakao-map.types";
import { create } from "zustand";

interface MapState {
  map: KakaoMap | null;
  isView: boolean;
  hide: VoidFunction;
  show: VoidFunction;
  setMap: (map: KakaoMap) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  isView: false,
  hide: () => set({ isView: false }),
  show: () => set({ isView: true }),
  setMap: (map) => set({ map }),
}));
