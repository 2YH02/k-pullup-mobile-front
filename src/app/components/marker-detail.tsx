"use client";

import { Button } from "@/components/button/button";
import cn from "@/utils/cn";
import Image from "next/image";
import { useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

interface MarkerDetailProps {
  imageUrl: string | null;
  viewMarkerDetail: boolean;
  closeDetail: VoidFunction;
  imageCache: (img: string | null) => void;
}

const MarkerDetail = ({
  imageUrl,
  viewMarkerDetail,
  closeDetail,
  imageCache,
}: MarkerDetailProps) => {
  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startY.current) {
      const deltaY = e.clientY - startY.current;
      const opacity = Math.max(0.3, 1 - Math.abs(deltaY) * 0.005);
      if (Math.abs(deltaY) > 10) {
        setTranslateY(deltaY);
        setOpacity(opacity);
      }
    }
  };

  const onMouseUp = () => {
    if (startY.current !== null) {
      if (opacity < 0.4) {
        closeDetail();
        setOpacity(0);

        setTimeout(() => {
          setOpacity(1);
        }, 250);
      } else {
        setTranslateY(0);
        setOpacity(1);
      }

      isDragging.current = false;
      startY.current = null;
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current) {
      const deltaY = e.touches[0].clientY - startY.current;
      const opacity = Math.max(0.3, 1 - Math.abs(deltaY) * 0.005);
      if (Math.abs(deltaY) > 10) {
        setTranslateY(deltaY);
        setOpacity(opacity);
      }
    }
  };

  const onTouchEnd = () => {
    if (startY.current !== null) {
      if (opacity < 0.4) {
        closeDetail();
        setOpacity(0);

        setTimeout(() => {
          setOpacity(1);
        }, 250);
      } else {
        setTranslateY(0);
        setOpacity(1);
      }

      isDragging.current = false;
      startY.current = null;
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 w-full h-full bg-white z-30 max-w-[480px]",
        viewMarkerDetail ? "translate-y-0" : "translate-y-full",
        !isDragging.current ? "duration-200" : "duration-0 scale-50"
      )}
      style={{
        transform: viewMarkerDetail
          ? isDragging.current
            ? `translateY(${translateY}px) translateX(-50%)`
            : `translateY(0) translateX(-50%)`
          : `translateY(100%) translateX(-50%)`,
        opacity: opacity,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Button
        icon={<BsArrowLeftShort size={26} />}
        clickAction
        className="absolute top-2 left-2 z-40 rounded-full bg-[rgba(255,255,255,0.7)] text-black p-1"
        onClick={() => {
          closeDetail();
          imageCache(null);
        }}
      />
      {imageUrl && (
        <div className={cn("relative w-full h-52")}>
          <Image
            src={imageUrl}
            fill
            alt="thumbnail"
            className="object-cover"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
};

export default MarkerDetail;
