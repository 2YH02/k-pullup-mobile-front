"use client";

import { useMapStore } from "@/store/use-map-store";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Map = () => {
  const pathname = usePathname();
  const { map, isView, hide, show } = useMapStore();

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

  const mapStyle = isView ? "block" : "hidden";

  return (
    <div
      id="map"
      className={cn("absolute top-0 left-0 w-full h-full z-0", mapStyle)}
    />
  );
};

export default Map;
