"use client";

import MarkerDetail from "@/app/layout/marker-detail";
import Input from "@/components/input/input";
import useMapControl from "@/hooks/use-map-control";
import usePageTransition from "@/hooks/use-page-transition";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useMapStore } from "@/store/use-map-store";
import { useSessionStore } from "@/store/use-session-store";
import cn from "@/utils/cn";
import wait from "@/utils/wait";
import { useEffect, useRef, useState } from "react";
import { BsChevronLeft, BsGeoAlt, BsSearch } from "react-icons/bs";
import AroundSearchButton from "./components/around-search-button";
import AroundSearchList from "./components/around-search-list";
import GpsButton from "./components/gps-button";
import SearchResult from "./layout/search-result";
import RegisterForm from "./layout/register-form";
import useViewRegisterStore from "@/store/use-view-register-store";

export type Marker = {
  latitude: number;
  longitude: number;
  distance: number;
  markerId: number;
  description: string;
  address: string;
  thumbnail: string;
};

const mockData = [
  {
    latitude: 36.286033,
    longitude: 127.24406399999998,
    distance: 185.39123226625514,
    markerId: 6589,
    description:
      "충령탑 올라가는 길에 있는 산스장입니다. 기구 많아서 운동하기 좋습니다.",
    address: "충청남도 계룡시 엄사면 엄사리 385-4",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6589/f4276c13-1fe2-4bb6-b07c-69d20d583c37_thumb.webp",
  },
  {
    latitude: 36.283192,
    longitude: 127.238573,
    distance: 478.75089400871167,
    markerId: 6326,
    description: "",
    address: "충청남도 계룡시 엄사면 엄사리 226-28",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6326/8319c667-1415-4a0a-9e08-6a76814601ec_thumb.webp",
  },
  {
    latitude: 36.298587,
    longitude: 127.24400899999999,
    distance: 1360.5884890265302,
    markerId: 6327,
    description: "",
    address: "충청남도 계룡시 신도안면 신도안1길 88, 용남초등학교",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6327/048dd750-9628-475c-a73a-74c9620317ce_thumb.jpg",
  },
  {
    latitude: 36.274151,
    longitude: 127.25040400000002,
    distance: 1558.8617431333917,
    markerId: 5647,
    description: "계룡시청 새터산공원입니다.",
    address: "충청남도 계룡시 금암동 11-1, 새터산공원",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/5647/645b225c-024d-498b-9239-0a1de203bdb0_thumb.jpeg",
  },
  {
    latitude: 36.272919,
    longitude: 127.247184,
    distance: 1573.2868254974778,
    markerId: 7166,
    description: "",
    address: "충청남도 계룡시 금암동 175",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/7166/a3570406-3b8a-4e9b-af34-3f55f0ab7eea_thumb.webp",
  },
  {
    latitude: 36.275561,
    longitude: 127.256102,
    distance: 1746.5442303186978,
    markerId: 6969,
    description: "자전거 타기도 있고 좋은데 먼지가 좀 많습니다.",
    address: "충청남도 계룡시 금암로 127",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6969/f7c2eb69-72e2-422e-836c-4e3f74cba265_thumb.webp",
  },
  {
    latitude: 36.272313,
    longitude: 127.258818,
    distance: 2174.338278735188,
    markerId: 6972,
    description: "",
    address: "충청남도 계룡시 금암동 58",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6972/b08ff068-5639-46fa-a52e-ae1327b4f6b9_thumb.webp",
  },
  {
    latitude: 36.270892,
    longitude: 127.257288,
    distance: 2203.725316488489,
    markerId: 6973,
    description: "",
    address: "충청남도 계룡시 금암동 140-1",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6973/9e811339-4a7a-4069-83d0-a78445b0cba3_thumb.webp",
  },
  {
    latitude: 36.268972,
    longitude: 127.268066,
    distance: 3035.06000288082,
    markerId: 6328,
    description: "",
    address: "충청남도 계룡시 두마면 사계로9길 13",
    thumbnail:
      "https://chulbong-kr.s3.amazonaws.com/markers/6328/abef331f-0ff9-4746-9b91-4259c17301ce_thumb.png",
  },
];

