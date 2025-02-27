import { createPortal } from "react-dom";
import { Button } from "../button/button";
import cn from "@/utils/cn";

const BottomFixedButton = ({
  children,
  className,
}: {
  children: string;
  className?: React.ComponentProps<"div">["className"];
}) => {
  return createPortal(
    <div
      className={cn(
        `fixed bottom-0 left-1/2 -translate-x-1/2 bg-white w-full max-w-[480px] px-4 p-3 z-40
       dark:bg-black dark:border-b dark:border-solid dark:border-grey-dark`,
        className
      )}
    >
      <Button className="bg-primary active:scale-95" fullWidth clickAction>
        {children}
      </Button>
    </div>,
    document.body
  );
};

export default BottomFixedButton;
