"use client";

import Main from "@/components/main/main";
import usePageTransition from "@/hooks/use-page-transition";
import { useHeaderStore } from "@/store/use-header-store";
import { useEffect } from "react";
import { useSessionStore } from "../../store/use-session-store";

const MePageClient = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();
  const { setTitle } = useHeaderStore();

  useEffect(() => {
    setTitle("내 정보");
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main>
      <h1>마이페이지</h1>
    </Main>
  );
};

export default MePageClient;
