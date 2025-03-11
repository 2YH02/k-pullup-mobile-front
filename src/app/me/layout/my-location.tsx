"use client";

import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useInfiniteMyMarker } from "@/hooks/api/marker/use-infinite-my-marker";
import PinIcon from "@/icons/pin-icon";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useEffect, useMemo, useRef } from "react";
import { BsThreeDots, BsTrash } from "react-icons/bs";

interface MyLocationProps {
  os?: string;
  close?: VoidFunction;
  openDetail: (id: number) => void;
}

const MyLocation = ({ os = "Windows", close, openDetail }: MyLocationProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteMyMarker();

  const markers = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.markers);
  }, [data]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="등록한 장소"
        slideType="horizontal"
      >
        <Section className="pb-0">
          <Skeleton className="w-full h-10" />
        </Section>
        <Section>
          <Skeleton className="w-full h-44" />
        </Section>
      </SwipeClosePage>
    );
  }

  if (!data || markers.length === 0) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="등록한 장소"
        slideType="horizontal"
      >
        <div className="mt-12">
          <NotFoundImage text="등록한 장소가 없습니다." size="lg" />
        </div>
      </SwipeClosePage>
    );
  }

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="등록한 장소"
      slideType="horizontal"
    >
      <div className="p-2" />
      {markers.map((marker, index) => {
        return (
          <ListItem
            key={`${marker.markerId} ${index}`}
            id={marker.markerId}
            title={marker.address || "주소 정보 없음"}
            subTitle={marker.description || "설명 없음"}
            leftIcon={<PinIcon size={28} />}
            onClick={() => {
              openDetail(marker.markerId);
            }}
          />
        );
      })}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && <Skeleton className="w-[94%] h-14 mx-auto" />}
      </div>
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
  //   const { mutate: deleteFavorite, isPending } = useDeleteFavorite();
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
          //   onClick={() => deleteFavorite(id)}
          //   disabled={isPending}
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

export default MyLocation;
