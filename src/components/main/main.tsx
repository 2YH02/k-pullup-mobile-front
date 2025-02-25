import useIsMounted from "@/hooks/use-is-mounted";
import cn from "@/utils/cn";

interface MainProps {
  os?: string;
  headerTitle?: string | string[];
}

const Main = ({
  os = "Windows",
  headerTitle,
  children,
}: React.PropsWithChildren<MainProps>) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  // 80 = nav height
  const iOSBodyHeight = "h-[calc(100dvh-80px)] pt-12";

  // 64 = nav height
  const bodyHeight = "h-[calc(100dvh-64px)]";

  return (
    <div
      className={cn("overflow-auto", os === "iOS" ? iOSBodyHeight : bodyHeight)}
    >
      {headerTitle ? (
        typeof headerTitle === "string" ? (
          <div className="text-xl px-4 pt-4">{headerTitle}</div>
        ) : (
          <div className="text-xl px-4 pt-4">
            {headerTitle.map((v) => {
              return <div key={v}>{v}</div>;
            })}
          </div>
        )
      ) : null}
      {children}
    </div>
  );
};

export default Main;
