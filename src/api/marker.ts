import type { MarkerDetail } from "@/types/marker.types";
import { apiFetch } from "./api-fetch";

export interface FetchNearbyMarkersParams {
  latitude: number;
  longitude: number;
  distance: number;
  page?: number;
  pageSize?: number;
}

export interface Marker {
  latitude: number;
  longitude: number;
  distance: number;
  markerId: number;
  description: string;
  address: string;
  thumbnail: string;
}

export interface NearbyMarkersRes {
  currentPage: number;
  markers: Marker[];
  totalMarkers: number;
  totalPages: number;
}

export interface Facilities {
  facilityId: number;
  quantity: number;
  markerId: number;
}

export interface Weather {
  temperature: string;
  desc: string;
  humidity: string;
  rainfall: string;
  snowfall: string;
  iconImage: string;
}

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

  return apiFetch(`/markers/close?${params.toString()}`);
};

export const fetchMarkerDetails = async (id: number): Promise<MarkerDetail> => {
  return apiFetch(`/markers/${id}/details`, {
    credentials: "include",
  });
};

export const fetchMarkerFacilities = async (
  markerId: number
): Promise<Facilities[]> => {
  return apiFetch(`/markers/${markerId}/facilities`, {
    credentials: "include",
  });
};

export const fetchMarkerWeather = async (
  latitude: number,
  longitude: number
): Promise<Weather> => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  return apiFetch(`/markers/weather?${params.toString()}`);
};
