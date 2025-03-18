"use client";

import { Button } from "@/components/button/button";
import useMapControl from "@/hooks/use-map-control";
import { useGpsStore } from "@/store/use-gps-store";
import { useMapStore } from "@/store/use-map-store";
import { BsCrosshair } from "react-icons/bs";

const GpsButton = () => {
  const { map } = useMapStore();
  const { moveMap } = useMapControl(map, { enableDrag: false });
  const { location, requestLocation } = useGpsStore();

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  return (
    <Button
      className="bg-white text-primary-dark border border-solid border-[#eee] dark:border-grey-dark dark:bg-black dark:text-primary-dark"
      icon={<BsCrosshair />}
      onClick={() => {
        if (hasReactNativeWebView) {
          postMessage({ type: "GPS_PERMISSIONS" });
          return;
        }

        if (!location) {
          requestLocation();
          return;
        }
        moveMap({ lat: location.lat, lng: location.lng });
      }}
      clickAction
    />
  );
};

export default GpsButton;
