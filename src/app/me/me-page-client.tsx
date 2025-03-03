"use client";

import { Button } from "@/components/button/button";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import usePageTransition from "@/hooks/use-page-transition";
import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useSessionStore } from "../../store/use-session-store";
import Signin from "../layout/signin";

const MePageClient = ({ os }: { os: string }) => {
  const user = null;

  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  const [viewSingin, setViewSignin] = useState(false);

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  return (
    <Main os={os} headerTitle={["오늘도 와주셔서", "감사해요!"]}>
      {viewSingin && <Signin os={os} close={() => setViewSignin(false)} />}
      {!user ? (
        <Section className="pb-0">
          <div className="active:bg-primary active:bg-opacity-20 rounded font-bold text-lg">
            <Button
              icon={<BsChevronRight />}
              onClick={() => setViewSignin(true)}
              className="flex-row-reverse justify-between active:scale-90 px-0 text-primary"
              appearance="borderless"
              clickAction
              fullWidth
            >
              로그인 및 회원가입하기
            </Button>
          </div>
        </Section>
      ) : (
        <Section className="pb-0">회원</Section>
      )}

      {/* 내 정보, 설정 */}
      <Section>
        <div className="relative shadow-full rounded p-1 flex">
          <button className="w-1/2 text-center active:bg-grey-light p-1 rounded">
            내 정보 관리
          </button>
          <div className="mx-3 w-[0.5px] bg-[#ddd]" />
          <button className="w-1/2 text-center active:bg-grey-light p-1 rounded">
            설정
          </button>
        </div>
      </Section>
    </Main>
  );
};

export default MePageClient;
