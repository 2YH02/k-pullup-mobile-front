"use client";

import { Moment } from "@/api/moment";
import HorizontalScroll from "@/components/horizontal-scroll/horizontal-scroll";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import { useAllMoment } from "@/hooks/api/moment/use-all-moment";
import usePageTransition from "@/hooks/use-page-transition";
import { useMomentStore } from "@/store/use-moment-store";
import { useSessionStore } from "@/store/use-session-store";
import { decodeBlurhash, pixelsToDataUrl } from "@/utils/decode-hash";
import { useEffect, useState } from "react";

const SocialClient = ({ os }: { os: string }) => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main os={os} headerTitle={["소셜"]}>
      <Section title="모먼트">
        <MomentList />
      </Section>
    </Main>
  );
};

export const MomentList = () => {
  const { setMoments, show: openMomentDetail, setCurMoment } = useMomentStore();

  const { data, isLoading } = useAllMoment();

  const [imageSrc, setImageSrc] = useState<string[]>([]);

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
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <HorizontalScroll className="flex gap-3">
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
                <div className="text-xs truncate p-1">
                  {getCity(moment.address)}
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </HorizontalScroll>
  );
};

const getCity = (address: string): string => {
  if (!address) return "";
  const city = address.split(" ")[1];
  return city;
};

export default SocialClient;
