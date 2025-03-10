import apiFetch from "./api-fetch";

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

export interface MyInfo {
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

const myInfo = async (): Promise<MyInfo> => {
  return await apiFetch(`/users/me`, {
    cache: "no-store",
    credentials: "include",
  });
};

export default myInfo;
