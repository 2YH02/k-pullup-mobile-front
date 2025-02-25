"use client";

import usePageTransition from "@/hooks/use-page-transition";
import MarkerDetail from "@/app/layout/marker-detail";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";

export type Photo = {
  uploadedAt: string;
  photoId: number;
  markerId: number;
  photoUrl: string;
  thumbnailUrl: string;
};

type Marker = {
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  markerId: number;
  userId: number;
  description: string;
  address: string;
  photos: Photo[];
  username: string;
  favCount: number;
  disliked: boolean;
};

const mockDetailData: Marker = {
  // latitude: 36.286033,
  // longitude: 127.24406399999998,
  latitude: 36.274151,
  longitude: 127.25040400000002,
  createdAt: "2024-05-14T01:43:44Z",
  updatedAt: "2024-07-19T13:04:34Z",
  markerId: 5647,
  userId: 12,
  description: "계룡시청 새터산공원입니다.",
  address: "충청남도 계룡시 금암동 11-1, 새터산공원",
  photos: [
    {
      uploadedAt: "2024-05-14T01:43:45Z",
      photoId: 109,
      markerId: 5647,
      photoUrl:
        "https://chulbong-kr.s3.amazonaws.com/markers/5647/a56efd94-e3e4-4a18-b7c8-553e9f3a3ac2.jpeg",
      thumbnailUrl:
        "https://chulbong-kr.s3.amazonaws.com/markers/5647/a56efd94-e3e4-4a18-b7c8-553e9f3a3ac2_thumb.jpeg",
    },
    {
      uploadedAt: "2024-05-14T01:43:45Z",
      photoId: 108,
      markerId: 5647,
      photoUrl:
        "https://chulbong-kr.s3.amazonaws.com/markers/5647/645b225c-024d-498b-9239-0a1de203bdb0.jpeg",
      thumbnailUrl:
        "https://chulbong-kr.s3.amazonaws.com/markers/5647/645b225c-024d-498b-9239-0a1de203bdb0_thumb.jpeg",
    },
  ],
  username: "감자",
  favCount: 5,
  disliked: false,
};

type Facility = {
  facilityId: number;
  markerId: number;
  quantity: number;
};

type Facilities = Facility[];

const mockFacilitiesData: Facilities = [
  { facilityId: 1, markerId: 5647, quantity: 3 },
  { facilityId: 2, markerId: 5647, quantity: 0 },
];

type Weather = {
  temperature: string;
  desc: string;
  iconImage: string;
  humidity: string;
  rainfall: string;
  snowfall: string;
};

const mockWeatherData: Weather = {
  temperature: "6.3",
  desc: "맑음",
  iconImage:
    "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/weather/ico_weather1.png",
  humidity: "28",
  rainfall: "0.0",
  snowfall: "",
};

export type MarkerDetailExtras = Marker & {
  facilities: Facilities;
  weather: Weather;
};

export const mockDetailDataWithExtras: MarkerDetailExtras = {
  ...mockDetailData,
  facilities: mockFacilitiesData,
  weather: mockWeatherData,
};

const PullupPageClient = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return <MarkerDetail markerId={12} />;
};

export default PullupPageClient;
