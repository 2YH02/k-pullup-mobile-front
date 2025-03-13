"use client";

import useMapControl from "@/hooks/use-map-control";
import useToast from "@/hooks/use-toast";
import { useGpsStore } from "@/store/use-gps-store";
import { useMapStore } from "@/store/use-map-store";
import { UsePostMessage } from "@/store/use-post-message";
import { useEffect, useRef } from "react";

interface GeolocationCoordinates {
  accuracy: number;
  latitude: number;
  longitude: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

interface GeolocationPosition {
  timestamp: number;
  coords: GeolocationCoordinates;
}

const GPSProvider = ({ children }: React.PropsWithChildren) => {
  const hasInitialized = useRef(false);

  const { map } = useMapStore();
  const { moveMap } = useMapControl(map, { enableDrag: false });
  const { toast } = useToast();

  const { postMessage } = UsePostMessage();
  const { setLocation, location } = useGpsStore();

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  useEffect(() => {
    if (hasReactNativeWebView) {
      postMessage({ type: "GPS_PERMISSIONS" });
      return;
    }

    const options = {
      enableHighAccuracy: false,
      maximumAge: 0,
    };

    const success = (pos: GeolocationPosition) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    };

    const error = (err: any) => {
      console.log(err);
      toast("위치 정보 제공 안됨");
    };

    const id = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  useEffect(() => {
    if (!location || !map) return;

    if (!hasInitialized.current) {
      moveMap({ lat: location.lat, lng: location.lng });
      hasInitialized.current = true;
    }
  }, [location, map]);

  return <>{children}</>;
};

export default GPSProvider;
