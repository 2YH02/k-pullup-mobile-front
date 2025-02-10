"use client";

import usePageTransition from "@/hooks/use-page-transition";
import { useEffect } from "react";
import { useSessionStore } from "../../store/use-session-store";

const Page = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <div>
      <h1>챌린지 페이지</h1>
    </div>
  );
};

export default Page;
