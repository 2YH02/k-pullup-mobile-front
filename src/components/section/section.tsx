import cn from "@/utils/cn";

interface SectionProps {
  title?: string;
  titleRight?: string;
  subTitle?: string;
  subTitleClick?: VoidFunction;
  className?: React.ComponentProps<"section">["className"];
}

const Section = ({
  title,
  subTitle,
  titleRight,
  subTitleClick,
  className,
  children,
}: React.PropsWithChildren<SectionProps>) => {
  const Subtitle = subTitleClick ? "p" : "button";

  return (
    <section className={cn("p-4", className)}>
      {title && (
        <div className="mb-2 select-none flex items-center justify-between">
          <div className="flex items-center">
            <p className="font-bold text-lg">{title}</p>
            {titleRight && <p className="ml-3 text-sm text-grey">{titleRight}</p>}
          </div>
          {subTitle && (
            <Subtitle
              className={cn(
                "text-[10px] ml-2 text-primary",
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
