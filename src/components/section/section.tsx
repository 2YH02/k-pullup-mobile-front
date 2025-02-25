import cn from "@/utils/cn";

interface SectionProps {
  title?: string;
  subTitle?: string;
  subTitleClick?: VoidFunction;
  className?: React.ComponentProps<"section">["className"];
}

const Section = ({
  title,
  subTitle,
  subTitleClick,
  className,
  children,
}: React.PropsWithChildren<SectionProps>) => {
  const Subtitle = subTitleClick ? "p" : "button";

  return (
    <section className={cn("p-4", className)}>
      {title && (
        <div className="mb-2 select-none flex items-center justify-between">
          <p className="font-bold text-lg">{title}</p>
          {subTitle && (
            <Subtitle
              className={cn(
                "text-[10px] ml-2 text-grey",
                subTitleClick && "underline active:text-primary"
              )}
              onClick={subTitleClick}
            >
              {subTitle}
            </Subtitle>
          )}
        </div>
      )}

      {children}
    </section>
  );
};

export default Section;
