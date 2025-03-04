import { type KakaoMap } from "@/types/kakao-map.types";
import { useEffect, useState } from "react";

interface MapCenterData {
  lat: number;
  lng: number;
  addr: string;
}

const useMapControl = (map?: KakaoMap | null) => {
  const [center, setCenter] = useState<MapCenterData>({
    lat: 0,
    lng: 0,
    addr: "",
  });

  useEffect(() => {
    if (!map) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    const handleChangeLocationMapIdle = () => {
      const position = map.getCenter();
      const lat = position.getLat();
      const lng = position.getLng();

      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
        let addr = "";
        if (status === window.kakao.maps.services.Status.OK) {
          addr = !!result[0].road_address
            ? result[0].road_address.address_name
            : result[0].address.address_name;
        } else {
          addr = "위치 제공 안됨";
        }

        setCenter({ lat, lng, addr });
      });
    };

    handleChangeLocationMapIdle();

    window.kakao.maps.event.addListener(
      map,
      "idle",
      handleChangeLocationMapIdle
    );

    return () => {
      window.kakao.maps.event.removeListener(
        map,
        "idle",
        handleChangeLocationMapIdle
      );
    };
  }, [map]);

  const moveMap = ({ lat, lng }: { lat: number; lng: number }) => {
    if (!map) return;

    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

    map.setCenter(moveLatLon);
  };

  return { center, moveMap };
};

export default useMapControl;
