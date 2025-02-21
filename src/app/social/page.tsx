"use client";

import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { useHeaderStore } from "@/store/use-header-store";
import { useEffect } from "react";
import { useSessionStore } from "../../store/use-session-store";

const Page = () => {
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();
  const { setTitle } = useHeaderStore();

  useEffect(() => {
    setTitle("소셜");
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main>
      <Section>
        <p>소셜 페이지</p>
      </Section>
    </Main>
  );
};

export default Page;
