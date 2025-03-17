import type { MarkerDetail } from "@/types/marker.types";
import { apiFetch, type InfiniteMarkerRes } from "./api-fetch";

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

export type MarkerRes = Pick<
  MarkerDetail,
  "markerId" | "latitude" | "longitude" | "address" | "hasPhoto"
>;

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

export const deleteFavorite = async (id: number) => {
  return await apiFetch(
    `/markers/${id}/favorites`,
    {
      method: "DELETE",
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const addToFavorite = async (id: number) => {
  return await apiFetch(`/markers/${id}/favorites`, {
    method: "POST",
    credentials: "include",
  });
};

export interface RegisteredMarker {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address?: string;
}

export const fetchMyMarkers = async (
  pageParam: number
): Promise<InfiniteMarkerRes<RegisteredMarker>> => {
  return await apiFetch(`/markers/my?page=${pageParam}&pageSize=5`, {
    credentials: "include",
  });
};

export interface SetFacilitiesPayload {
  markerId: number;
  facilities: Omit<Facilities, "markerId">[];
}

export const setNewFacilities = async (body: SetFacilitiesPayload) => {
  return await apiFetch(
    `/markers/facilities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    },
    { returnType: "text" }
  );
};

export const fetchAllMarker = async (): Promise<MarkerRes[]> => {
  return await apiFetch(`/markers`);
};

export interface AddMarkerPayload {
  photos: File[];
  latitude: number;
  longitude: number;
  description: string;
}

export interface AddMarkerRes
  extends Omit<MarkerDetail, "photos" | "createdAt" | "updatedAt"> {
  photoUrls?: string[];
}

export const verifyMarkerLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return await apiFetch(
    `/markers/verify?latitude=${latitude}&longitude=${longitude}`,
    {
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export const addMarker = async (
  multipart: AddMarkerPayload
): Promise<MarkerRes> => {
  const formData = new FormData();

  for (let i = 0; i < multipart.photos.length; i++) {
    formData.append("photos", multipart.photos[i]);
  }

  formData.append("latitude", multipart.latitude.toString());
  formData.append("longitude", multipart.longitude.toString());
  formData.append("description", multipart.description);

  return await apiFetch(`/markers/new`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
};

export const deleteMarker = async (id: number) => {
  await apiFetch(
    `/markers/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    { returnType: "text" }
  );
};

export type DownloadPdf = {
  lat: number;
  lng: number;
};

export const downloadPdf = async ({ lat, lng }: DownloadPdf) => {
  return await apiFetch(
    `/markers/save-offline?latitude=${lat}&longitude=${lng}`,
    {},
    { returnType: "blob" }
  );
};
