import cn from "@/utils/cn";

const sizeVariant = {
  sm: "size-5",
  md: "size-7",
  lg: "size-10",
};

const Loading = ({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: React.ComponentProps<"svg">["className"];
}) => {
  const loadingSize = sizeVariant[size];
  return (
    <svg
      className={cn(`animate-spin text-primary ${loadingSize}`, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default Loading;
