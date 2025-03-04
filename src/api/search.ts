import apiFetch from "./api-fetch";

export interface SearchMarkers {
  address: string;
  markerId: number;
}

export interface SearchMarkersRes {
  took: number;
  markers: SearchMarkers[];
  error?: string;
  message?: string;
}

export const searchMarkers = async (query: string): Promise<SearchMarkersRes> => {
  return apiFetch(`/search/marker?term=${query}`);
};
