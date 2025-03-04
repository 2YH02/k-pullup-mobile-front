"use client";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import PinIcon from "@/icons/pin-icon";
import { KakaoPagination, type KakaoPlace } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { useEffect, useState } from "react";

const SearchResult = ({
  os = "Windows",
  value,
}: {
  os?: string;
  value: string;
}) => {
  const [result, setResult] = useState<KakaoPlace[]>([]);
  const [searchStatus, setSearchStatus] = useState<null | string>(null);

  useEffect(() => {
    if (value.length <= 0) {
      setResult([]);
      setSearchStatus(null);
      return;
    }

    setSearchStatus(null);

    let ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (
      data: KakaoPlace[],
      status: string,
      _: KakaoPagination
    ) => {
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
          <div key={item.id} className="px-4 active:bg-grey-light">
            <button className="flex items-center w-full py-1 text-left active:scale-95 border-b border-solid border-grey-light duration-100">
              <div className="shrink-0 max-w-[90%]">
                <div className="font-bold break-words">{item.place_name}</div>
                <div className="text-xs text-grey break-words">
                  {item.address_name}
                </div>
              </div>
              <div className="grow" />
              <div className="shrink-0">
                <PinIcon />
              </div>
            </button>
          </div>
        );
      })}
    </BottomSheet>
  );
};

export default SearchResult;
