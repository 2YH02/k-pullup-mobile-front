import { type MarkerRes } from "@/api/marker";

interface MarkerGroup {
  centerLatitude: number;
  centerLongitude: number;
  count: number;
}

const getGridCoordinates = (
  lat: number,
  lon: number,
  cellSize: number
): { x: number; y: number } => {
  const x = Math.floor(lon / cellSize);
  const y = Math.floor(lat / cellSize);
  return { x, y };
};

export const clusterMarkers = (
  markers: MarkerRes[],
  cellSize: number
): MarkerGroup[] => {
  const groups: { [key: string]: MarkerGroup } = {};

  markers.forEach((marker) => {
    const { x, y } = getGridCoordinates(
      marker.latitude,
      marker.longitude,
      cellSize
    );
    const key = `${x},${y}`;

    if (!groups[key]) {
      groups[key] = { centerLatitude: 0, centerLongitude: 0, count: 0 };
    }

    groups[key].centerLatitude += marker.latitude;
    groups[key].centerLongitude += marker.longitude;
    groups[key].count += 1;
  });

  return Object.values(groups).map((group) => ({
    centerLatitude: group.centerLatitude / group.count,
    centerLongitude: group.centerLongitude / group.count,
    count: group.count,
  }));
};

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearbyMarkers = ({
  markers,
  latitude,
  longitude,
  maxDistance,
}: {
  markers: MarkerRes[];
  latitude: number;
  longitude: number;
  maxDistance: number;
}): MarkerRes[] => {
  return markers.filter((marker) => {
    const distance = haversineDistance(
      latitude,
      longitude,
      marker.latitude,
      marker.longitude
    );
    return distance <= maxDistance;
  });
};
