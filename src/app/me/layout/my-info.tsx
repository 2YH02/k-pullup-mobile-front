"use client";

import type { UserInfo } from "@/api/user";
import ResetPasswordForm from "@/app/layout/reset-password-form";
import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useUpdateUsername } from "@/hooks/api/user/use-update-username";
import useInput from "@/hooks/use-input";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface MyInfoProps {
  os?: string;
  close?: VoidFunction;
  user?: UserInfo | null;
}

const MyInfo = ({ os = "Windows", close, user }: MyInfoProps) => {
  if (!user) return null;

  const { mutateAsync: updateUsername, isPending } = useUpdateUsername();

  const editNameValue = useInput(user.username);

  const [viewResetPasswordPage, setViewResetPasswordPage] = useState(false);
  const [viewEditNameInput, setViewEditNameInput] = useState(false);
  const [usernameInputMessage, setUsernameInputMessage] = useState("");

  const handleUpdateUsername = async () => {
    if (
      editNameValue.value.length <= 0 &&
      user.username === editNameValue.value
    )
      return;
    try {
      await updateUsername(editNameValue.value);
      setViewEditNameInput(false);
    } catch {
      setUsernameInputMessage("잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="내 정보 관리"
      slideType="horizontal"
    >
      {viewResetPasswordPage && (
        <ResetPasswordForm
          os={os}
          close={() => setViewResetPasswordPage(false)}
        />
      )}

      <Section className="pt-10">
        <div className="shadow-full rounded-md p-6 flex flex-col items-center justify-center dark:border dark:border-solid dark:border-grey-dark">
          {viewEditNameInput && (
            <div>
              <Input
                value={editNameValue.value}
                onChange={(e) => {
                  editNameValue.onChange(e);
                  setUsernameInputMessage("");
                }}
                className="h-8"
                status={usernameInputMessage.length > 0 ? "error" : "default"}
                message={usernameInputMessage}
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
                  onClick={handleUpdateUsername}
                  disabled={isPending}
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
