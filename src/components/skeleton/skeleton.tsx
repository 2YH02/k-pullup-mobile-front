import cn from "@/utils/cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-300 dark:bg-grey-dark", className)}
      {...props}
    />
  );
};

export default Skeleton;
