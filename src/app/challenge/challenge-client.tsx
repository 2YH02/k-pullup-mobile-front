"use client";

import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { usePageLoadedStore } from "@/store/use-page-loaded-store";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";

const ChallengeClient = ({ os = "Windows" }: { os?: string }) => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();
  const { setPageLoaded } = usePageLoadedStore();

  useEffect(() => {
    setPageLoaded(true);
    if (isFirstVisit) return;
    slideIn("/challenge");
  }, []);

  return (
    <Main os={os} headerTitle={["챌린지"]}>
      <Section className="text-center py-10">
        <h1 className="text-lg font-bold">현재 서비스 준비중입니다.</h1>
        <p className="text-sm">빠른 시일 내에 더욱 향상된 서비스를 제공할 예정입니다.</p>
      </Section>
    </Main>
  );
};

export default ChallengeClient;
