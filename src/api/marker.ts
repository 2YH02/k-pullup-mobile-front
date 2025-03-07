import apiFetch from "./api-fetch";

export type FetchNearbyMarkersParams = {
  latitude: number;
  longitude: number;
  distance: number;
  page?: number;
  pageSize?: number;
};

export type Marker = {
  latitude: number;
  longitude: number;
  distance: number;
  markerId: number;
  description: string;
  address: string;
  thumbnail: string;
};

export type NearbyMarkersRes = {
  currentPage: number;
  markers: Marker[];
  totalMarkers: number;
  totalPages: number;
};

export const fetchNearbyMarkers = async ({
  latitude,
  longitude,
  distance,
  page = 1,
  pageSize,
}: FetchNearbyMarkersParams): Promise<NearbyMarkersRes> => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    distance: String(distance),
    page: String(page),
  });

  if (pageSize) {
    params.append("pageSize", String(pageSize));
  }

  return apiFetch(`/markers/close?${params.toString()}`, {
    method: "GET",
  });
};
