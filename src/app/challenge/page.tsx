"use client";

import Main from "@/components/main/main";
import usePageTransition from "@/hooks/use-page-transition";
import { useHeaderStore } from "@/store/use-header-store";
import { useEffect } from "react";
import { useSessionStore } from "../../store/use-session-store";

const Page = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();
  const { setTitle } = useHeaderStore();

  useEffect(() => {
    setTitle("챌린지");
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main>
      <h1>챌린지 페이지</h1>
    </Main>
  );
};

export default Page;
