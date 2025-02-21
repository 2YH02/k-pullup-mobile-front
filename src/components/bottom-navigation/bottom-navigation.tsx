"use client";

import usePageTransition from "@/hooks/use-page-transition";
import { useHeaderStore } from "@/store/use-header-store";
import cn from "@/utils/cn";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BsBarChartLine,
  BsBuilding,
  BsChatDots,
  BsEmojiWink,
  BsPlus,
} from "react-icons/bs";
import { Button } from "../button/button";

const LINK_LIST = ["/", "/social", "/challenge", "/me"];

const BottomNavigation = () => {
  return (
    <div
      className={cn(
        "w-full h-16 border-t border-solid flex z-20 bg-white dark:bg-black dark:border-grey"
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
      <div className="flex items-center justify-center grow">
        <Button
          className="rounded-full p-2 bg-primary dark:bg-primary"
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
  const { setTitle } = useHeaderStore();

  const [loading, setLoading] = useState(false);

  const curIndex = useMemo(() => {
    return LINK_LIST.findIndex((link) => link === pathname);
  }, [pathname]);

  const onBack = () => {
    setLoading(true);
    slideRight().then(() => {
      router.push(url);
      setLoading(false);
    });
  };

  const onNext = () => {
    setLoading(true);
    slideLeft().then(() => {
      router.push(url);
      setLoading(false);
    });
  };

  const handleClick = () => {
    if (url !== "/") {
      setTitle(text);
    }
    const clickIndex = LINK_LIST.findIndex((link) => link === url);

    if (clickIndex === curIndex) return;

    if (curIndex > clickIndex) {
      onBack();
    } else {
      onNext();
    }
  };

  return (
    <Button
      disabled={loading}
      icon={icon}
      appearance="borderless"
      className={cn(
        "flex flex-col shrink-0 justify-between items-center text-xs grow bg-white dark:bg-black",
        pathname === url
          ? "text-primary-dark dark:text-primary-dark"
          : "text-[#aaa] dark:text-[#aaa]"
      )}
      onClick={handleClick}
      clickAction
    >
      {text}
    </Button>
  );
};

export default BottomNavigation;