const HomePageClient = ({ os }: { os: string }) => {
  const { map } = useMapStore();
  const { center, moveMap } = useMapControl(map);
  const { isView } = useViewRegisterStore();

  const { show, hide } = useBottomSheetStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  const [isFocused, setIsFocused] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [viewAroundSearchList, setViewAroundSearchList] = useState(false);
  const [aroundSearchList, setAroundSearchList] = useState<Marker[]>([]);

  const [aroundSearchLoading, setAroundSearchLoading] = useState(true);

  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [viewMarkerDetail, setViewMarkerDetail] = useState(false);

  const [viewSearch, setViewSearch] = useState(false);

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  const aroundSearch = async () => {
    setAroundSearchLoading(true);
    if (!viewAroundSearchList) setViewAroundSearchList(true);
    await wait(500);
    setAroundSearchList(mockData);
    setAroundSearchLoading(false);
  };

  const handleImageCache = (img: string | null) => {
    setCachedImage(img);
  };

  const openDetail = () => {
    setViewMarkerDetail(true);
  };

  const closeDetail = () => {
    setViewMarkerDetail(false);
  };

  const handleSearchModal = () => {
    if (viewSearch) {
      setViewSearch(false);
      hide();
      setSearchValue("");
      inputRef.current?.blur();
    } else {
      setViewSearch(true);
      show("search");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-full duration-100",
        viewSearch ? "" : "p-4"
      )}
    >
      {/* 위치 상세 모달 */}
      {viewMarkerDetail && (
        <MarkerDetail
          os={os}
          markerId={24}
          imageUrl={cachedImage}
          imageCache={handleImageCache}
          closeDetail={closeDetail}
        />
      )}

      {/* 검색 버튼 */}
      <div
        className={cn(
          "relative",
          viewSearch ? "w-full z-30" : "z-20",
          os === "iOS" && !viewSearch ? "pt-10" : ""
        )}
      >
        {!viewSearch && (
          <button
            className="absolute top-0 left-0 w-full h-full z-10"
            onClick={handleSearchModal}
          />
        )}

        <Input
          iconLeft={
            viewSearch ? (
              <BsChevronLeft size={20} />
            ) : (
              <BsGeoAlt
                size={20}
                className="text-grey-dark dark:text-grey-light"
              />
            )
          }
          iconRight={
            !viewSearch && (
              <BsSearch
                size={20}
                className="text-grey-dark dark:text-grey-light"
              />
            )
          }
          className={cn(
            "border-none dark:border-grey dark:bg-black",
            viewSearch
              ? os === "iOS"
                ? "pt-12 border-none rounded-none"
                : "rounded-none"
              : "",
            isFocused ? "shadow-full" : "shadow-sm"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={searchValue}
          placeholder="주소 검색"
          onChange={(e) => setSearchValue(e.target.value)}
          tabIndex={-1}
          ref={inputRef}
          iconClick={handleSearchModal}
        />
      </div>

      {/* 주변 검색, GPS 버튼 */}
      <div
        className={cn(
          "absolute bottom-6 right-2 flex gap-2 z-10 transition-all duration-100",
          viewAroundSearchList ? "bottom-52" : ""
        )}
      >
        {center.addr !== "" && center.addr !== "위치 제공 안됨" && (
          <AroundSearchButton
            address={center.addr}
            onClick={aroundSearch}
            viewAroundSearchList={viewAroundSearchList}
          />
        )}

        <GpsButton />
      </div>

      {/* 위치 데이터 */}
      {viewAroundSearchList && (
        <div className={cn("absolute bottom-2 left-0 z-10 w-full")}>
          <AroundSearchList
            data={aroundSearchList}
            isLoading={aroundSearchLoading}
            closeSlide={() => setViewAroundSearchList(false)}
            imageCache={handleImageCache}
            openDetail={openDetail}
          />
        </div>
      )}

      {/* 검색 결과 모달 */}
      {viewSearch && (
        <SearchResult
          moveMap={moveMap}
          os={os}
          value={searchValue}
          close={() => {
            setViewSearch(false);
            hide();
            setSearchValue("");
            inputRef.current?.blur();
          }}
        />
      )}

      {isView && (
        <RegisterForm
          initPosition={{ lat: center.lat, lng: center.lng, addr: center.addr }}
          os={os}
        />
      )}
    </div>
  );
};

export default HomePageClient;
