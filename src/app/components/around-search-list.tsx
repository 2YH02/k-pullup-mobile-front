import { type Marker } from "@/api/marker";
import Carousel, {
  SlideContainer,
  SlideItem,
} from "@/components/carousel/carousel";
import Skeleton from "@/components/skeleton/skeleton";
import useIsDarkMode from "@/hooks/use-is-dark-mode";
import useMapControl from "@/hooks/use-map-control";
import { useMapStore } from "@/store/use-map-store";
import cn from "@/utils/cn";
import Image from "next/image";
import { useRef } from "react";

const AroundSearchList = ({
  data,
  isLoading,
  closeSlide,
  imageCache,
  openDetail,
}: {
  data: Marker[];
  isLoading: boolean;
  closeSlide: VoidFunction;
  imageCache: (img: string) => void;
  openDetail: (id: number) => void;
}) => {
  const { map, selectMarkers } = useMapStore();
  const { moveMap } = useMapControl(map, { enableDrag: false });

  const isDarkMode = useIsDarkMode();

  const isDragging = useRef(false);
  const startY = useRef<number | null>(null);

  const setDetailImage = async (img: string) => {
    imageCache(img);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startY.current) {
      const deltaX = e.clientY - startY.current;
      if (Math.abs(deltaX) > 5) {
        isDragging.current = true;
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startY.current !== null) {
      const diff = e.clientY - startY.current;
      const threshold = 30;
      if (diff > threshold) {
        closeSlide();
      }

      setTimeout(() => {
        isDragging.current = false;
      }, 0);

      startY.current = null;
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current) {
      const deltaX = e.touches[0].clientY - startY.current;
      if (Math.abs(deltaX) > 5) {
        isDragging.current = true;
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current !== null) {
      const diff = e.changedTouches[0].clientY - startY.current;
      const threshold = 45;
      if (diff > threshold) {
        closeSlide();
      }

      setTimeout(() => {
        isDragging.current = false;
      }, 0);

      startY.current = null;
    }
  };

  const afterSlide = (index: number) => {
    const selectedMarker = {
      lat: data[index].latitude,
      lng: data[index].longitude,
      id: data[index].markerId,
    };

    selectMarkers([selectedMarker]);
    moveMap({ lat: data[index].latitude, lng: data[index].longitude });
  };

  if (isLoading) {
    return (
      <div className="flex gap-[5%] h-48 p-2 ml-2">
        <Skeleton className="w-[82%] h-full shrink-0 rounded-lg" />
        <Skeleton className="w-[82%] h-full shrink-0 rounded-lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="h-48 p-2"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-col justify-center w-full h-full rounded-lg bg-white shadow-md dark:bg-black p-4">
          <div className="relative mx-auto w-52 h-[180px]">
            <Image
              src={isDarkMode ? "/main-c-dark.png" : "/main-c.png"}
              fill
              alt="not found"
              draggable={false}
            />
          </div>
          <div className="text-center font-bold">
            현재 주변에 운동 기구가 없어요...
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <div
        className="h-48 p-2"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="w-[90%] mx-auto h-full rounded-lg bg-white shadow-full dark:bg-black overflow-hidden"
          onClick={async (e) => {
            if (isDragging.current) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }

            await setDetailImage(data[0].thumbnail);
            openDetail(data[0].markerId);
          }}
        >
          <div className="relative w-full h-24">
            <Image
              src={data[0].thumbnail || "/metaimg.webp"}
              fill
              alt={data[0].description}
              className="object-cover"
              draggable={false}
            />
          </div>
          <div className="p-2">
            <div className={cn("font-bold", data[0].description && "truncate")}>
              {data[0].address}
            </div>
            <div className="text-xs text-grey-dark">{data[0].description}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      className="h-48 p-2"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      afterSlide={afterSlide}
    >
      <SlideContainer>
        {data.map((value) => {
          return (
            <SlideItem
              key={value.markerId}
              className={cn(
                "p-0 overflow-hidden border-none bg-white dark:bg-black",
                ""
              )}
              onClick={async (e) => {
                if (isDragging.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }

                await setDetailImage(value.thumbnail);
                openDetail(value.markerId);
              }}
            >
              <div className="relative w-full h-24">
                <Image
                  src={value.thumbnail || "/metaimg.webp"}
                  fill
                  alt={value.description}
                  className="object-cover"
                  draggable={false}
                />
              </div>
              <div className="p-2">
                <div
                  className={cn("font-bold", value.description && "truncate")}
                >
                  {value.address}
                </div>
                <div className="text-xs text-grey-dark">
                  {value.description}
                </div>
              </div>
            </SlideItem>
          );
        })}
      </SlideContainer>
    </Carousel>
  );
};

export default AroundSearchList;
