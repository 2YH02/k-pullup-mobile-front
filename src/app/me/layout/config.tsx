"use client";

import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Switch from "@/components/switch/switch";
import React from "react";
import { BsChevronRight } from "react-icons/bs";

interface MyInfoProps {
  os?: string;
  close?: VoidFunction;
}

const Config = ({ os = "Windows", close }: MyInfoProps) => {
  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="설정"
      slideType="horizontal"
      className="bg-grey-light"
    >
      <ConfigList title="앱 설정">
        <ConfigListItem title="다크모드" type="toggle" />
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

export const ConfigListItem = ({
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
