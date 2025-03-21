"use client";

import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { usePageLoadedStore } from "@/store/use-page-loaded-store";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";
import LocalChatList from "./layout/local-chat-list";
import MarkerRankingList from "./layout/marker-ranking-list";
import { MomentList } from "./layout/moment-list";

const SocialClient = ({ os = "Windows" }: { os?: string }) => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();
  const { setPageLoaded } = usePageLoadedStore();

  useEffect(() => {
    setPageLoaded(true);
    if (isFirstVisit) return;
    slideIn("/social");
  }, []);

  return (
    <Main os={os} headerTitle={["소셜"]}>
      <Section title="지역 채팅">
        <LocalChatList />
      </Section>
      <Section title="인기 많은 철봉">
        <MarkerRankingList />
      </Section>
      <Section>
        <MomentList withTitle />
      </Section>
      <div className="p-4" />
    </Main>
  );
};

export default SocialClient;
