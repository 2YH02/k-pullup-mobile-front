import parseMatrixTransform, {
  TransformMatrix,
} from "@/utils/parse-matrix-transform";
import React, {
  ButtonHTMLAttributes,
  createContext,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import cn from "../../utils/cn";

interface CarouselContextProps {
  currentIndex: number;
  slideRef: React.RefObject<HTMLDivElement | null>;
  itemsCount: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  handlePrev: VoidFunction;
  handleNext: VoidFunction;
  isDragging: React.RefObject<boolean>;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error(
      "Carousel compound components should be used with Carousel"
    );
  }
  return context;
};

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  onChange?: (value?: any) => void;
  onMount?: (value?: any) => void;
  className?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({
  onChange,
  onMount,
  className,
  children,
  ...props
}) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const translateValue = useRef(74);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (onMount) onMount();
  }, []);

  const childrenArray = React.Children.toArray(children);
  const slideChild = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === SlideContainer
  ) as React.ReactElement<any> | undefined;

  const itemsCount = slideChild
    ? React.Children.count(slideChild.props.children)
    : 0;

  const handlePrev = () => {
    if (onChange) onChange();

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      if (slideRef.current) {
        if (currentIndex === 1) {
          slideRef.current.style.transform = `translateX(8px)`;
        } else {
          translateValue.current -= 85;
          slideRef.current.style.transform = `translateX(-${translateValue.current}%)`;
        }
      }
    } else {
      if (slideRef.current) {
        slideRef.current.style.transform = `translateX(8px)`;
      }
    }
  };

  const handleNext = () => {
    if (onChange) onChange();

    if (currentIndex < itemsCount - 1) {
      setCurrentIndex((prev) => prev + 1);
      if (slideRef.current) {
        if (currentIndex === 0) {
          slideRef.current.style.transform = `translateX(-74%)`;
        } else {
          translateValue.current += 85;
          slideRef.current.style.transform = `translateX(-${translateValue.current}%)`;
        }
      }
    } else {
      if (slideRef.current) {
        slideRef.current.style.transform = `translateX(-${translateValue.current}%)`;
      }
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        handlePrev,
        handleNext,
        slideRef,
        itemsCount,
        isDragging,
      }}
    >
      <div
        className={cn("relative h-fll w-full overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

interface SlideContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
}

export const SlideContainer: React.FC<SlideContainerProps> = ({
  className,
  children,
  ...props
}) => {
  const { slideRef, isDragging, handlePrev, handleNext } = useCarousel();

  const startX = useRef<number | null>(null);
  const currentTranslateX = useRef(0);
  const prevTranslateX = useRef(0);

  const [isClick, setIsClick] = useState(false);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(true);
    if (slideRef.current) {
      const computedStyle = window.getComputedStyle(slideRef.current);
      const { tx } = parseMatrixTransform(
        computedStyle.transform
      ) as TransformMatrix;
      currentTranslateX.current = tx;
      prevTranslateX.current = tx;
    }
    startX.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startX.current) {
      const deltaX = e.clientX - startX.current;
      if (Math.abs(deltaX) > 5) {
        isDragging.current = true;
      }
      if (slideRef.current) {
        slideRef.current.style.transform = `translateX(${
          currentTranslateX.current + deltaX
        }px)`;
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);
    if (startX.current) {
      const diff = e.clientX - startX.current;
      const threshold = 50;
      if (diff > threshold) {
        handlePrev();
      } else if (diff < -threshold) {
        handleNext();
      } else {
        if (slideRef.current) {
          slideRef.current.style.transform = `translateX(${prevTranslateX.current}px)`;
        }
      }

      setTimeout(() => {
        isDragging.current = false;
      }, 0);

      startX.current = null;
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsClick(true);

    if (slideRef.current) {
      const computedStyle = window.getComputedStyle(slideRef.current);
      const { tx } = parseMatrixTransform(
        computedStyle.transform
      ) as TransformMatrix;
      currentTranslateX.current = tx;
      prevTranslateX.current = tx;
    }

    isDragging.current = false;
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX.current) {
      const deltaX = e.touches[0].clientX - startX.current;
      if (Math.abs(deltaX) > 5) {
        isDragging.current = true;
      }

      if (slideRef.current) {
        slideRef.current.style.transform = `translateX(${
          currentTranslateX.current + deltaX
        }px)`;
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsClick(false);
    if (startX.current) {
      const diff = e.changedTouches[0].clientX - startX.current;
      const threshold = 50;
      if (diff > threshold) {
        handlePrev();
      } else if (diff < -threshold) {
        handleNext();
      } else {
        if (slideRef.current) {
          slideRef.current.style.transform = `translateX(${prevTranslateX.current}px)`;
        }
      }

      setTimeout(() => {
        isDragging.current = false;
      }, 0);

      startX.current = null;
    }
  };

  return (
    <div
      ref={slideRef}
      className={cn(
        "flex gap-[5%] h-full",
        !isClick && "transition-transform duration-500 ease-in-out",
        className
      )}
      style={{ transform: `translateX(8px)` }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {children}
    </div>
  );
};

interface SlideItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
}

export const SlideItem: React.FC<SlideItemProps> = ({
  className,
  children,
  onClick,
  ...props
}) => {
  const { isDragging } = useCarousel();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <div
      className={cn(
        "shrink-0 w-[80%] h-full bg-white border border-solid border-[#eee] shadow-md rounded-lg p-2",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const PrevButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  const { handlePrev, currentIndex } = useCarousel();

  return (
    <button
      onClick={handlePrev}
      className={cn(
        "absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow",
        className
      )}
      disabled={currentIndex === 0}
      {...props}
    >
      {children || "Prev"}
    </button>
  );
};

export const NextButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  const { handleNext, currentIndex, itemsCount } = useCarousel();

  return (
    <button
      onClick={handleNext}
      className={cn(
        "absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow",
        className
      )}
      disabled={currentIndex === itemsCount - 1}
      {...props}
    >
      {children || "Next"}
    </button>
  );
};

export default Carousel;
