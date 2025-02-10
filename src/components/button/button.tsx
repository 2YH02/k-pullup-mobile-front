import cn from "../../utils/cn";

const baseStyles = "duration-200 rounded outline-none appearance-none";

const colorVariants = {
  black: "bg-gray-950 text-white  dark:bg-white dark:text-black",
  white: "bg-white text-black",
  blue: "bg-blue-500 text-white",
  red: "bg-red-500 text-white",
  purple: "bg-purple-500 text-white",
  gray: "bg-gray-500 text-white",
  rose: "bg-rose-500 text-white",
};

const borderVariants = {
  black: "bg-transparent border border-solid border-gray-950 text-gray-950",
  white: "bg-transparent border border-solid border-white text-white",
  blue: "bg-transparent border border-solid border-blue-500 text-blue-500",
  red: "bg-transparent border border-solid border-red-500 text-red-500",
  purple:
    "bg-transparent border border-solid border-purple-500 text-purple-500",
  gray: "bg-transparent border border-solid border-gray-500 text-gray-500",
  rose: "bg-transparent border border-solid border-rose-500 text-rose-500",
};

const sizeVariants = {
  sm: "px-3 py-2",
  md: "px-6 py-2",
  lg: "px-10 py-4",
};

export type ButtonColor = keyof typeof colorVariants;
export type Appearance = "filled" | "outlined" | "borderless";
export type ButtonSize = keyof typeof sizeVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  appearance?: Appearance;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  clickAction?: boolean;
  className?: React.ComponentProps<"button">["className"];
}

export const Button: React.FC<ButtonProps> = ({
  color = "black",
  appearance = "filled",
  className,
  size = "md",
  fullWidth = false,
  icon,
  clickAction = false,
  children,
  ...props
}) => {
  const colorVariantStyles = colorVariants[color];
  const borderVariantStyles =
    appearance === "filled"
      ? ""
      : appearance === "borderless"
      ? `${borderVariants[color]} border-none`
      : borderVariants[color];
  const sizeVariantStyles = sizeVariants[size];
  const widthStyle = fullWidth ? "w-full" : "";

  const withIconStyle = icon
    ? children
      ? "flex gap-2 items-center justify-center"
      : "px-2 py-2"
    : "";

  const clickActionStyle = clickAction ? "active:scale-75" : "";
  return (
    <button
      className={cn(
        baseStyles,
        colorVariantStyles,
        borderVariantStyles,
        sizeVariantStyles,
        widthStyle,
        withIconStyle,
        clickActionStyle,
        clickActionStyle,
        className,
      )}
      {...props}
    >
      {icon ? (
        <>
          <span>{icon}</span>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
