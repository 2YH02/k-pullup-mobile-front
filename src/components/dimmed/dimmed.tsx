import cn from "@/utils/cn";

const Dimmed = ({
  onClick,
  className,
  children,
}: React.PropsWithChildren<{
  onClick?: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}>) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] w-full h-dvh z-[300]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Dimmed;
