import type { KakaoMap } from "@/types/kakao-map.types";
import { create } from "zustand";

export interface MarkerData {
  lat: number;
  lng: number;
  id: number | string;
}

interface MapState {
  map: KakaoMap | null;
  markers: MarkerData[] | null;
  isView: boolean;
  selectedMarkers: MarkerData[] | null;
  hide: VoidFunction;
  show: VoidFunction;
  setMap: (map: KakaoMap) => void;
  clearMarker: VoidFunction;
  addMarker: (marker: MarkerData) => void;
  removeMarker: (id: number | string) => void;
  changeMarkers: (markers: MarkerData[]) => void;
  selectMarkers: (marker: MarkerData[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  markers: null,
  isView: false,
  selectedMarkers: null,
  hide: () => set({ isView: false }),
  show: () => set({ isView: true }),
  setMap: (map) => set({ map }),
  clearMarker: () => set({ markers: null }),
  addMarker: (marker: MarkerData) =>
    set((state) => {
      if (state.markers) {
        return { ...state, marker: [...state.markers, marker] };
      } else {
        return { ...state, marker: [marker] };
      }
    }),
  removeMarker: (id: number | string) =>
    set((state) => {
      const removedMarker = state.markers?.filter((marker) => marker.id !== id);
      return { ...state, marker: removedMarker };
    }),
  changeMarkers: (markers: MarkerData[]) => set({ markers }),
  selectMarkers: (markers: MarkerData[]) => set({ selectedMarkers: markers }),
}));
