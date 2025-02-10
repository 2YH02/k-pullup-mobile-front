"use client";

import { useMapStore } from "@/store/use-map-store";
import Script from "next/script";
import { PropsWithChildren } from "react";

const MapProvider = ({ children }: PropsWithChildren) => {
  const { setMap } = useMapStore();

  const handleLoadMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.566535, 126.9779692),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(map);
    });
  };
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_APP_KEY}&libraries=services&autoload=false`}
        onLoad={handleLoadMap}
      />
      {children}
    </>
  );
};

export default MapProvider;
