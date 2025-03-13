"use client";

import { type Facilities, type SetFacilitiesPayload } from "@/api/marker";
import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import NumberInput from "@/components/number-input/number-input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useSetNewFacilities } from "@/hooks/api/marker/use-set-new-facilities";
import cn from "@/utils/cn";
import { useState } from "react";

interface FacilitiesEditRequestFormProps {
  os?: string;
  close: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
  facilitiesData?: Facilities[];
  markerId: number;
}

const FacilitiesEditRequestForm = ({
  facilitiesData,
  os = "Windows",
  close,
  className,
  markerId,
}: FacilitiesEditRequestFormProps) => {
  const { mutateAsync: setFacilities, isPending: setFacilitiesLoading } =
    useSetNewFacilities(markerId);

  const pullup = facilitiesData ? facilitiesData[0]?.quantity || 0 : 0;
  const parallel = facilitiesData ? facilitiesData[1]?.quantity || 0 : 0;

  const [pullupBarCount, setPullupBarCount] = useState(pullup);
  const [parallelBarCount, setParallelBarCount] = useState(parallel);

  const [errorMessage, setErrorMessage] = useState("");
  const [viewCompleted, setViewCompleted] = useState(false);

  const handlePullupBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);

    if (number > 100) setPullupBarCount(100);
    else setPullupBarCount(number);
  };
  const handleIncreasePullupBarCount = () => {
    if (pullupBarCount >= 100) return;
    setPullupBarCount((prev) => prev + 1);
  };
  const handleDecreasePullupBarCount = () => {
    if (pullupBarCount <= 0) return;
    setPullupBarCount((prev) => prev - 1);
  };

  const handleParallelBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);

    if (number > 100) setParallelBarCount(100);
    else setParallelBarCount(number);
  };
  const handleIncreaseParallelBarCount = () => {
    if (parallelBarCount >= 100) return;
    setParallelBarCount((prev) => prev + 1);
  };
  const handleDecreaseParallelBarCount = () => {
    if (parallelBarCount <= 0) return;
    setParallelBarCount((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const facilitiesPayload: SetFacilitiesPayload = {
      markerId: markerId,
      facilities: [
        { facilityId: 1, quantity: pullupBarCount },
        { facilityId: 2, quantity: parallelBarCount },
      ],
    };

    try {
      setErrorMessage("");
      await setFacilities(facilitiesPayload);
      setViewCompleted(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "400") {
          setErrorMessage("기구 개수의 입력 정보가 유효하지 않습니다.");
        } else {
          setErrorMessage(
            "서버가 원활하지 않습니다. 나중에 다시 시도해주세요."
          );
        }
      }
    }
  };

  const submitDisabled =
    (pullup === pullupBarCount && parallel === parallelBarCount) ||
    setFacilitiesLoading;

  return (
    <div>
      {viewCompleted && (
        <SwipeClosePage
          close={() => setViewCompleted(false)}
          className="z-[34]"
          slideType="horizontal"
        >
          <div className="w-full h-full flex flex-col items-center justify-center pb-28">
            <img src="/congratulations.gif" alt="정보 제공 완료 축하" />
            <div className="text-lg font-bold">
              정보를 제공해주셔서 감사합니다!
            </div>
          </div>
        </SwipeClosePage>
      )}

      <SwipeClosePage
        os={os}
        close={close}
        className={cn("pb-28 z-[33]", className)}
        slideType="horizontal"
        headerTitle="정보 수정 요청"
      >
        <Section title="기구 개수 수정">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg">철봉:</span>
            <span>
              <NumberInput
                value={pullupBarCount}
                onChange={handlePullupBarChange}
                increase={handleIncreasePullupBarCount}
                decrease={handleDecreasePullupBarCount}
              />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg">평행봉:</span>
            <span>
              <NumberInput
                value={parallelBarCount}
                onChange={handleParallelBarChange}
                increase={handleIncreaseParallelBarCount}
                decrease={handleDecreaseParallelBarCount}
              />
            </span>
          </div>
        </Section>

        <Section>
          <div className="text-xs text-red text-center">{errorMessage}</div>
        </Section>

        <BottomFixedButton
          os={os}
          onClick={viewCompleted ? close : handleSubmit}
          disabled={viewCompleted ? false : submitDisabled}
        >
          {viewCompleted ? "돌아가기" : "수정하기기"}
        </BottomFixedButton>
      </SwipeClosePage>
    </div>
  );
};

export default FacilitiesEditRequestForm;
