"use client";

import usePageTransition from "@/hooks/use-page-transition";
import { useEffect } from "react";
import { useSessionStore } from "../../store/use-session-store";

const MePageClient = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <div>
      <h1>마이페이지</h1>
    </div>
  );
};

export default MePageClient;
