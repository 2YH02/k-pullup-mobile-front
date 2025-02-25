"use client";

import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";

const SocialClient = ({ os }: { os: string }) => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main os={os} headerTitle={["소셜", "페이지임"]}>
      <Section>
        <p>소셜 페이지</p>
      </Section>
    </Main>
  );
};

export default SocialClient;
