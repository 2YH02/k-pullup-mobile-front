import { create } from "zustand";

export type GpsLocation = {
  lat: number;
  lng: number;
};

interface gpsState {
  location: GpsLocation | null;
  setLocation: (location: GpsLocation) => void;
}

export const useGpsStore = create<gpsState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));
