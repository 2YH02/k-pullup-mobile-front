"use client";

import { Button } from "@/components/button/button";
import useMapControl from "@/hooks/use-map-control";
import { useGpsStore } from "@/store/use-gps-store";
import { useMapStore } from "@/store/use-map-store";
import { BsCrosshair } from "react-icons/bs";

const GpsButton = () => {
  const { map } = useMapStore();
  const { moveMap } = useMapControl(map, { enableDrag: false });
  const { location } = useGpsStore();

  return (
    <Button
      className="bg-white text-primary-dark border border-solid border-[#eee] dark:border-grey-dark dark:bg-black dark:text-primary-dark"
      icon={<BsCrosshair />}
      onClick={() => {
        if (!location) return;
        moveMap({ lat: location.lat, lng: location.lng });
      }}
      clickAction
    />
  );
};

export default GpsButton;
