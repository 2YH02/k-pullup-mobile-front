import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import { Button } from "@/components/button/button";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import NumberInput from "@/components/number-input/number-input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import WarningText from "@/components/warning-text/warning-text";
import { type KakaoMap } from "@/types/kakao-map.types";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { MarkerDetailExtras } from "../pullup/[id]/pullup-page-client";
import UploadImageForm, { type FileData } from "./upload-image-form";

interface Props {
  os?: string;
  close?: VoidFunction;
  markerData: MarkerDetailExtras;
  className?: React.ComponentProps<"div">["className"];
}

const LocationEditRequestForm = ({
  os = "Windows",
  close,
  markerData,
  className,
}: Props) => {
  const [descriptionValue, setDescriptionValue] = useState("");

  const [viewChangeLocationMap, setViewChangeLocationMap] = useState(false);

  const [pullupBarCount, setPullupBarCount] = useState(0);
  const [parallelBarCount, setParallelBarCount] = useState(0);

  const [prevLocation, setPrevLocation] = useState({
    lat: markerData.latitude,
    lng: markerData.longitude,
    addr: markerData.address,
  });
  const [curLocation, setCurLocation] = useState<{
    lat: number | null;
    lng: number | null;
    addr: string | null;
  }>({
    lat: null,
    lng: null,
    addr: null,
  });

  const [files, setFiles] = useState<FileData[]>([]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionValue(e.target.value);
  };

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

  const changePrevLocation = ({
    lat,
    lng,
    addr,
  }: {
    lat: number;
    lng: number;
    addr: string;
  }) => {
    setPrevLocation({ lat, lng, addr });
  };

  const changeCurLocation = () => {
    setViewChangeLocationMap(false);
    setCurLocation({ ...prevLocation });
  };

  const uploadFile = (files: FileData) => {
    setFiles((prev) => [...prev, files]);
  };
  const deleteFile = (id: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((photo) => photo.previewUrl !== id);

      return filtered;
    });
  };

  return (
    <div>
      {/* 위치 수정 지도 */}
      {viewChangeLocationMap && (
        <SwipeClosePage
          close={() => setViewChangeLocationMap(false)}
          className="z-[34]"
          slideType="horizontal"
          dragClose={false}
        >
          <img
            src="/map-pin.png"
            className="w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+21px)] z-[34]"
          />
          <ModalCloseButton
            os={os}
            onClick={() => setViewChangeLocationMap(false)}
          />
          <div className="relative w-full h-full">
            <ChangeLocationMap
              lat={curLocation.lat || markerData.latitude}
              lng={curLocation.lng || markerData.longitude}
              addr={curLocation.addr || markerData.address}
              onDragEnd={changePrevLocation}
              os={os}
            />
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
        <Section title="수정할 설명을 입력해주세요.">
          <Textarea
            value={descriptionValue}
            onChnage={handleDescriptionChange}
            maxLength={40}
            placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
          />
        </Section>

        <Section title="새로운 이미지를 추가해주세요. (필수!)">
          <UploadImageForm uploadFile={uploadFile} deleteFile={deleteFile} />
        </Section>

        <Section title="위치가 정확하지 않나요?">
          <div className="mb-1">
            <span className="font-bold">현재 위치:</span> {markerData.address}
          </div>
          {curLocation.addr && (
            <div>
              <span className="font-bold">수정 위치:</span> {curLocation.addr}
            </div>
          )}
          <Button
            className="bg-primary my-2"
            onClick={() => setViewChangeLocationMap(true)}
            clickAction
          >
            위치 변경하기
          </Button>
          <WarningText>
            지도에서 위치를 수정한 후 꼭{" "}
            <span className="font-bold">위치 적용</span> 버튼을 눌러주세요!
          </WarningText>
        </Section>

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

        <BottomFixedButton
          os={os}
          onClick={
            viewChangeLocationMap
              ? changeCurLocation
              : () => {
                  console.log({
                    decription: descriptionValue,
                    photos: files,
                    curLocation: curLocation,
                    pullupBarCount,
                    parallelBarCount,
                  });
                }
          }
        >
          {viewChangeLocationMap ? "위치 적용" : "수정 요청"}
        </BottomFixedButton>
      </SwipeClosePage>
    </div>
  );
};

export const ChangeLocationMap = ({
  lat,
  lng,
  addr,
  os = "Windows",
  onDragEnd,
}: {
  lat?: number;
  lng?: number;
  addr?: string;
  os?: string;
  onDragEnd?: (data: { lat: number; lng: number; addr: string }) => void;
}) => {
  const [location, setLocation] = useState({ lat, lng, addr });
  const mapRef = useRef<KakaoMap>(null);

  useEffect(() => {
    if (!lat || !lng || mapRef.current) return;

    const mapContainer = document.getElementById("change-location-map");
    const centerPosition = new window.kakao.maps.LatLng(lat, lng);
    const mapOption = {
      center: centerPosition,
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    const geocoder = new window.kakao.maps.services.Geocoder();

    mapRef.current = map;

    if (!onDragEnd) return;

    const handleEditRequestMapIdle = () => {
      const position = map.getCenter();
      const lat = position.getLat();
      const lng = position.getLng();

      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
        let addr = "";
        if (status === window.kakao.maps.services.Status.OK) {
          addr = !!result[0].road_address
            ? result[0].road_address.address_name
            : "";
          addr += result[0].address.address_name;
        } else {
          addr = "위치 제공 안됨";
        }

        setLocation((prev) => ({ ...prev, addr }));
        onDragEnd({ lat, lng, addr });
      });
    };

    window.kakao.maps.event.addListener(map, "idle", handleEditRequestMapIdle);

    return () => {
      window.kakao.maps.event.removeListener(
        map,
        "idle",
        handleEditRequestMapIdle
      );
    };
  }, []);

  return (
    <div id="change-location-map" className={cn("relative w-full h-full z-10")}>
      <div
        className={cn(
          "absolute left-3 z-[34] w-3/4 shadow-md bg-white dark:bg-black rounded-md p-2",
          os === "iOS" ? "top-[52px]" : "top-4"
        )}
      >
        {location.addr}
      </div>
    </div>
  );
};

export default LocationEditRequestForm;
