import cn from "@/utils/cn";
import { createPortal } from "react-dom";
import { Button } from "../button/button";

const BottomFixedButton = ({
  children,
  os = "Windows",
  onClick,
  className,
}: {
  children: string;
  os?: string;
  onClick?: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}) => {
  return createPortal(
    <div
      className={cn(
        `fixed bottom-0 left-1/2 -translate-x-1/2 bg-white w-full max-w-[480px] px-4 p-3 z-40
       dark:bg-black dark:border-b dark:border-solid dark:border-grey-dark`,
        os === "iOS" ? "pb-6" : "pb-3",
        className
      )}
    >
      <Button
        className="bg-primary active:scale-95"
        onClick={onClick}
        fullWidth
        clickAction
      >
        {children}
      </Button>
    </div>,
    document.body
  );
};

export default BottomFixedButton;
