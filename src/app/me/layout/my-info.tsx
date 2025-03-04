"use client";

import ResetPasswordForm from "@/app/layout/reset-password-form";
import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import useInput from "@/hooks/use-input";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface MyInfoProps {
  os?: string;
  close?: VoidFunction;
}

const MyInfo = ({ os = "Windows", close }: MyInfoProps) => {
  const user = {
    username: "도토리",
    email: "yonghuni484@gmail.com",
    provider: "kakao",
    contributionLevel: "초보 운동자",
    userId: 50,
    contributionCount: 70,
  };

  const editNameValue = useInput(user.username);

  const [viewResetPasswordPage, setViewResetPasswordPage] = useState(false);
  const [viewEditNameInput, setViewEditNameInput] = useState(false);

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="내 정보 관리"
      slideType="horizontal"
    >
      {viewResetPasswordPage && (
        <ResetPasswordForm close={() => setViewResetPasswordPage(false)} />
      )}

      <Section className="pt-10">
        <div className="shadow-full rounded-md p-6 flex flex-col items-center justify-center dark:border dark:border-solid dark:border-grey-dark">
          {viewEditNameInput && (
            <div>
              <Input
                value={editNameValue.value}
                onChange={editNameValue.onChange}
                className="h-8"
              />
              <div className="flex justify-center items-center gap-2 mt-2">
                <Button
                  className="w-1/2 border-primary dark:bg-transparent dark:border-white dark:text-white"
                  appearance="outlined"
                  size="sm"
                  onClick={() => setViewEditNameInput(false)}
                  clickAction
                >
                  최소
                </Button>
                <Button
                  className="w-1/2 bg-primary"
                  size="sm"
                  onClick={() => setViewEditNameInput(false)}
                  clickAction
                >
                  확인
                </Button>
              </div>
            </div>
          )}

          {!viewEditNameInput && (
            <div className="flex items-center">
              <span className="shrink-0 text-lg font-bold truncate max-w-56">
                {user.username}
              </span>
              <div className="shrink-0">
                <Button
                  icon={<BsPencilSquare />}
                  className="dark:bg-transparent dark:text-white"
                  appearance="borderless"
                  onClick={() => setViewEditNameInput(true)}
                  clickAction
                />
              </div>
            </div>
          )}

          {!viewEditNameInput && <div className="text-sm">{user.email}</div>}
        </div>
      </Section>

      <Section title="개인 정보">
        <div className="shadow-full rounded-md p-6 dark:border dark:border-solid dark:border-grey-dark">
          <div className="flex items-center">
            <span className="w-1/4 shrink-0">이메일</span>
            <span className="grow truncate">{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/4 shrink-0">비밀번호</span>
            <span className="grow">**********</span>
            <div className="shrink-0">
              <Button
                icon={<BsPencilSquare />}
                className="dark:bg-transparent dark:text-white"
                appearance="borderless"
                onClick={() => setViewResetPasswordPage(true)}
                clickAction
              />
            </div>
          </div>
        </div>
      </Section>
    </SwipeClosePage>
  );
};

export default MyInfo;
