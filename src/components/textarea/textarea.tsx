import cn from "@/utils/cn";

const DEFAULT_MAX_VALUE = 524288;

interface TextareaProps {
  value?: string;
  onChnage?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  resize?: boolean;
  maxLength?: number;
  className?: React.ComponentProps<"textarea">["className"];
}

const Textarea = ({
  value,
  onChnage,
  placeholder,
  resize = false,
  maxLength = DEFAULT_MAX_VALUE,
  className,
}: TextareaProps) => {
  return (
    <div
      className={cn(
        "w-full h-32 p-4 shadow-inner-full rounded-xl dark:border dark:border-solid dark:border-grey-dark",
        className
      )}
    >
      <textarea
        value={value}
        onChange={onChnage}
        maxLength={maxLength}
        placeholder={placeholder}
        className={cn(
          "w-full h-full bg-transparent outline-none",
          resize ? "resize" : "resize-none"
        )}
      />
    </div>
  );
};

export default Textarea;
