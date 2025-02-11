import { type MarkerDetailExtras } from "@/app/pullup/[id]/pullup-page-client";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { KakaoMap } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BsArrowLeftShort,
  BsBookmark,
  BsFillPinMapFill,
  BsFillShareFill,
  BsPersonBoundingBox,
} from "react-icons/bs";
import Slider from "react-slick";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const DRAG_THRESHOLD = 40;
const CLOSE_OPACITY_THRESHOLD = 0.4;
const MIN_OPACITY = 0.3;
const OPACITY_STEP = 0.005;
const RESET_OPACITY_DELAY = 250;

interface MarkerDetailProps {
  imageUrl?: string | null;
  viewMarkerDetail?: boolean;
  isLoading?: boolean;
  markerData: MarkerDetailExtras | null;
  closeDetail?: VoidFunction;
  imageCache?: (img: string | null) => void;
}

const MarkerDetail = ({
  markerData,
  imageUrl,
  viewMarkerDetail = true,
  isLoading,
  closeDetail,
  imageCache,
}: MarkerDetailProps) => {
  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const handleDragStart = (clientY: number) => {
    isDragging.current = true;
    startY.current = clientY;
  };

  const handleDragMove = (clientY: number) => {
    if (startY.current) {
      const deltaY = clientY - startY.current;
      const newOpacity = Math.max(
        MIN_OPACITY,
        1 - Math.abs(deltaY) * OPACITY_STEP
      );
      if (Math.abs(deltaY) > DRAG_THRESHOLD) {
        setTranslateY(deltaY);
        setOpacity(newOpacity);
      }
    }
  };

  const handleDragEnd = () => {
    if (startY.current) {
      if (opacity < CLOSE_OPACITY_THRESHOLD) {
        closeDetail?.();
        setOpacity(0);
        setTimeout(() => setOpacity(1), RESET_OPACITY_DELAY);
      } else {
        setTranslateY(0);
        setOpacity(1);
      }
      isDragging.current = false;
      startY.current = null;
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDragStart(e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDragMove(e.clientY);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragMove(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  const slideSettings = {
    accessibility: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const computedTransform = viewMarkerDetail
    ? isDragging.current
      ? `translateY(${translateY}px) translateX(-50%)`
      : `translateY(0) translateX(-50%)`
    : `translateY(100%) translateX(-50%)`;

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 w-full h-full bg-white z-30 max-w-[480px] dark:bg-black overflow-auto overflow-x-hidden",
        viewMarkerDetail ? "translate-y-0" : "translate-y-full",
        !isDragging.current ? "duration-200" : "duration-0 scale-50"
      )}
      style={{
        transform: computedTransform,
        opacity: opacity,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div>
        <Button
          icon={<BsArrowLeftShort size={26} />}
          clickAction
          className="absolute top-2 left-2 z-40 rounded-full bg-[rgba(255,255,255,0.7)] text-black p-1"
          onClick={() => {
            closeDetail?.();
            imageCache?.(null);
          }}
        />

        <div className="w-full h-52">
          {imageUrl && isLoading ? (
            <div className="w-full h-52">
              <img
                src={imageUrl}
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <Slider {...slideSettings} className="">
              {markerData?.photos.map((data, index) => (
                <div
                  key={data.photoId}
                  className="w-full h-52 focus:outline-none"
                >
                  <img
                    src={data.photoUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
      {isLoading || !markerData ? (
        <div>로딩중...</div>
      ) : (
        <>
          <Section className="flex flex-wrap gap-2 pb-0">
            {markerData.facilities[0].quantity > 0 && (
              <MarkerDetailBadge>
                철봉 {markerData.facilities[0].quantity} 개
              </MarkerDetailBadge>
            )}
            {markerData.facilities[1].quantity > 0 && (
              <MarkerDetailBadge>
                평행봉 {markerData.facilities[1].quantity} 개
              </MarkerDetailBadge>
            )}
            {markerData.weather && (
              <MarkerDetailBadge>
                <div className="relative w-5 h-5 shrink-0">
                  <Image
                    src={markerData.weather.iconImage}
                    fill
                    alt={markerData.weather.desc}
                  />
                </div>
                <div className="shrink-0">
                  {markerData.weather.temperature} °C
                </div>
              </MarkerDetailBadge>
            )}
          </Section>
          <Section className="pb-0">
            <h1 className="text-xl ">{markerData.address}</h1>
            <p className="text-sm font-bold mb-2">{markerData.description}</p>
            <p className="text-xs text-grey mb-2">
              최종 수정일: {formatDate(markerData.updatedAt)}
            </p>
            <div className="flex justify-between text-xs mb-4">
              <button className="underline">정보 수정 요청</button>
              <span className="flex items-center">
                <span className="mr-1">
                  <StarIcon />
                </span>
                <span>정보 제공자: {markerData.username}</span>
              </span>
            </div>
            <div className="flex h-16 border-t border-solid border-[#ccc]">
              {/* <BsBookmarkFill /> */}
              <IconButton
                icon={<BsBookmark size={20} className="fill-primary" />}
              >
                북마크
              </IconButton>
              <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
              <IconButton
                icon={<BsFillPinMapFill size={20} className="fill-primary" />}
              >
                거리뷰
              </IconButton>
              <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
              <IconButton
                icon={
                  <BsPersonBoundingBox size={20} className="fill-primary" />
                }
              >
                모먼트
              </IconButton>
              <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
              <IconButton
                icon={<BsFillShareFill size={20} className="fill-primary" />}
              >
                공유
              </IconButton>
            </div>
          </Section>
          <div className="w-gull h-4 bg-grey-light" />
          <Section>
            <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
              <Map />
            </div>
            <Button fullWidth clickAction className="bg-primary">
              길찾기
            </Button>
          </Section>
          <div className="w-gull h-4 bg-grey-light" />
          <Section>
            <div className="h-64">...내용</div>
          </Section>
        </>
      )}
    </div>
  );
};

const Section = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  return <div className={cn("px-2 py-4", className)}>{children}</div>;
};

const MarkerDetailBadge = ({ children }: React.PropsWithChildren) => {
  return (
    <Badge
      className="bg-white dark:bg-black border-primary font-bold flex items-center justify-center gap-2"
      variant="outline"
    >
      {children}
    </Badge>
  );
};

const StarIcon = () => {
  return (
    <svg
      enableBackground="new 0 0 64 64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={18}
      height={18}
    >
      <g id="quality">
        <path
          d="M45.4,22.3l5.3-13c0.1-0.3,0.1-0.7-0.1-1l-0.4-0.5h-0.5l-13.5,3.6L25.9,2.3L25.5,2h-0.4c-0.6,0-1.1,0.5-1.1,1l-0.8,14l-11.7,7.3c-0.4,0.2-0.5,0.6-0.5,1l0.1,0.7l13.4,5.4L31,51.2c0.1,0.5,0.6,0.8,1,0.8s0.9-0.3,1-0.7l6.3-17l12.5,1.5l0.1,0c0.4,0,0.8-0.2,0.9-0.6l0.3-0.6L45.4,22.3z"
          className="fill-[#FFD54F]"
        />
        <g>
          <polygon
            points="38,13 35.7,13.7 33,11.3 41.5,32.6 46,33.1"
            className="fill-[#FFECB3]"
          />
          <polygon
            points="28.3,7.1 25.9,5 25.2,18.2 24.3,18.7 34,43 38,32.1 38.3,32.2"
            className="fill-[#FFE082]"
          />
        </g>
        <path
          d="M32.2,49.7l-1.7-5.1l1.1-0.4l0.7,2l1.3-3.6l1.1,0.4L32.2,49.7z M35.4,40.9l-1.1-0.4l3.5-9.4l4.7,0.6l-0.1,1.1l-3.8-0.5L35.4,40.9z M49.7,32.8l-1.2-2l1-0.6l1.2,2L49.7,32.8z M26.2,31.4L25.7,30l-13-5.2l1.5-0.9l0.3,0.4l12.2,4.9l0.6,1.9L26.2,31.4z M16.8,23.6l-0.6-1l7.8-4.9l0.6,1L16.8,23.6z M45.7,18.7l-1.1-0.4l3.5-8.5l1.1,0.4L45.7,18.7z M35.9,13.6l-2.1-1.9l0.8-0.9l1.7,1.5l10.6-2.8l0.3,1.1L35.9,13.6z M26.8,5.6L26.1,5l-0.6,0l0.1-2l2,1.8L26.8,5.6z"
          className="fill-[#FFCA28]"
        />
        <g>
          <rect
            x="21"
            y="50"
            width="22"
            height="5"
            className="fill-[#FF7043]"
          />
          <rect
            x="17"
            y="53"
            width="30"
            height="8"
            className="fill-[#B71C1C]"
          />
          <rect
            x="16"
            y="60"
            width="32"
            height="2"
            className="fill-[#3E2723]"
          />
          <rect
            x="25"
            y="53"
            width="14"
            height="6"
            className="fill-[#FFB300]"
          />
          <rect
            x="26"
            y="54"
            width="12"
            height="4"
            className="fill-[#FBE9E7]"
          />
        </g>
        <g>
          <path
            d="M16.8,49l-4.2-5.7c-1-3.1-1-6.3,0-9.3c0.1-0.3,0.4-0.6,0.8-0.7c0.4-0.1,0.7,0.1,1,0.3C17.8,37.9,18.8,43.8,16.8,49z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M11.4,41.1c-0.4-0.9-0.7-1.6-0.9-2.3c1.7-5.2,0.6-10.9-2.9-15c-0.2-0.2-0.5-0.3-0.7-0.3c-0.5,0-0.8,0.3-1,0.7c-1.6,5.3-0.1,11.1,3.7,15.1l0,0c0.2,0.7,0.5,1.4,0.9,2.3L11.4,41.1z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M14.5,44c-0.8,0-1.5-0.9-1.5-2s0.7-2,1.5-2s1.5,0.9,1.5,2S15.3,44,14.5,44z"
            className="fill-[#FFB300]"
          />
          <path
            d="M7.8,39.4c-0.5,0-1.1-0.3-1.6-0.7c-0.4-0.4-0.6-0.8-0.7-1.2c-0.1-0.5,0-1,0.3-1.3c0.6-0.6,1.7-0.4,2.5,0.4c0.4,0.4,0.6,0.8,0.7,1.2c0.1,0.5,0,1-0.3,1.3C8.5,39.3,8.1,39.4,7.8,39.4z"
            className="fill-[#FFB300]"
          />
          <path
            d="M19,50.4c-0.7-0.5-1.5-1.1-2.3-1.9c-1.7-5.2-6-9.2-11.4-10.3c-0.4-0.1-0.8,0.1-1,0.4c-0.2,0.3-0.2,0.6-0.1,0.9c1.9,5.1,6.5,8.9,11.9,9.8c0.8,0.7,1.6,1.4,2.3,1.9L19,50.4z"
            className="fill-[#FFB300]"
          />
        </g>
        <g>
          <path
            d="M47.2,49l4.2-5.7c1-3.1,1-6.3,0-9.3c-0.1-0.3-0.4-0.6-0.8-0.7c-0.4-0.1-0.7,0.1-1,0.3C46.2,37.9,45.2,43.8,47.2,49z"
            className="fill-[#FFE082]"
          />
          <path
            d="M52.6,41.1c0.4-0.9,0.7-1.6,0.9-2.3c-1.7-5.2-0.6-10.9,2.9-15c0.2-0.2,0.5-0.3,0.7-0.3c0.5,0,0.8,0.3,1,0.7c1.6,5.3,0.1,11.1-3.7,15.1l0,0c-0.2,0.7-0.5,1.4-0.9,2.3L52.6,41.1z"
            className="fill-[#FFD54F]"
          />
          <path
            d="M48,42c0-1.1,0.7-2,1.5-2s1.5,0.9,1.5,2s-0.7,2-1.5,2S48,43.1,48,42z"
            className="fill-[#FFB300]"
          />
          <path
            d="M55.3,39c-0.3-0.3-0.4-0.8-0.3-1.3c0.1-0.4,0.3-0.9,0.7-1.2c0.8-0.8,1.9-0.9,2.5-0.4c0.3,0.3,0.4,0.8,0.3,1.3c-0.1,0.4-0.3,0.9-0.7,1.2c-0.5,0.5-1,0.7-1.6,0.7C55.9,39.4,55.5,39.3,55.3,39z"
            className="fill-[#FFB300]"
          />
          <path
            d="M45,50.4c0.7-0.5,1.5-1.1,2.3-1.9c1.7-5.2,6-9.2,11.4-10.3c0.4-0.1,0.8,0.1,1,0.4c0.2,0.3,0.2,0.6,0.1,0.9c-1.9,5.1-6.5,8.9-11.9,9.8c-0.8,0.7-1.6,1.4-2.3,1.9L45,50.4z"
            className="fill-[#FFCA28]"
          />
        </g>
      </g>
    </svg>
  );
};

const IconButton = ({
  icon,
  children,
}: React.PropsWithChildren<{ icon: React.ReactNode }>) => {
  return (
    <Button
      className="flex flex-col gap-1 grow text-sm"
      icon={icon}
      appearance="borderless"
      clickAction
    >
      {children}
    </Button>
  );
};

const Map = () => {
  const mapRef = useRef<KakaoMap>(null);

  useEffect(() => {
    if (mapRef.current) return;
    const mapContainer = document.getElementById("detail-map");
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.566535, 126.9779692),
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;
  }, []);

  return (
    <div
      id="detail-map"
      className={cn(" w-full h-full z-0")}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    />
  );
};

export default MarkerDetail;
