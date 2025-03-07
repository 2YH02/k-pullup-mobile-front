import { type KakaoMap } from "@/types/kakao-map.types";
import { useEffect, useState } from "react";

interface MapCenterData {
  lat: number;
  lng: number;
  addr: string;
}

const useMapControl = (
  map?: KakaoMap | null,
  option?: { enableDrag?: boolean }
) => {
  const enableDrag = option?.enableDrag ?? true;
  const [center, setCenter] = useState<MapCenterData>({
    lat: 0,
    lng: 0,
    addr: "",
  });

  useEffect(() => {
    if (!map || !enableDrag) return;

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

  const addMarker = ({
    map,
    lat,
    lng,
    selected = false,
  }: {
    map: KakaoMap;
    lat: number;
    lng: number;
    selected?: boolean;
  }) => {
    const centerPosition = new window.kakao.maps.LatLng(lat, lng);

    const imageSize = selected
      ? new window.kakao.maps.Size(28, 32)
      : new window.kakao.maps.Size(28, 28);
    const imageOption = selected
      ? { offset: new window.kakao.maps.Point(14, 29) }
      : { offset: new window.kakao.maps.Point(14, 25) };
    const imageUrl = selected ? "/normal-selected.png" : "/normal.png";
    const zIndex = selected ? 3 : 2;

    const image = new window.kakao.maps.MarkerImage(
      imageUrl,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: centerPosition,
      image: image,
      zIndex: zIndex,
    });

    marker.setMap(map);

    return marker;
  };

  return { center, moveMap, addMarker };
};

export default useMapControl;
