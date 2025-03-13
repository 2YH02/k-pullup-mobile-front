import Overlay from "@/components/overlay/overlay";
import { useMapStore } from "@/store/use-map-store";
import useMarkerStore from "@/store/use-marker-store";
import { type KakaoMap } from "@/types/kakao-map.types";
import { clusterMarkers, findNearbyMarkers } from "@/utils/cluster-markers";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

interface MapCenterData {
  lat: number;
  lng: number;
  addr: string;
}

interface CreateOverlayOption {
  position?: any;
  title: string;
}

interface ReloadMarkersOprion {
  maxLevel: number;
  selectId?: number;
}

interface CreateOverlay {
  options: CreateOverlayOption;
  map: KakaoMap;
}

interface ReloadMarkers {
  options: ReloadMarkersOprion;
  map: KakaoMap;
}

const useMapControl = (
  map?: KakaoMap | null,
  option?: { enableDrag?: boolean }
) => {
  const {
    setMarkers,
    setOverlays,
    deleteAllMarker,
    deleteOverlays,
    selectMarker,
  } = useMapStore();

  const { markers } = useMarkerStore();

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

    map.panTo(moveLatLon);
  };

  const addMarker = ({
    map,
    lat,
    lng,
    id,
    selected = false,
    hasPhoto = false,
  }: {
    map: KakaoMap;
    lat: number;
    lng: number;
    id: number;
    selected?: boolean;
    hasPhoto?: boolean;
  }) => {
    const centerPosition = new window.kakao.maps.LatLng(lat, lng);

    const imageSize = selected
      ? new window.kakao.maps.Size(28, 33)
      : new window.kakao.maps.Size(28, 28);
    const imageOption = selected
      ? { offset: new window.kakao.maps.Point(14, 29) }
      : { offset: new window.kakao.maps.Point(14, 25) };
    const imageUrl = selected
      ? hasPhoto
        ? "/has-photo-selected.png"
        : "/normal-selected.png"
      : hasPhoto
      ? "has-photo.png"
      : "/normal.png";
    const zIndex = selected ? 3 : 2;

    const image = new window.kakao.maps.MarkerImage(
      imageUrl,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      map: map,
      position: centerPosition,
      image: image,
      zIndex: zIndex,
      title: id,
    });

    setMarkers([marker]);

    window.kakao.maps.event.addListener(marker, "click", () => {
      selectMarker(id);
    });
  };

  const createOverlay = ({ map, options }: CreateOverlay) => {
    const overlayDiv = document.createElement("div");
    const root = createRoot(overlayDiv);

    const overlay = new window.kakao.maps.CustomOverlay({
      position: options.position,
      content: overlayDiv,
      clickable: true,
    });

    root.render(<Overlay title={options.title} position={options.position} />);

    overlay.setMap(map);

    setOverlays(overlay);
  };

  const reloadMarkers = ({ map, options }: ReloadMarkers) => {
    if (!map) return;

    deleteAllMarker();
    deleteOverlays();
    const position = map.getCenter();
    const level = map.getLevel();

    const distance = getDistance(level);

    const nearbyMarker = findNearbyMarkers({
      markers: markers,
      latitude: position.getLat(),
      longitude: position.getLng(),
      maxDistance: distance,
    });

    if (level >= options.maxLevel) {
      const group = clusterMarkers(nearbyMarker, getCellSize(level));
      for (let i = 0; i < group.length; i++) {
        createOverlay({
          map,
          options: {
            position: new window.kakao.maps.LatLng(
              group[i].centerLatitude,
              group[i].centerLongitude
            ),
            title:
              group[i].count < 100
                ? `${group[i].count}`
                : `${roundNumber(group[i].count)}+`,
          },
        });
      }
    } else {
      for (let i = 0; i < nearbyMarker.length; i++) {
        if (options.selectId) {
          let selected: boolean;
          if (nearbyMarker[i].markerId === options.selectId) {
            selected = true;
          } else {
            selected = false;
          }
          addMarker({
            map,
            id: nearbyMarker[i].markerId,
            lat: nearbyMarker[i].latitude,
            lng: nearbyMarker[i].longitude,
            hasPhoto: nearbyMarker[i].hasPhoto,
            selected: selected,
          });
        } else {
          addMarker({
            map,
            id: nearbyMarker[i].markerId,
            lat: nearbyMarker[i].latitude,
            lng: nearbyMarker[i].longitude,
            hasPhoto: nearbyMarker[i].hasPhoto,
            selected: false,
          });
        }
      }
    }
  };

  return { center, moveMap, addMarker, createOverlay, reloadMarkers };
};

const getDistance = (level: number) => {
  switch (true) {
    case level <= 3:
      return 1;
    case level <= 5:
      return 2;
    case level <= 6:
      return 4;
    case level <= 7:
      return 7;
    case level <= 8:
      return 14;
    case level <= 9:
      return 21;
    case level <= 10:
      return 30;
    case level <= 11:
      return 40;
    default:
      return 120;
  }
};
const getCellSize = (level: number) => {
  switch (true) {
    case level === 6:
      return 0.02;
    case level === 7:
      return 0.04;
    case level === 8:
      return 0.08;
    case level === 9:
      return 0.2;
    case level === 10:
      return 0.5;
    case level === 11:
      return 0.8;
    default:
      return 1.6;
  }
};

const roundNumber = (num: number) => {
  if (num <= 99) return num;

  const strNum = num.toString();
  const length = strNum.length;

  if (length === 3) {
    return Math.floor(num / 10) * 10;
  } else if (length >= 4) {
    return Math.floor(num / 100) * 100;
  }

  return num;
};

export default useMapControl;
