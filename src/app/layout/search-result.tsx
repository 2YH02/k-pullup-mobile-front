"use client";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import PinIcon from "@/icons/pin-icon";
import useSearchStore from "@/store/use-search-store";
import { type KakaoPlace } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";

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
  
  const [result, setResult] = useState<KakaoPlace[]>([]);
  const [searchStatus, setSearchStatus] = useState<null | string>(null);

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

  if (value.length === 0) {
    return (
      <BottomSheet
        id="search"
        className={cn(
          "pb-10 h-full rounded-none px-0 overflow-auto",
          os === "iOS" ? "pt-[88px]" : "pt-12"
        )}
        withDimmed={false}
      >
        {searches.length > 0 && (
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
                    icon={<BsTrash3 color="#777" />}
                    iconClick={() => {
                      removeItem(item.address_name);
                    }}
                  />
                );
              })}
            </div>
          </>
        )}
      </BottomSheet>
    );
  }

  if (searchStatus) {
    return (
      <BottomSheet
        id="search"
        className={cn(
          "pb-10 h-full rounded-none px-0 overflow-auto duration-0",
          os === "iOS" ? "pt-32" : "pt-24"
        )}
        withDimmed={false}
      >
        <NotFoundImage text={searchStatus} size="md" />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      id="search"
      className={cn(
        "pb-10 h-full rounded-none px-0 overflow-auto",
        os === "iOS" ? "pt-[88px]" : "pt-12"
      )}
      withDimmed={false}
    >
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
            icon={<PinIcon />}
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
    </BottomSheet>
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
    <div className="px-4 active:bg-grey-light">
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
          className="shrink-0"
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

export default SearchResult;
