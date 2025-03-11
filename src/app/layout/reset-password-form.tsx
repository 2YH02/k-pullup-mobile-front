"use client";

import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useSendPasswordResetEmail } from "@/hooks/api/auth/use-send-password-reset-email";
import { useEffect, useState } from "react";

const ResetPasswordForm = ({
  close,
  os = "Windows",
}: {
  close: VoidFunction;
  os?: string;
}) => {
  const { mutate, isPending, isError } = useSendPasswordResetEmail();
  const [emailValue, setEmailValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isError) {
      setMessage("입력한 이메일을 다시 한번 확인해주세요.");
    }
  }, [isError]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    setEmailValue(e.target.value);
  };

  return (
    <SwipeClosePage
      os={os}
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
            status={message.length > 0 ? "error" : "default"}
            onChange={handleEmailChange}
            message={message}
          />
        </div>

        <Button
          className="bg-primary mt-5 disabled:bg-grey"
          onClick={() => {
            mutate(emailValue);
          }}
          disabled={isPending}
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
