import type { NearbyMarkersRes, RankingMarker } from "@/api/marker";
import Moment from "@/app/layout/moment";
import Signin from "@/app/layout/signin";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useMarkerRanking } from "@/hooks/api/marker/use-marker-ranking";
import { useNearbyMarkers } from "@/hooks/api/marker/use-nearby-markers";
import { type GpsLocation, useGpsStore } from "@/store/use-gps-store";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

interface MomentsProps {
  close?: VoidFunction;
}

const Moments = ({ close }: MomentsProps) => {
  const { location } = useGpsStore();

  const { data: ranking, isLoading: isRankingLoading } = useMarkerRanking();
  const { data: aroundMarker, isLoading: isAroundMarkerLoading } =
    useNearbyMarkers(
      {
        latitude: location?.lat as number,
        longitude: location?.lng as number,
        distance: 1500,
        page: 1,
      },
      !!location
    );

  const [viewMoment, setViewMoment] = useState(false);
  const [curMarkerId, setCurMarkerId] = useState<null | number>(null);

  const [viewSignin, setViewSignin] = useState(false);

  const openMoment = (id: number) => {
    setCurMarkerId(id);
    setViewMoment(true);
  };

  return (
    <>
      {viewSignin && (
        <Signin close={() => setViewSignin(false)} className="z-[52]" />
      )}

      {curMarkerId && viewMoment && (
        <Moment
          className="z-[51]"
          markerId={curMarkerId}
          close={() => setViewMoment(false)}
          openSignin={() => setViewSignin(true)}
        />
      )}

      <SwipeClosePage className="z-50" headerTitle="모먼트" close={close}>
        <div className="text-center pt-6 pb-3">
          <div className="font-bold">✨ 지금 여기서 모먼트 올리기 ✨</div>
        </div>

        <Hot
          data={ranking}
          openMoment={openMoment}
          loading={isRankingLoading}
        />

        <Around
          data={aroundMarker}
          location={location}
          loading={isAroundMarkerLoading}
          openMoment={openMoment}
        />
      </SwipeClosePage>
    </>
  );
};

const Hot = ({
  data,
  openMoment,
  loading,
}: {
  data?: RankingMarker[];
  openMoment: (id: number) => void;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Section>
        <Skeleton className="w-full h-32" />
      </Section>
    );
  }

  if (!data) return null;

  return (
    <Section title="인기 철봉 TOP3">
      {data.slice(0, 3).map((marker) => {
        return (
          <button
            key={marker.markerId}
            className="block w-full active:bg-grey-light dark:active:bg-grey rounded-md"
            onClick={() => openMoment(marker.markerId)}
          >
            <div className="p-2 flex items-center">
              <div className="shrink-0 mr-2">🏅</div>
              <div className="flex grow">
                <p className="break-all text-sm">{marker.address}</p>
              </div>
              <div className="shrink-0">
                <BsChevronRight className="text-grey-dark dark:text-grey" />
              </div>
            </div>
          </button>
        );
      })}
    </Section>
  );
};

const Around = ({
  location,
  data,
  openMoment,
  loading,
}: {
  location?: GpsLocation | null;
  data?: NearbyMarkersRes;
  openMoment: (id: number) => void;
  loading: boolean;
}) => {
  if (!location) {
    return (
      <div className="mb-8 flex flex-col px-4">
        <p className="font-bold mb-1">근처 추천 철봉</p>
        <p className="text-sm">주변 철봉에서 모먼트를 공유해보세요</p>
        <p className="text-sm">위치 권한을 허용해 주세요!</p>
      </div>
    );
  }

  if (loading) {
    return (
      <Section>
        <Skeleton className="w-full h-40" />
      </Section>
    );
  }

  if (!data) return null;

  return (
    <Section title="근처 추천 철봉">
      {data.markers.slice(0, 3).map((marker) => {
        return (
          <button
            key={marker.markerId}
            className="block w-full active:bg-grey-light dark:active:bg-grey rounded-md"
            onClick={() => openMoment(marker.markerId)}
          >
            <div className="p-2 flex items-center">
              <div className="shrink-0 mr-2">📍</div>
              <div className="flex flex-col grow">
                <p className="text-left break-all text-sm">{marker.address}</p>
                <p className="text-left break-all text-xs text-grey">
                  내 위치에서{" "}
                  <span className="text-primary font-bold">
                    {Math.floor(marker.distance)}m
                  </span>
                </p>
              </div>
              <div className="shrink-0">
                <BsChevronRight />
              </div>
            </div>
          </button>
        );
      })}
    </Section>
  );
};

export default Moments;
