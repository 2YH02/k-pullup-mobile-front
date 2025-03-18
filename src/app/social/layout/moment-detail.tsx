import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useMomentStore } from "@/store/use-moment-store";
import { useViewDetailStore } from "@/store/use-view-detail-store";
import cn from "@/utils/cn";
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

  return (
    <SwipeClosePage
      os={os}
      close={close}
      className="z-[30] bg-black flex flex-col text-white"
    >
      <div
        className={cn(
          "flex flex-col w-full h-full",
          os === "iOS" ? "pt-14" : ""
        )}
        onClick={handleClickNext}
      >
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

        <div className="flex justify-between items-center text-lg font-bold p-2">
          <div>{curMoment.username}</div>
          <button onClick={close}>
            <BsX size={26} />
          </button>
        </div>

        <div className="flex flex-col grow">
          <div className="text-center">{curMoment.address}</div>
          <button
            className="underline text-center text-sm text-grey active:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              show(curMoment.markerID);
            }}
          >
            위치 자세히보기
          </button>

          <div className="grow flex items-center justify-center">
            <img
              src={curMoment.photoURL}
              alt={curMoment.caption}
              className="w-full object-cover"
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
