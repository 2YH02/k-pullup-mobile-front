import { Button } from "@/components/button/button";
import cn from "@/utils/cn";
import { BsArrowClockwise } from "react-icons/bs";

const AroundSearchButton = ({
  address,
  viewAroundSearchList,
  onClick,
}: {
  address: string;
  viewAroundSearchList?: boolean;
  onClick?: VoidFunction;
}) => {
  return (
    <Button
      className={`text-xs text-black rounded-full bg-white shadow-sm border border-solid border-[#eee] h-8 p-0 px-3 flex-row-reverse
        dark:bg-black dark:text-white dark:border-grey-dark`}
      clickAction
      size="sm"
      onClick={onClick}
      icon={
        <BsArrowClockwise
          size={16}
          className={cn(
            "text-primary-dark",
            viewAroundSearchList ? "rotate-180" : ""
          )}
        />
      }
    >
      <span className="text-primary-dark">{address}</span>
      <span> 주변 검색</span>
    </Button>
  );
};

export default AroundSearchButton;
