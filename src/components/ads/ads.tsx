"use client";

import cn from "@/utils/cn";
import { useEffect, useMemo, useRef } from "react";

type Ads = "square" | "horizon" | "feed";

const Ads = ({
  type = "square",
  className,
}: {
  type?: Ads;
  className?: React.ComponentProps<"ins">["className"];
}) => {
  const insRef = useRef<HTMLModElement | null>(null);
  const AdSlot = useMemo(() => {
    switch (type) {
      case "horizon":
        return "1184823224";
      case "square":
        return "2098557446";
      default:
        return "2098557446";
    }
  }, [type]);

  useEffect(() => {
    const pushAds = async () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        insRef.current?.setAttribute("data-ad-status", "unfilled");
      }
    };

    pushAds();
  }, []);

  // dark 5674732571 light 2864736407

  if (type === "feed") {
    return (
      <ins
        ref={insRef}
        className={cn("adsbygoogle w-full block h-28", className)}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-client="ca-pub-7114697513685043"
        data-ad-slot="2864736407"
      ></ins>
    );
  }

  return (
    <>
      <ins
        ref={insRef}
        className={cn("adsbygoogle w-full block", className)}
        data-ad-client="ca-pub-7114697513685043"
        data-ad-slot={AdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};

export default Ads;
