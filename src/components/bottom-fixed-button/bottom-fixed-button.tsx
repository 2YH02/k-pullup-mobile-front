import cn from "@/utils/cn";
import { createPortal } from "react-dom";
import { Button } from "../button/button";

const BottomFixedButton = ({
  children,
  os = "Windows",
  onClick,
  disabled,
  secondButtonTitle,
  secondButtonClick,
  withSecondButton = false,
  className,
}: {
  children: string;
  os?: string;
  onClick?: VoidFunction;
  disabled?: boolean;
  withSecondButton?: boolean;
  secondButtonTitle?: string;
  secondButtonClick?: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}) => {
  return createPortal(
    <div
      className={cn(
        `fixed bottom-0 left-1/2 -translate-x-1/2 bg-white w-full max-w-[480px] px-4 p-3 z-40 flex gap-3
       dark:bg-black dark:border-b dark:border-solid dark:border-grey-dark`,
        os === "iOS" ? "pb-6" : "pb-3",
        className
      )}
    >
      {withSecondButton && (
        <Button
          className="border-primary active:scale-95 disabled:bg-grey dark:disabled:bg-grey-dark"
          onClick={secondButtonClick}
          appearance="outlined"
          disabled={disabled}
          fullWidth
          clickAction
        >
          {secondButtonTitle}
        </Button>
      )}

      <Button
        className="bg-primary active:scale-95 disabled:bg-grey dark:disabled:bg-grey-dark"
        onClick={onClick}
        disabled={disabled}
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
