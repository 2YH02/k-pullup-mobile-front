import type { KakaoMap, KakaoMarker } from "@/types/kakao-map.types";
import { create } from "zustand";

export interface MarkerData {
  lat: number;
  lng: number;
  id: number | string;
  hasPhoto?: boolean;
}

interface MapState {
  map: KakaoMap | null;
  markers: KakaoMarker[] | null;
  overlays: any[];
  isView: boolean;
  selectedId: number | null;
  hide: VoidFunction;
  show: VoidFunction;
  setMap: (map: KakaoMap) => void;
  clearMarker: VoidFunction;
  addMarker: (marker: KakaoMarker) => void;
  removeMarker: (id: number | string) => void;
  setMarkers: (markers: KakaoMarker[]) => void;
  selectMarker: (selectedId: number) => void;
  setOverlays: (overlay: any[]) => void;
  deleteAllMarker: () => void;
  deleteOverlays: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  markers: null,
  overlays: [],
  isView: false,
  selectedId: null,
  hide: () => set({ isView: false }),
  show: () => set({ isView: true }),
  setMap: (map) => set({ map }),
  clearMarker: () => set({ markers: null }),
  addMarker: (marker: KakaoMarker) =>
    set((state) => {
      if (state.markers) {
        return { ...state, marker: [...state.markers, marker] };
      } else {
        return { ...state, marker: [marker] };
      }
    }),
  removeMarker: (id: number | string) =>
    set((state) => {
      const removedMarker = state.markers?.filter((marker) => marker.Gb !== id);
      return { ...state, marker: removedMarker };
    }),
  setMarkers: (markers: KakaoMarker[]) =>
    set((state) => {
      if (state.markers) {
        return { markers: [...state.markers, ...markers] };
      }
      return { markers: [...markers] };
    }),
  selectMarker: (selectedId: number) => set({ selectedId }),
  setOverlays: (overlay: any) =>
    set((state) => ({ overlays: [...state.overlays, overlay] })),
  deleteAllMarker: () =>
    set((state) => {
      if (!state.markers) return { ...state };
      state.markers.forEach((marker) => {
        marker.setMap(null);
      });

      return { ...state, markers: null };
    }),
  deleteOverlays: () =>
    set((prev) => {
      prev.overlays.forEach((overlay) => {
        overlay.setMap(null);
      });

      return { ...prev };
    }),
}));
