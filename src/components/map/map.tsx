"use client";

import { useAllMarker } from "@/hooks/api/marker/use-all-marker";
import useMapControl from "@/hooks/use-map-control";
import { useGpsStore } from "@/store/use-gps-store";
import { useMapStore } from "@/store/use-map-store";
import useMarkerStore from "@/store/use-marker-store";
import { type CustomOverlay } from "@/types/custom-overlay.types";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Map = () => {
  const pathname = usePathname();

  const { map, isView, hide, show, selectedId } = useMapStore();
  const { reloadMarkers } = useMapControl(map, { enableDrag: false });
  const { location } = useGpsStore();
  const { setMarker, markers } = useMarkerStore();

  const { data: allMarker } = useAllMarker();

  const [myLocateOverlay, setMyLocateOverlay] = useState<CustomOverlay | null>(
    null
  );

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
    if (!map || !location) return;

    if (myLocateOverlay) {
      myLocateOverlay.setMap(null);
    }

    const moveLatLon = new window.kakao.maps.LatLng(location.lat, location.lng);

    const overlayDiv = document.createElement("div");
    const root = createRoot(overlayDiv);

    root.render(<MyLocateOverlay />);

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: moveLatLon,
      content: overlayDiv,
      zIndex: 10,
    });

    customOverlay.setMap(map);
    setMyLocateOverlay(customOverlay);
  }, [map, location]);

  useEffect(() => {
    if (!allMarker || !map) return;
    setMarker(allMarker);
  }, [allMarker]);

  useEffect(() => {
    if (!map || markers.length <= 0) return;

    const handleIdle = () => {
      if (selectedId) {
        reloadMarkers({ map, options: { maxLevel: 6, selectId: selectedId } });
      } else {
        reloadMarkers({ map, options: { maxLevel: 6 } });
      }
    };

    handleIdle();

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [map, markers, selectedId]);

  const mapStyle = isView ? "block" : "hidden";

  return (
    <div
      id="map"
      className={cn("absolute top-0 left-0 w-full h-full z-0", mapStyle)}
    />
  );
};

const MyLocateOverlay = () => {
  return (
    <span className="relative flex size-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d95550] opacity-75"></span>
      <span className="relative inline-flex size-3 rounded-full bg-[#d95550]"></span>
    </span>
  );
};

export default Map;
