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
  const addressArr = address.split(" ");
  const addressText =
    addressArr[addressArr.length - 4] +
    " " +
    addressArr[addressArr.length - 3] +
    " " +
    addressArr[addressArr.length - 2] +
    " " +
    addressArr[addressArr.length - 1];

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
      <div className="flex flex-wrap justify-center items-center">
        <span className="text-primary-dark mr-1">{addressText}</span>
        <span> 주변 검색</span>
      </div>
    </Button>
  );
};

export default AroundSearchButton;
