"use client";

import MarkerDetail from "@/app/layout/marker-detail";
import Signin from "@/app/layout/signin";
import Chatting from "@/app/social/layout/chatting";
import MomentDetail from "@/app/social/layout/moment-detail";
import BottomNavigation from "@/components/bottom-navigation/bottom-navigation";
import Map from "@/components/map/map";
import {
  PageAnimation,
  PageTransitionContext,
} from "@/context/page-transition-context";
import { useChatStore } from "@/store/use-chat-store";
import { useMomentStore } from "@/store/use-moment-store";
import { useViewDetailStore } from "@/store/use-view-detail-store";
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
  const { isView: isViewMoment, hide: closeMoment } = useMomentStore();
  const {
    isView: isViewDetail,
    id: curMarkerId,
    hide: hideDetail,
    imageCache,
    imageUrl,
  } = useViewDetailStore();

  const { isView: isViewChat, hide: closeChat } = useChatStore();

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
          {/* 위치 상세 모달 */}
          {isViewDetail && curMarkerId && (
            <MarkerDetail
              os={os}
              markerId={curMarkerId}
              imageUrl={imageUrl}
              imageCache={imageCache}
              closeDetail={() => {
                hideDetail();
                imageCache(null);
              }}
              className="z-40"
            />
          )}
          {isViewMoment && <MomentDetail os={os} close={closeMoment} />}
          {isViewChat && <Chatting os={os} close={closeChat} />}
        </div>
        <BottomNavigation os={os} />
      </div>
    </PageTransitionContext.Provider>
  );
};

export default PageTransitionProvider;
