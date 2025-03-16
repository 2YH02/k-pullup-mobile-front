"use client";

import Signin from "@/app/layout/signin";
import BottomNavigation from "@/components/bottom-navigation/bottom-navigation";
import Map from "@/components/map/map";
import {
  PageAnimation,
  PageTransitionContext,
} from "@/context/page-transition-context";
import useViewSigninStore from "@/store/use-view-signin-store";
import cn from "@/utils/cn";
import { useRef, useState } from "react";

const PageTransitionProvider = ({
  os,
  className,
  children,
}: React.PropsWithChildren<{
  os: string;
  className?: React.ComponentProps<"div">["className"];
}>) => {
  const { isView, closeSignin } = useViewSigninStore();

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
      <div className="flex flex-col h-full dark:bg-black">
        <div className={cn("relative grow", className, animationClass)}>
          {children}
          <Map />
          {isView && <Signin os={os} close={closeSignin} />}
        </div>
        <BottomNavigation os={os} />
      </div>
    </PageTransitionContext.Provider>
  );
};

export default PageTransitionProvider;
