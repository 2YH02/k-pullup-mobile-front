import useIsMounted from "@/hooks/use-is-mounted";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import cn from "@/utils/cn";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BsX } from "react-icons/bs";
import { Button } from "../button/button";
import Dimmed from "../dimmed/dimmed";

interface BottomSheetProps {
  title?: string;
  id: string;
  className?: React.ComponentProps<"div">["className"];
  withDimmed?: boolean;
}

const BottomSheet = ({
  title,
  id,
  withDimmed = true,
  className,
  children,
}: React.PropsWithChildren<BottomSheetProps>) => {
  const isMounted = useIsMounted();
  const { isView, hide, id: modalId } = useBottomSheetStore();

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isView) {
      setActive(false);
      return;
    }

    const timeout = setTimeout(() => {
      setActive(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, [isView]);

  const Container = withDimmed ? Dimmed : "div";

  if (!isMounted || !isView || id !== modalId) return null;

  return createPortal(
    <Container onClick={hide}>
      <div
        className={cn(
          "absolute bottom-0 left-0 w-full bg-white dark:bg-black z-50 p-4 rounded-t-3xl duration-100",
          active ? "translate-y-0" : "translate-y-full",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold">{title}</div>
            <Button
              icon={<BsX size={26} />}
              className="p-1 rounded-full bg-[rgba(0,0,0,0.4)]"
              onClick={hide}
              clickAction
            />
          </div>
        )}

        {children}
      </div>
    </Container>,
    document.body
  );
};

export default BottomSheet;
