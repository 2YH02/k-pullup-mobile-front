"use client";

import usePageTransition from "@/hooks/use-page-transition";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";

const PullupPageClient = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return <div>PullupPageClient</div>;
};

export default PullupPageClient;
