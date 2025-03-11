"use client";

import MarkerDetail from "@/app/layout/marker-detail";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import WarningText from "@/components/warning-text/warning-text";
import { useDeleteFavorite } from "@/hooks/api/marker/use-delete-favorite";
import { useMarkerFavorites } from "@/hooks/api/user/user-marker-favorites";
import PinIcon from "@/icons/pin-icon";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useState } from "react";
import { BsThreeDots, BsTrash } from "react-icons/bs";

interface BookmarkLocationProps {
  os?: string;
  close?: VoidFunction;
}

const BookmarkLocation = ({ os = "Windows", close }: BookmarkLocationProps) => {
  const { data, isLoading } = useMarkerFavorites();

  const [viewDetail, setViewDetail] = useState(false);
  const [curDetailId, setCurDetailId] = useState(0);

  if (isLoading) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="저장한 장소"
        slideType="horizontal"
      >
        <Section>
          <Skeleton className="w-full h-32" />
        </Section>
      </SwipeClosePage>
    );
  }

  if (!data || data.length <= 0) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="저장한 장소"
        slideType="horizontal"
      >
        <div className="mt-12">
          <NotFoundImage text="저장한 장소가 없습니다." size="lg" />
        </div>
      </SwipeClosePage>
    );
  }

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="저장한 장소"
      slideType="horizontal"
    >
      {(viewDetail || curDetailId !== 0) && (
        <MarkerDetail
          markerId={curDetailId}
          closeDetail={() => {
            setViewDetail(false);
            setCurDetailId(0);
          }}
        />
      )}

      <Section className="pb-0">
        <WarningText>즐겨찾기는 최대 10개까지 추가할 수 있습니다.</WarningText>
      </Section>

      {data.map((location) => {
        return (
          <ListItem
            key={location.markerId}
            id={location.markerId}
            title={location.address || "주소 정보 없음"}
            subTitle={location.description || "설명 없음"}
            leftIcon={<PinIcon size={28} />}
            onClick={() => {
              setCurDetailId(location.markerId);
              setViewDetail(true);
            }}
          />
        );
      })}
    </SwipeClosePage>
  );
};

const ListItem = ({
  id,
  title,
  subTitle,
  leftIcon,
  onClick,
}: {
  id: number;
  title?: string;
  subTitle?: string;
  leftIcon?: React.ReactElement;
  onClick?: VoidFunction;
}) => {
  const { mutate: deleteFavorite, isPending } = useDeleteFavorite();
  const { show } = useBottomSheetStore();

  return (
    <div className="px-2 py-2 active:bg-grey-light dark:active:bg-grey-dark flex border-b border-solid border-grey-light ">
      <div className="max-w-[90%] grow">
        <button
          className="flex items-center w-full text-left duration-100"
          onClick={onClick}
        >
          {leftIcon && (
            <div className="shrink-0 w-[10%] flex justify-center items-center">
              {leftIcon}
            </div>
          )}
          <div className="shrink-0 max-w-[80%]">
            <div className="font-bold break-words">{title}</div>
            <div className="text-xs text-grey break-words">{subTitle}</div>
          </div>
        </button>
      </div>
      <button
        className="shrink-0 w-[10%] flex justify-center items-center"
        onClick={(e) => {
          e.stopPropagation();
          show(`bookmark-${id}`);
        }}
      >
        <BsThreeDots className="text-grey" />
      </button>
      <BottomSheet title="북마크" id={`bookmark-${id}`} className="pb-10">
        <button
          className="p-3 w-full flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
          onClick={() => deleteFavorite(id)}
          disabled={isPending}
        >
          <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
            <BsTrash size={22} />
          </span>
          <span>삭제</span>
        </button>
      </BottomSheet>
    </div>
  );
};

export default BookmarkLocation;
