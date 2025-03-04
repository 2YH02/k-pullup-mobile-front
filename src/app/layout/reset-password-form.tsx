"use client";

import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useState } from "react";

const ResetPasswordForm = ({ close }: { close: VoidFunction }) => {
  const [emailValue, setEmailValue] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  return (
    <SwipeClosePage
      close={close}
      slideType="horizontal"
      headerTitle="비밀번호 초기화"
    >
      <Section>
        <div className="text-sm text-center font-bold my-4 text-yellow">
          이메일로 비밀번호 초기화 링크를 발송해드립니다.
        </div>
        <div className="h-20">
          <Input
            label="이메일"
            type="email"
            value={emailValue}
            onChange={handleEmailChange}
          />
        </div>

        <Button
          className="bg-primary mt-5 disabled:bg-grey"
          clickAction
          fullWidth
        >
          확인
        </Button>
      </Section>
    </SwipeClosePage>
  );
};

export default ResetPasswordForm;
