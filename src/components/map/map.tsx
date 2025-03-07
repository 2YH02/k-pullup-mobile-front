"use client";

import useMapControl from "@/hooks/use-map-control";
import { useMapStore } from "@/store/use-map-store";
import { type KakaoMarker } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Map = () => {
  const pathname = usePathname();
  const { map, isView, hide, show, markers, selectedMarkers } = useMapStore();
  const { addMarker } = useMapControl(map, { enableDrag: false });

  const [kakaoMarkers, setKakaoMarkers] = useState<KakaoMarker[]>([]);

  useEffect(() => {
    if (!map) return;
    map.relayout();
  }, [isView]);

  useEffect(() => {
    if (pathname === "/") {
      show();
    } else {
      hide();
    }
  }, [pathname]);

  useEffect(() => {
    if (!map || !markers) return;

    kakaoMarkers.forEach((marker) => marker.setMap(null));

    markers.forEach((marker) => {
      const selected = selectedMarkers?.findIndex(
        (selectedmarker) => marker.id !== selectedmarker.id
      );

      const kakaoMarker = addMarker({
        map,
        lat: marker.lat,
        lng: marker.lng,
        selected: !!selected,
      });
      setKakaoMarkers((prev) => [...prev, kakaoMarker]);
    });
  }, [markers, selectedMarkers]);

  const mapStyle = isView ? "block" : "hidden";

  return (
    <div
      id="map"
      className={cn("absolute top-0 left-0 w-full h-full z-0", mapStyle)}
    />
  );
};

export default Map;
