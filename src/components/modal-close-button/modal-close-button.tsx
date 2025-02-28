import React from "react";
import { BsX } from "react-icons/bs";
import { Button } from "../button/button";
import cn from "@/utils/cn";

const ModalCloseButton = ({
  os = "Windows",
  onClick,
}: {
  os?: string;
  onClick?: VoidFunction;
}) => {
  return (
    <Button
      icon={<BsX size={26} />}
      clickAction
      className={cn(
        `absolute right-4 rounded-full z-30 dark:bg-[rgba(255,255,255,0.7)] bg-[rgba(35,35,35,0.7)] 
          dark:text-black text-white p-1 mr-2`,
        os === "iOS" ? "top-14" : "top-4"
      )}
      onClick={onClick}
    />
  );
};

export default ModalCloseButton;
