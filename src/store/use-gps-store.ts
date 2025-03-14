import { create } from "zustand";

export type GpsLocation = {
  lat: number;
  lng: number;
};

interface gpsState {
  location: GpsLocation | null;
  error: { code: number; message: string } | null;
  setLocation: (location: GpsLocation) => void;
  requestLocation: () => void;
}

export const useGpsStore = create<gpsState>((set) => ({
  location: null,
  error: null,
  setLocation: (location) => set({ location }),
  requestLocation: () => {
    if (!navigator.geolocation) {
      console.error("위치 정보 서비스가 재공되지 않는 브라우저입니다.");
      return;
    }
    const options = { enableHighAccuracy: false, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        set({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (err: { code: number; message: string }) => {
        console.error(err);
        set({ error: err });
      },
      options
    );
  },
}));
