import useIsMounted from "@/hooks/use-is-mounted";
import { useHeaderStore } from "@/store/use-header-store";
import cn from "@/utils/cn";

const Main = ({ children }: React.PropsWithChildren) => {
  const { title } = useHeaderStore();
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  const headerHeight = title
    ? "h-[calc(100dvh-48px-64px)]"
    : "h-[calc(100dvh-64px)]";

  return <div className={cn("overflow-auto", headerHeight)}>{children}</div>;
};

export default Main;
