import { type MarkerRes } from "@/api/marker";
import { create } from "zustand";

interface MarkerState {
  markers: MarkerRes[];
  setMarker: (marker: MarkerRes[]) => void;
  deleteMarker: (markerId: number) => void;
}

const useMarkerStore = create<MarkerState>()((set) => ({
  markers: [],
  setMarker: (marker: MarkerRes[]) =>
    set((prev) => ({ markers: [...prev.markers, ...marker] })),
  deleteMarker: (markerId: number) =>
    set((prev) => {
      const newMarker = prev.markers.filter(
        (item) => item.markerId !== markerId
      );

      return { markers: newMarker };
    }),
}));

export default useMarkerStore;
