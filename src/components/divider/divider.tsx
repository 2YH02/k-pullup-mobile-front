import cn from "@/utils/cn";
import React from "react";

const Divider = ({
  className,
}: {
  className?: React.ComponentProps<"div">["className"];
}) => {
  return (
    <div className={cn("w-full h-4 bg-grey-light dark:bg-[#111]", className)} />
  );
};

export default Divider;
