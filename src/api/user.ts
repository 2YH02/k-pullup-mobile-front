import { apiFetch } from "./api-fetch";

export type ContributionLevel =
  | "초보 운동자"
  | "운동 길잡이"
  | "철봉 탐험가"
  | "스트릿 워리어"
  | "피트니스 전도사"
  | "철봉 레인저"
  | "철봉 매버릭"
  | "거장"
  | "명인";

export interface UserInfo {
  chulbong?: boolean;
  contributionCount?: number;
  contributionLevel?: ContributionLevel;
  email: string;
  markerCount?: number;
  provider?: "google" | "naver" | "kakao" | "website";
  reportCount?: number;
  userId: number;
  username: string;
}

export interface Favorite {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address?: string;
}

export type ReportStatus = "APPROVED" | "DENIED" | "PENDING";

export interface ReportsRes {
  createdAt: Date;
  description: string;
  latitude: number;
  longitude: number;
  newLatitude: number;
  newLongitude: number;
  markerId: number;
  reportId: number;
  status: ReportStatus;
  photoUrls: string[];
  userId: number;
  address: string;
}

export const myInfo = async (cookie?: string): Promise<UserInfo | null> => {
  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://api.k-pullup.com/api/v1";

  const response = await fetch(`${url}/users/me`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

export const deleteUser = async () => {
  const response = await apiFetch(`/users/me`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export const updateUsername = async (name: string) => {
  return await apiFetch(`/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name }),
  });
};

export const fetchFavoritesMarker = async (): Promise<Favorite[]> => {
  return await apiFetch("/users/favorites", {
    credentials: "include",
    cache: "no-store",
  });
};

export const fetchReport = async (): Promise<ReportsRes[]> => {
  return await apiFetch(`/users/reports`, {
    credentials: "include",
    cache: "no-store",
  });
};

export interface ReportMarker {
  createdAt: string;
  description: string;
  newLatitude: number;
  newLongitude: number;
  photos: string[];
  reportID: number;
  status: ReportStatus;
}

export interface MyReportMarker {
  markerID: number;
  reports: ReportMarker[];
  address: string;
}

export interface MyMarkerReportRes {
  totalReports: number;
  markers: MyReportMarker[];
}

export const reportForMyMarker = async (): Promise<MyMarkerReportRes> => {
  return await apiFetch(`/users/reports/for-my-markers`, {
    cache: "no-store",
    credentials: "include",
  });
};
