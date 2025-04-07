"use client";

import { type Moment } from "@/api/moment";
import HorizontalScroll from "@/components/horizontal-scroll/horizontal-scroll";
import Skeleton from "@/components/skeleton/skeleton";
import { useAllMoment } from "@/hooks/api/moment/use-all-moment";
import { useMomentStore } from "@/store/use-moment-store";
import { decodeBlurhash, pixelsToDataUrl } from "@/utils/decode-hash";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Moments from "./moments";

interface MomentListProps {
  withTitle?: boolean;
  withAddButton?: boolean;
}

export const MomentList = ({ withTitle, withAddButton }: MomentListProps) => {
  const { setMoments, show: openMomentDetail, setCurMoment } = useMomentStore();

  const { data, isLoading } = useAllMoment();

  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [viewMoments, setViewMoments] = useState(false);

  useEffect(() => {
    if (!data) return;
    setMoments(data);
    const width = 100;
    const height = 100;

    const pixelsMap = data.map((moment) => {
      return decodeBlurhash(moment.blurhash, width, height);
    });

    if (!pixelsMap) return;
    const urlMap = pixelsMap.map((pixels) => {
      return pixelsToDataUrl(pixels, width, height);
    });

    setImageSrc(urlMap);
  }, [data]);

  const handleClick = (moment: Moment) => {
    setCurMoment(moment);
    openMomentDetail();
  };

  if (isLoading) {
    return (
      <div>
        {withTitle && <div className="mb-2 font-bold text-lg">모먼트</div>}
        <div className="flex gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {withTitle && data.length > 0 && (
        <div className="mb-2 font-bold text-lg">모먼트</div>
      )}

      {viewMoments && <Moments close={() => setViewMoments(false)} />}

      <HorizontalScroll className="gap-3">
        {withAddButton && (
          <div className="flex flex-col justify-start">
            <button
              className="relative shrink-0 bg-rainbow-gradient rounded-full w-12 h-12 bg-[length:200%_200%] animate-gradient-animate"
              onClick={() => setViewMoments(true)}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white dark:bg-black rounded-full
              border-2 border-solid border-white dark:border-black flex items-center justify-center"
              >
                <BsPlusLg size={22} className="text-grey-dark dark:text-grey" />
              </div>
            </button>
          </div>
        )}

        {data.map((moment, index) => {
          return (
            <div
              key={moment.storyID}
              className="flex flex-col justify-center items-center"
            >
              <button
                className="relative shrink-0 bg-rainbow-gradient rounded-full w-12 h-12 bg-[length:200%_200%] animate-gradient-animate"
                onClick={() => handleClick(moment)}
              >
                <div
                  className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full
                  border-2 border-solid border-white dark:border-black"
                  style={{
                    backgroundImage: imageSrc[index]
                      ? `url(${imageSrc[index]})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "",
                  }}
                >
                  <div className="text-[10px] truncate p-1">
                    {getCity(moment.address)}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </HorizontalScroll>
    </div>
  );
};

const getCity = (address: string): string => {
  if (!address) return "";
  const city = address.split(" ")[1];
  return city;
};
