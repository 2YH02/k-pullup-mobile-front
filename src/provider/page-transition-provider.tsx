"use client";

import BottomNavigation from "@/components/bottom-navigation/bottom-navigation";
import Map from "@/components/map/map";
import {
  PageAnimation,
  PageTransitionContext,
} from "@/context/page-transition-context";
import cn from "@/utils/cn";
import { useRef, useState } from "react";

const PageTransitionProvider = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  const [animationClass, setAnimationClass] = useState("");

  const animation = useRef<PageAnimation>("left");

  return (
    <PageTransitionContext.Provider
      value={{
        animation,
        className: animationClass,
        setClassName: setAnimationClass,
      }}
    >
      <div className="flex flex-col h-full">
        <div className={cn("relative grow", className, animationClass)}>
          {children}
          <Map />
        </div>
        <BottomNavigation />
      </div>
    </PageTransitionContext.Provider>
  );
};

export default PageTransitionProvider;
