"use client";

import { MarkerRes } from "@/api/marker";
import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import NumberInput from "@/components/number-input/number-input";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import WarningText from "@/components/warning-text/warning-text";
import { useAddNewMarker } from "@/hooks/api/marker/use-add-new-marker";
import { useVerifyMarkerLocation } from "@/hooks/api/marker/use-verify-marker-location";
import useImagePreload from "@/hooks/use-image-preload";
import useToast from "@/hooks/use-toast";
import { useMapStore } from "@/store/use-map-store";
import useMarkerStore from "@/store/use-marker-store";
import useViewRegisterStore from "@/store/use-view-register-store";
import { type KakaoMap } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { ChangeLocationMap } from "./location-edit-request-form";
import UploadImageForm, { type FileData } from "./upload-image-form";

interface CreateMarkerData {
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  photos: FileData[];
}

interface RegisterFormProps {
  os?: string;
  initPosition: { lat: number; lng: number; addr: string };
}

const RegisterForm = ({ initPosition, os = "Windows" }: RegisterFormProps) => {
  const { toast } = useToast();
  const { closeRegister } = useViewRegisterStore();
  const { setMarker } = useMarkerStore();
  const { selectMarker } = useMapStore();
  const { map } = useMapStore();

  const { mutateAsync: addNewMarker, isPending: addMarkerLoading } =
    useAddNewMarker();
  const { mutateAsync: verifyLocation, isPending: verifyLoading } =
    useVerifyMarkerLocation();

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

  const [viewCompleted, setViewCompleted] = useState(false);

  const [locationErrorMessage, setLocationErrorMessage] = useState("");

  useImagePreload(["/congratulations.gif"]);

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

  const handleRegisterClick = async () => {
    if (step === 0) {
      try {
        await verifyLocation({
          latitude: createMarkerData.latitude,
          longitude: createMarkerData.longitude,
        });
        setLocationErrorMessage("");
        nextStep();
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "403") {
            setLocationErrorMessage("위치는 한국에서만 등록할 수 있습니다.");
          } else if (error.message === "409") {
            setLocationErrorMessage(
              "이 위치 근처에 이미 철봉이 등록되어 있습니다."
            );
          } else if (error.message === "422") {
            setLocationErrorMessage("이 위치는 등록이 제한된 구역입니다.");
          } else {
            setLocationErrorMessage(
              "서버 원활하지 않습니다. 잠시 후 다시 시도해주세요."
            );
          }
        }
      }
    } else {
      try {
        const marker = await addNewMarker({
          latitude: createMarkerData.latitude,
          longitude: createMarkerData.longitude,
          description: createMarkerData.description,
          photos: createMarkerData.photos.map((photo) => photo.file),
        });

        const newMarker: MarkerRes = {
          ...marker,
          hasPhoto: createMarkerData.photos.length > 0 ? true : false,
        };

        setMarker([newMarker]);
        selectMarker(marker.markerId);

        setViewCompleted(true);

        if (map) {
          const moveLatLon = new window.kakao.maps.LatLng(
            createMarkerData.latitude,
            createMarkerData.longitude
          );

          map.panTo(moveLatLon);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "400") {
            toast("유효하지 않은 입력 정보입니다.");
          } else if (error.message === "409") {
            toast("파일을 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.");
          } else {
            toast("서버 원활하지 않습니다. 잠시 후 다시 시도해주세요.");
          }
        }
      }
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
    <div>
      {viewCompleted && <AddComplete />}

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
            "absolute bottom-0 left-0 w-full bg-white dark:bg-black z-40 px-4 pb-20 rounded-t-3xl",
            step !== 0
              ? os === "iOS"
                ? "h-full rounded-none pt-16 shadow-none"
                : "h-full rounded-none pt-8 shadow-none"
              : "h-auto rounded-t-3xl pt-4 shadow-full"
          )}
        >
          {step === 0 && <SelectLocation errorMessage={locationErrorMessage} />}
          {step === 1 && (
            <div className="pb-24">
              <div className="font-bold mb-4 mt-3 text-sm text-primary">
                <div>정확한 정보를 입력해 주시면,</div>
                <div>다른 사람이 해당 위치를 찾는 데 큰 도움이 됩니다!</div>
              </div>

              {/* 지도 */}
              <div className="mb-7">
                <div className="h-48 mb-1">
                  <Map
                    lat={createMarkerData.latitude || initPosition.lat}
                    lng={createMarkerData.longitude || initPosition.lng}
                  />
                </div>
                <div>
                  <span className="mr-4">
                    위도 :{" "}
                    {Number(createMarkerData.latitude?.toFixed(5)) ||
                      Number(initPosition.lat.toFixed(5))}
                  </span>
                  <span>
                    경도 :{" "}
                    {Number(createMarkerData.longitude?.toFixed(5)) ||
                      Number(initPosition.lng.toFixed(5))}
                  </span>
                </div>
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
        {viewCompleted ? (
          <BottomFixedButton os={os} onClick={closeRegister}>
            돌아가기
          </BottomFixedButton>
        ) : (
          <BottomFixedButton
            onClick={handleRegisterClick}
            withSecondButton={step !== 0}
            secondButtonTitle="이전"
            secondButtonClick={prevStep}
            disabled={step === 0 ? verifyLoading : addMarkerLoading}
            os={os}
          >
            {step === 1 ? "등록" : "다음"}
          </BottomFixedButton>
        )}
      </SwipeClosePage>
    </div>
  );
};

const SelectLocation = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div>
      <div className="text-center font-bold mb-4 mt-2">
        지도를 이동해 원하는 위치에 핀을 고정해주세요
      </div>

      <WarningText className="text-xs">
        등록된 위치에 철봉이 실제로 존재하지 않거나 부정확한 정보일 경우, 사전
        안내 없이 삭제될 수 있습니다.
      </WarningText>
      <div className="text-red text-center text-xs">{errorMessage}</div>
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

const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  const mapRef = useRef<KakaoMap>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const mapContainer = document.getElementById("register-detail-map");
    const centerPosition = new window.kakao.maps.LatLng(lat, lng);
    const mapOption = {
      center: centerPosition,
      draggable: false,
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    const imageSize = new window.kakao.maps.Size(28, 33);
    const imageOption = { offset: new window.kakao.maps.Point(14, 29) };
    const imageUrl = "/normal-selected.png";

    const pin = new window.kakao.maps.MarkerImage(
      imageUrl,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: centerPosition,
      image: pin,
    });

    marker.setMap(map);

    mapRef.current = map;
  }, []);

  return (
    <div
      id="register-detail-map"
      className={cn("relative w-full h-full z-10")}
    />
  );
};

const AddComplete = () => {
  return (
    <SwipeClosePage dragClose={false} className="z-[35]" slideType="horizontal">
      <div className="w-full h-full flex flex-col items-center justify-center pb-28">
        <img src="/congratulations.gif" alt="정보 제공 완료 축하" />
        <div className="text-lg font-bold">정보를 제공해주셔서 감사합니다!</div>
        <div className="text-sm text-grey-dark dark:text-grey">
          등록하신 내역은 내 정보 페이지에서 확인 가능합니다.
        </div>
      </div>
    </SwipeClosePage>
  );
};

export default RegisterForm;
