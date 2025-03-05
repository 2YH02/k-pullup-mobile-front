"use client";

import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import NumberInput from "@/components/number-input/number-input";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import WarningText from "@/components/warning-text/warning-text";
import useViewRegisterStore from "@/store/use-view-register-store";
import cn from "@/utils/cn";
import { useState } from "react";
import { ChangeLocationMap } from "./location-edit-request-form";
import UploadImageForm, { type FileData } from "./upload-image-form";

interface CreateMarkerData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  photos: FileData[];
}

interface RegisterFormProps {
  os?: string;
  initPosition: { lat: number; lng: number; addr: string };
}

const RegisterForm = ({ initPosition, os = "Windows" }: RegisterFormProps) => {
  const { closeRegister } = useViewRegisterStore();

  const [createMarkerData, setCreateMarkerData] = useState<CreateMarkerData>({
    address: initPosition.addr,
    latitude: initPosition.lat,
    longitude: initPosition.lng,
    description: "",
    photos: [],
  });

  const [pullupBarCount, setPullupBarCount] = useState(0);
  const [parallelBarCount, setParallelBarCount] = useState(0);

  const [step, setStep] = useState(0);

  const changeLocation = ({
    lat,
    lng,
    addr,
  }: {
    lat: number;
    lng: number;
    addr: string;
  }) => {
    setCreateMarkerData((prev) => ({
      ...prev,
      address: addr,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreateMarkerData((prev) => ({ ...prev, description: e.target.value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };

  const handleRegisterClick = () => {
    if (step === 0) {
      nextStep();
    } else {
      console.log(createMarkerData);
    }
  };

  const uploadFile = (files: FileData) => {
    setCreateMarkerData((prev) => ({
      ...prev,
      photos: [...prev.photos, files],
    }));
  };
  const deleteFile = (id: string) => {
    setCreateMarkerData((prev) => {
      const filtered = prev.photos.filter((photo) => photo.previewUrl !== id);

      return {
        ...prev,
        photos: filtered,
      };
    });
  };

  return (
    <SwipeClosePage
      close={closeRegister}
      className="z-[34]"
      slideType="horizontal"
      dragClose={false}
    >
      <img
        src="/map-pin.png"
        className="w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+21px)] z-20"
      />
      <ModalCloseButton os={os} onClick={closeRegister} />
      {initPosition.lng > 0 && initPosition.lat > 0 && (
        <div className="relative w-full h-full">
          <ChangeLocationMap
            lat={initPosition.lat}
            lng={initPosition.lng}
            addr={initPosition.addr}
            onDragEnd={changeLocation}
            os={os}
          />
        </div>
      )}

      <div
        className={cn(
          "absolute bottom-0 left-0 w-full bg-white dark:bg-black z-40 px-4 pb-20 rounded-t-3xl shadow-full",
          step !== 0
            ? os === "iOS"
              ? "h-full rounded-none pt-16"
              : "h-full rounded-none pt-4"
            : "h-auto rounded-t-3xl pt-4"
        )}
      >
        {step === 0 && <SelectLocation />}
        {step === 1 && (
          <div>
            <div className="font-bold mb-4 mt-3 text-sm text-primary">
              <div>정확한 정보를 입력해 주시면,</div>
              <div>다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!</div>
            </div>
            <Description
              value={createMarkerData.description}
              onChage={handleDescriptionChange}
            />

            <SelectFacilitiesCount
              pullupBarCount={pullupBarCount}
              parallelBarCount={parallelBarCount}
              setPullupBarCount={setPullupBarCount}
              setParallelBarCount={setParallelBarCount}
            />

            <div>
              <div className="font-bold mb-2">이미지 등록</div>
              <UploadImageForm
                uploadFile={uploadFile}
                deleteFile={deleteFile}
              />
            </div>
          </div>
        )}
      </div>

      <BottomFixedButton
        onClick={handleRegisterClick}
        withSecondButton={step !== 0}
        secondButtonTitle="이전"
        secondButtonClick={prevStep}
        os={os}
      >
        {step === 1 ? "등록" : "다음"}
      </BottomFixedButton>
    </SwipeClosePage>
  );
};

const SelectLocation = () => {
  return (
    <div>
      <div className="text-center font-bold mb-4 mt-2">
        지도를 이동해 원하는 위치에 핀을 고정해주세요
      </div>

      <WarningText className="text-xs">
        등록된 위치에 철봉이 실제로 존재하지 않거나 부정확한 정보일 경우, 사전
        안내 없이 삭제될 수 있습니다.
      </WarningText>
    </div>
  );
};

interface SelectFacilitiesCountProps {
  pullupBarCount: number;
  setPullupBarCount: React.Dispatch<React.SetStateAction<number>>;
  parallelBarCount: number;
  setParallelBarCount: React.Dispatch<React.SetStateAction<number>>;
}

const SelectFacilitiesCount = ({
  setParallelBarCount,
  setPullupBarCount,
  parallelBarCount,
  pullupBarCount,
}: SelectFacilitiesCountProps) => {
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

  return (
    <div className="mb-7">
      <div className="font-bold mb-2">기구 개수 등록</div>
      <div className="flex justify-between items-center mb-2">
        <span>철봉:</span>
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
        <span>평행봉:</span>
        <span>
          <NumberInput
            value={parallelBarCount}
            onChange={handleParallelBarChange}
            increase={handleIncreaseParallelBarCount}
            decrease={handleDecreaseParallelBarCount}
          />
        </span>
      </div>
    </div>
  );
};

const Description = ({
  value,
  onChage,
}: {
  value: string;
  onChage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="mb-7">
      <div className="font-bold mb-2">설명</div>
      <Textarea
        value={value}
        onChnage={onChage}
        maxLength={40}
        placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
      />
    </div>
  );
};

export default RegisterForm;
