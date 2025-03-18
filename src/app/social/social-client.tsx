"use client";

import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";
import LocalChatList from "./layout/local-chat-list";
import { MomentList } from "./layout/moment-list";

const SocialClient = ({ os }: { os: string }) => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main os={os} headerTitle={["소셜"]}>
      <Section title="지역 채팅">
        <LocalChatList />
      </Section>
      <Section title="모먼트">
        <MomentList />
      </Section>
    </Main>
  );
};

export default SocialClient;
