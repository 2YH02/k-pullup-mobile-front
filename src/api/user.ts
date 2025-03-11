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

export const myInfo = async (cookie?: string): Promise<UserInfo | null> => {
  const url = cookie ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

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
