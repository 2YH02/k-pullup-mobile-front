"use client";

import ResetPasswordForm from "@/app/layout/reset-password-form";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Switch from "@/components/switch/switch";
import useDarkMode from "@/hooks/use-dark-mode";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

interface MyInfoProps {
  os?: string;
  close?: VoidFunction;
}

const Config = ({ os = "Windows", close }: MyInfoProps) => {
  const { isDark, toggleTheme } = useDarkMode();

  const [viewResetPasswordPage, setViewResetPasswordPage] = useState(false);

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="설정"
      slideType="horizontal"
      className="bg-grey-light"
    >
      {viewResetPasswordPage && (
        <ResetPasswordForm close={() => setViewResetPasswordPage(false)} />
      )}

      <ConfigList title="앱 설정">
        <ConfigListItem
          title="다크모드"
          type="toggle"
          onToggleChange={toggleTheme}
          initToggleValue={isDark}
        />
      </ConfigList>

      <ConfigList title="사용자 설정">
        <ConfigListItem title="로그아웃" />
        <ConfigListItem
          title="비밀번호 초기화"
          onClick={() => setViewResetPasswordPage(true)}
        />
        <ConfigListItem title="회원 탈퇴" />
      </ConfigList>

      <ConfigList title="기타">
        <ConfigListItem title="문의" />
      </ConfigList>
    </SwipeClosePage>
  );
};

const ConfigList = ({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="mb-3">
      <div className="p-2">{title}</div>
      <ul className="bg-white dark:bg-black-light">{children}</ul>
    </div>
  );
};

interface ListItemProps {
  title: string;
  description?: string;
  type?: "toggle" | "link";
  initToggleValue?: boolean;
  onClick?: VoidFunction;
  onToggleChange?: VoidFunction;
}

const ConfigListItem = ({
  title,
  description,
  type = "link",
  initToggleValue,
  onClick,
  onToggleChange,
}: ListItemProps) => {
  return (
    <li
      className={`flex justify-between items-center ${
        type === "link" || onClick ? "cursor-pointer" : "cursor-default"
      } p-2 border-b border-solid border-grey-light dark:border-grey-dark`}
      onClick={onClick}
    >
      <div>
        <div>{title}</div>
        <div className="text-grey-dark text-xs">{description}</div>
      </div>

      {type === "link" && (
        <div>
          <BsChevronRight />
        </div>
      )}
      {type === "toggle" && (
        <Switch onChange={onToggleChange} checked={initToggleValue} />
      )}
    </li>
  );
};

export default Config;
