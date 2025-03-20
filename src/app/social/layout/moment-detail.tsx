import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useMomentStore } from "@/store/use-moment-store";
import { useViewDetailStore } from "@/store/use-view-detail-store";
import cn from "@/utils/cn";
import minutesAgo from "@/utils/minutes-ago";
import { BsX } from "react-icons/bs";

interface MomentDetailProps {
  os?: string;
  close?: VoidFunction;
}
const MomentDetail = ({ os = "Windows", close }: MomentDetailProps) => {
  const { moments, curMoment, setCurMoment } = useMomentStore();
  const { show } = useViewDetailStore();

  const nextMoment = () => {
    if (!curMoment || !moments) return;
    const i = moments.findIndex(
      (moment) => curMoment.storyID === moment.storyID
    );
    if (i === moments.length - 1) setCurMoment(moments[0]);
    else setCurMoment(moments[i + 1]);
  };
  const prevMoment = () => {
    if (!curMoment || !moments) return;
    const i = moments.findIndex(
      (moment) => curMoment.storyID === moment.storyID
    );
    if (i === 0) setCurMoment(moments[moments.length - 1]);
    else setCurMoment(moments[i - 1]);
  };

  const handleClickNext = (e: React.MouseEvent<HTMLDivElement>) => {
    const divElement = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const divWidth = divElement.clientWidth;

    if (clickX < divWidth / 2) {
      prevMoment();
    } else {
      nextMoment();
    }
  };

  if (!moments || !curMoment) return null;

  const { hours, minutes } = minutesAgo(curMoment.createdAt);

  return (
    <SwipeClosePage
      os={os}
      close={close}
      className="z-[30] bg-black text-white"
    >
      <div
        className={cn(
          "w-full h-full",
          os === "iOS" ? "pt-14" : os === "Android" ? "pt-6" : ""
        )}
        onClick={handleClickNext}
      >
        {moments.length > 1 && (
          <div className="flex gap-1 p-1">
            {moments.map((moment) => {
              if (curMoment.storyID === moment.storyID) {
                return (
                  <span
                    key={moment.storyID}
                    className="grow bg-grey-light h-[2px] rounded-lg"
                  />
                );
              } else {
                return (
                  <span
                    key={moment.storyID}
                    className="grow bg-grey h-[2px] rounded-lg"
                  />
                );
              }
            })}
          </div>
        )}

        <div className="flex justify-between items-center text-lg font-bold p-2">
          <div>
            {curMoment.username}
            <span className="ml-4 text-xs text-grey">
              {hours > 0 && `${hours}시간`}
              {`${minutes}분 전`}
            </span>
          </div>
          <button onClick={close}>
            <BsX size={26} />
          </button>
        </div>

        <div
          className={cn("text-center", os === "iOS" ? "h-[60%]" : "h-[70%]")}
        >
          <div>{curMoment.address}</div>
          <button
            className="underline text-center text-xs mb-8 text-grey active:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              show(curMoment.markerID);
            }}
          >
            위치 자세히보기
          </button>

          <div className="h-full w-full flex items-center justify-center">
            <img
              src={curMoment.photoURL}
              alt={curMoment.caption}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          <div className={cn("p-2 break-all", os === "iOS" ? "pb-10" : "")}>
            {curMoment.caption}
          </div>
        </div>
      </div>
    </SwipeClosePage>
  );
};

export default MomentDetail;
