"use client";

import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import useMarkerSearch from "@/hooks/api/use-marker-search";
import PinIcon from "@/icons/pin-icon";
import useSearchStore from "@/store/use-search-store";
import { type KakaoPlace } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { BsPinMapFill, BsXLg } from "react-icons/bs";
import MarkerDetail from "./marker-detail";

const SearchResult = ({
  os = "Windows",
  value,
  moveMap,
  close,
}: {
  os?: string;
  value: string;
  moveMap: ({ lat, lng }: { lat: number; lng: number }) => void;
  close: VoidFunction;
}) => {
  const { addSearch, searches, clearSearches, removeItem } = useSearchStore();
  const { data } = useMarkerSearch(value);

  const [result, setResult] = useState<KakaoPlace[]>([]);
  const [searchStatus, setSearchStatus] = useState<null | string>(null);

  const [viewDetail, setViewDetail] = useState(false);
  const viewMarkerId = useRef<number | null>(null);

  useEffect(() => {
    if (value.length <= 0) {
      setResult([]);
      setSearchStatus(null);
      return;
    }

    setSearchStatus(null);

    const ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (data: KakaoPlace[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchStatus(null);
        setResult([...data]);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setSearchStatus("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        setSearchStatus("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    };

    const handler = setTimeout(async () => {
      ps.keywordSearch(value, placesSearchCB);
    }, 300);

    return () => clearTimeout(handler);
  }, [value]);

  const isDataInvalid = data?.error || data?.markers.length === 0 || !data;

  return (
    <div>
      <SwipeClosePage
        className={cn("pb-10 z-20", os === "iOS" ? "pt-[88px]" : "pt-12")}
        close={close}
      >
        {value.length === 0 && searches.length > 0 && (
          <>
            <Section
              className="pb-0"
              title="지도 이동 기록"
              subTitle="목록 전체 삭제"
              subTitleClick={clearSearches}
            />
            <div>
              {searches.map((item) => {
                return (
                  <ListItem
                    key={`${item.lat} ${item.lat} ${item.address_name}`}
                    address={item.address_name}
                    place={item.place_name}
                    lat={item.lat}
                    lng={item.lng}
                    close={close}
                    moveMap={moveMap}
                    icon={<BsXLg color="#777" />}
                    iconClick={() => {
                      removeItem(item.address_name);
                    }}
                  />
                );
              })}
            </div>
          </>
        )}

        {searchStatus && isDataInvalid && (
          <div className="mt-10">
            <NotFoundImage text={searchStatus} size="md" />
          </div>
        )}

        {/* 마커 위치 검색 결과 */}
        {!isDataInvalid && (
          <div className="mb-5">
            <div className="px-4 font-bold mb-1 text-lg">철봉 위치</div>
            {data?.markers.map((marker) => {
              return (
                <div
                  key={marker.markerId}
                  className="px-4 bg-primary-light active:bg-opacity-60 dark:active:bg-opacity-40 bg-opacity-20 dark:bg-opacity-10"
                >
                  <button
                    className="flex items-center w-full py-2 text-left border-b border-solid border-grey-light duration-100"
                    onClick={() => {
                      viewMarkerId.current = marker.markerId;
                      setViewDetail(true);
                    }}
                  >
                    <div className="shrink-0 max-w-[90%]">
                      <div className="font-bold break-words">
                        {highlightText(
                          removeMarkTags(marker.address),
                          extractMarkedText(marker.address).marked
                        )}
                      </div>
                    </div>
                    <div className="grow" />
                    <div className="shrink-0 w-[10%] flex justify-center items-center">
                      <PinIcon />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 지도 이동 검색 결과 */}
        {result.length > 0 && !searchStatus && (
          <div>
            <div className="px-4 font-bold mb-1 text-lg">지도 이동</div>
            {result.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  address={item.address_name}
                  place={item.place_name}
                  lat={Number(item.y)}
                  lng={Number(item.x)}
                  close={close}
                  moveMap={moveMap}
                  icon={<BsPinMapFill className="fill-primary" />}
                  addSearch={() => {
                    addSearch({
                      lat: Number(item.y),
                      lng: Number(item.x),
                      address_name: item.address_name,
                      place_name: item.place_name,
                    });
                  }}
                />
              );
            })}
          </div>
        )}
      </SwipeClosePage>

      {viewDetail && viewMarkerId.current && (
        <MarkerDetail
          os={os}
          closeDetail={() => setViewDetail(false)}
          markerId={viewMarkerId.current}
        />
      )}
    </div>
  );
};

const ListItem = ({
  address,
  lat,
  lng,
  place,
  icon,
  addSearch,
  moveMap,
  close,
  iconClick,
}: {
  address: string;
  lat: number;
  lng: number;
  place: string;
  icon: React.ReactElement;
  moveMap: ({ lat, lng }: { lat: number; lng: number }) => void;
  addSearch?: VoidFunction;
  close: VoidFunction;
  iconClick?: VoidFunction;
}) => {
  return (
    <div className="px-4 active:bg-grey-light dark:active:bg-grey-dark">
      <button
        className="flex items-center w-full py-1 text-left border-b border-solid border-grey-light duration-100"
        onClick={() => {
          if (addSearch) addSearch();
          moveMap({ lat, lng });
          close();
        }}
      >
        <div className="shrink-0 max-w-[90%]">
          <div className="font-bold break-words">{place}</div>
          <div className="text-xs text-grey break-words">{address}</div>
        </div>
        <div className="grow" />
        <div
          className="shrink-0 w-[10%] flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation();
            if (iconClick) iconClick();
          }}
        >
          {icon}
        </div>
      </button>
    </div>
  );
};

const extractMarkedText = (
  input: string
): { marked: string[]; unmarked: string } => {
  const markRegex = /<mark>(.*?)<\/mark>/g;
  const marked: string[] = [];
  const unmarked = input.replace(markRegex, (_, p1) => {
    marked.push(p1);
    return "";
  });

  return {
    marked,
    unmarked,
  };
};

const highlightText = (text: string, highlights: string[]): React.ReactNode => {
  const regex = new RegExp(`(${highlights.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    highlights.some(
      (highlight) => part.toLowerCase() === highlight.toLowerCase()
    ) ? (
      <span key={index} className="text-primary-dark dark:text-primary-dark">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const removeMarkTags = (input: string): string => {
  return input.replace(/<\/?mark>/g, "");
};

export default SearchResult;
