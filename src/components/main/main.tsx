import useScroll from "@/hooks/use-scroll";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

// TODO: overscroll-behavior: none; 확인하기 (class="overscroll-none")

const DRAG_THRESHOLD = 30;
const CLOSE_OPACITY_THRESHOLD = 0.4;
const MIN_OPACITY = 0.3;
const OPACITY_STEP = 0.005;
const RESET_OPACITY_DELAY = 250;
const OVERSCROLL_LIMIT = 100;

interface MainProps {
  isView?: boolean;
  close?: VoidFunction;
}

const Main = ({
  isView,
  close,
  children,
}: React.PropsWithChildren<MainProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTop, scrollTop } = useScroll(containerRef.current);

  const startY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const [translateY, setTranslateY] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    if (translateY > DRAG_THRESHOLD) {
      containerRef.current.style.overflow = "hidden";
    } else {
      containerRef.current.style.overflow = "auto";
      containerRef.current.style.overflowX = "hidden";
    }
  }, [translateY]);

  const handleDragStart = (clientY: number) => {
    if (!isTop) return;
    isDragging.current = true;
    startY.current = clientY;
  };

  const handleDragMove = (clientY: number) => {
    if (!isTop) return;
    if (startY.current) {
      const deltaY = clientY - startY.current;
      const newOpacity = Math.max(
        MIN_OPACITY,
        1 - Math.abs(deltaY) * OPACITY_STEP
      );
      if (deltaY - DRAG_THRESHOLD >= 0 && Math.abs(deltaY) > DRAG_THRESHOLD) {
        setTranslateY(Math.floor(deltaY - DRAG_THRESHOLD));
        setOpacity(newOpacity);
      }
    }
  };

  const handleDragEnd = () => {
    if (!isTop) return;
    if (startY.current) {
      if (opacity < CLOSE_OPACITY_THRESHOLD) {
        close?.();
        setOpacity(0);
        setTimeout(() => setOpacity(1), RESET_OPACITY_DELAY);
      } else {
        setOpacity(1);
      }
      setTranslateY(0);
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

  const computedTransform = isView
    ? isDragging.current
      ? `translateY(${translateY}px) translateX(-50%)`
      : `translateY(0) translateX(-50%)`
    : `translateY(100%) translateX(-50%)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed top-0 left-1/2 w-full h-full bg-white z-30 max-w-[480px] dark:bg-black overflow-auto overflow-x-hidden",
        isView ? "translate-y-0" : "translate-y-full",
        !isDragging.current ? "duration-200" : "duration-0",
        scrollTop < OVERSCROLL_LIMIT ? "overscroll-none" : ""
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
      {children}
    </div>
  );
};

export default Main;
