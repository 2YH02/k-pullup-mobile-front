import useIsMounted from "@/hooks/use-is-mounted";
import { useFullPageModalStore } from "@/store/use-full-page-modal.store";
import cn from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BsArrowLeftShort } from "react-icons/bs";

interface FullPageModalProps {
  title?: string;
  id: string;
  className?: React.ComponentProps<"div">["className"];
  withDimmed?: boolean;
  os?: string;
  back?: boolean;
}

const FullPageModal = ({
  title,
  id,
  className,
  os = "Windows",
  back = false,
  children,
}: React.PropsWithChildren<FullPageModalProps>) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { isView, hide, id: modalId } = useFullPageModalStore();

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

  if (!isMounted || !isView || id !== modalId) return null;

  return createPortal(
    <div
      className={cn(
        "absolute bottom-0 left-0 w-full h-full bg-white dark:bg-black z-[60] duration-100 flex flex-col",
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
        <header
          className={cn(
            `p-3 sticky top-0 left-0 w-full bg-white z-10 shadow-sm flex items-center
            dark:bg-black dark:border-b dark:border-solid dark:border-grey-dark`,
            os === "iOS" ? "pt-12" : os === "Android" ? "pt-6" : ""
          )}
        >
          <button className="mr-4" onClick={back ? () => router.back() : hide}>
            <BsArrowLeftShort size={26} />
          </button>
          <span className="truncate grow">{title}</span>
        </header>
      )}

      <div className="grow overflow-auto p-4">{children}</div>
    </div>,
    document.body
  );
};

export default FullPageModal;
