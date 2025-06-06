"use client";

import usePageTransition from "@/hooks/use-page-transition";
import { usePostMessage } from "@/provider/use-post-message";
import useAlertStore from "@/store/use-alert-store";
import { usePageLoadedStore } from "@/store/use-page-loaded-store";
import { useUserStore } from "@/store/use-user-store";
import useViewRegisterStore from "@/store/use-view-register-store";
import useViewSigninStore from "@/store/use-view-signin-store";
import cn from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  BsBarChartLine,
  BsBuilding,
  BsChatDots,
  BsEmojiWink,
  BsPlus,
} from "react-icons/bs";
import { Button } from "../button/button";

const LINK_LIST = ["/", "/social", "/challenge", "/me"];

const BottomNavigation = ({ os }: { os: string }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const { openAlert } = useAlertStore();
  const { openRegister } = useViewRegisterStore();
  const { openSignin } = useViewSigninStore();

  const { postMessage } = usePostMessage();

  useEffect(() => {
    LINK_LIST.map((link) => {
      router.prefetch(link);
    });
  }, []);

  const handleClickRegister = () => {
    router.push("/");
    postMessage({ type: "NAVIGATION_TAB" });
    if (!user) {
      openAlert({
        title: "로그인이 필요합니다.",
        description: "로그인 페이지로 이동하시겠습니까?",
        cancel: true,
        onClick: () => {
          openSignin();
        },
      });
    } else {
      openRegister();
    }
  };

  return (
    <div
      className={cn(
        "w-full border-t border-solid flex z-20 bg-white dark:bg-black dark:border-grey box-border",
        os === "iOS" ? "h-20 pb-4" : " h-16"
      )}
    >
      <NavigationButton
        icon={<BsBuilding size={22} />}
        text="홈/주변"
        url="/"
      />
      <NavigationButton
        icon={<BsChatDots size={22} />}
        text="소셜"
        url="/social"
      />
      <div className="flex items-center justify-center">
        <Button
          className="rounded-full p-2 bg-primary dark:bg-primary"
          onClick={handleClickRegister}
          clickAction
        >
          <BsPlus size={30} />
        </Button>
      </div>
      <NavigationButton
        icon={<BsBarChartLine size={22} />}
        text="챌린지"
        url="/challenge"
      />
      <NavigationButton
        icon={<BsEmojiWink size={22} />}
        text="내 정보"
        url="/me"
      />
    </div>
  );
};

const NavigationButton = ({
  icon,
  text,
  url,
}: {
  icon: React.ReactNode;
  text: string;
  url: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { slideLeft, slideRight } = usePageTransition();
  const { postMessage } = usePostMessage();
  const { isPageLoaded, setPageLoaded } = usePageLoadedStore();

  const curIndex = useMemo(() => {
    return LINK_LIST.findIndex((link) => link === pathname);
  }, [pathname]);

  const onBack = () => {
    setPageLoaded(false);
    slideRight().then(() => {
      router.push(url);
    });
  };

  const onNext = () => {
    setPageLoaded(false);
    slideLeft().then(() => {
      router.push(url);
    });
  };

  const handleClick = () => {
    if (!isPageLoaded) return;
    const clickIndex = LINK_LIST.findIndex((link) => link === url);

    if (clickIndex === curIndex) return;

    postMessage({ type: "NAVIGATION_TAB" });

    if (curIndex > clickIndex) {
      onBack();
    } else {
      onNext();
    }
  };

  return (
    <button
      className={cn(
        "flex flex-col shrink-0 justify-center items-center gap-2 text-xs grow bg-white dark:bg-black active:scale-90",
        pathname === url
          ? "text-primary-dark dark:text-primary-dark"
          : "text-[#aaa] dark:text-[#aaa]"
      )}
      onClick={() => {
        handleClick();
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
};

export default BottomNavigation;
