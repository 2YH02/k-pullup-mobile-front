"use client";

import MarkerDetail from "@/app/layout/marker-detail";
import Input from "@/components/input/input";
import { useNearbyMarkers } from "@/hooks/api/marker/use-nearby-markers";
import useMapControl from "@/hooks/use-map-control";
import usePageTransition from "@/hooks/use-page-transition";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useMapStore } from "@/store/use-map-store";
import { useSessionStore } from "@/store/use-session-store";
import useViewRegisterStore from "@/store/use-view-register-store";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { BsChevronLeft, BsGeoAlt, BsSearch } from "react-icons/bs";
import AroundSearchButton from "./components/around-search-button";
import AroundSearchList from "./components/around-search-list";
import GpsButton from "./components/gps-button";
import RegisterForm from "./layout/register-form";
import SearchResult from "./layout/search-result";

export type Marker = {
  latitude: number;
  longitude: number;
  distance: number;
  markerId: number;
  description: string;
  address: string;
  thumbnail: string;
};

const HomePageClient = ({ os }: { os: string }) => {
  const { map } = useMapStore();
  const { center, moveMap } = useMapControl(map);

  const { data, isLoading, isFetching, refetch } = useNearbyMarkers({
    latitude: center.lat,
    longitude: center.lng,
    distance: 1000,
    pageSize: 10,
    page: 1,
  });

  const { isView } = useViewRegisterStore();

  const { show, hide } = useBottomSheetStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  const [isFocused, setIsFocused] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [viewAroundSearchList, setViewAroundSearchList] = useState(false);

  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [viewMarkerDetail, setViewMarkerDetail] = useState(false);
  const [curMarkerId, setCurMarkerId] = useState<number | null>(null);

  const [viewSearch, setViewSearch] = useState(false);

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  const aroundSearch = async () => {
    refetch();
    setViewAroundSearchList(true);
  };

  const handleImageCache = (img: string | null) => {
    setCachedImage(img);
  };

  const openDetail = (id: number) => {
    setViewMarkerDetail(true);
    setCurMarkerId(id);
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
      {viewMarkerDetail && curMarkerId && (
        <MarkerDetail
          os={os}
          markerId={curMarkerId}
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

      {/* 주변 검색 결과 */}
      {viewAroundSearchList && (
        <div className={cn("absolute bottom-2 left-0 z-10 w-full")}>
          <AroundSearchList
            data={data?.markers || []}
            isLoading={isLoading || isFetching}
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
