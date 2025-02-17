import cn from "@/utils/cn";

interface SectionProps {
  title?: string;
  subTitle?: string;
  className?: React.ComponentProps<"section">["className"];
}

const Section = ({
  title,
  subTitle,
  className,
  children,
}: React.PropsWithChildren<SectionProps>) => {
  return (
    <section className={cn("px-2 py-4", className)}>
      {title && (
        <div className="mb-2 select-none flex items-center justify-between">
          <p className="font-bold text-lg">{title}</p>
          {subTitle && <p className="text-[10px] ml-2 text-grey">{subTitle}</p>}
        </div>
      )}

      {children}
    </section>
  );
};

export default Section;
