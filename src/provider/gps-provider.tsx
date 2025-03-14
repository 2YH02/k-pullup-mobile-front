"use client";

import useMapControl from "@/hooks/use-map-control";
import useToast from "@/hooks/use-toast";
import useAlertStore from "@/store/use-alert-store";
import { useGpsStore } from "@/store/use-gps-store";
import { useMapStore } from "@/store/use-map-store";
import { UsePostMessage } from "@/store/use-post-message";
import { useEffect, useRef } from "react";

const GPSProvider = ({ children }: React.PropsWithChildren) => {
  const hasInitialized = useRef(false);

  const { openAlert } = useAlertStore();

  const { map } = useMapStore();
  const { moveMap } = useMapControl(map, { enableDrag: false });
  const { toast } = useToast();

  const { postMessage } = UsePostMessage();
  const { location, requestLocation, error } = useGpsStore();

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  useEffect(() => {
    if (hasReactNativeWebView) {
      postMessage({ type: "GPS_PERMISSIONS" });
      return;
    }

    if (!location) {
      requestLocation();
    }
  }, [location, requestLocation]);

  useEffect(() => {
    if (!error) return;
    if (error.code === 1) {
      openAlert({
        title: "위치 서비스 사용",
        description:
          "위치 서비스를 사용할 수 없습니다. 브라우저 설정에서 위치 서비스를 켜주세요.",
        cancel: true,
        onClick: () => {},
      });
    } else {
      toast("현재 위치를 불러올 수 없습니다.");
    }
  }, [error]);

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
