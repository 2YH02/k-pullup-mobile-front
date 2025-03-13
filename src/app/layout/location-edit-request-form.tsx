import { SubmitReportPayload } from "@/api/report";
import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import { Button } from "@/components/button/button";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import WarningText from "@/components/warning-text/warning-text";
import { useSetReport } from "@/hooks/api/report/use-set-report";
import useImagePreload from "@/hooks/use-image-preload";
import { type KakaoMap } from "@/types/kakao-map.types";
import type { MarkerDetail } from "@/types/marker.types";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import UploadImageForm, { type FileData } from "./upload-image-form";

type Location = {
  lat: number | null;
  lng: number | null;
  addr?: string | null;
};

interface Props {
  os?: string;
  close?: VoidFunction;
  markerData: MarkerDetail;
  className?: React.ComponentProps<"div">["className"];
}

const LocationEditRequestForm = ({
  os = "Windows",
  close,
  markerData,
  className,
}: Props) => {
  const { mutateAsync: setReport, isPending: setReportLoading } =
    useSetReport();

  const [descriptionValue, setDescriptionValue] = useState(
    markerData.description || ""
  );

  const [viewChangeLocationMap, setViewChangeLocationMap] = useState(false);
  const [viewCompleted, setViewCompleted] = useState(false);

  const [prevLocation, setPrevLocation] = useState<Location>({
    lat: markerData.latitude,
    lng: markerData.longitude,
    addr: markerData.address,
  });
  const [curLocation, setCurLocation] = useState<Location>({
    lat: null,
    lng: null,
    addr: null,
  });

  const [files, setFiles] = useState<FileData[]>([]);

  const [errorMessage, setErrorMessage] = useState("");

  useImagePreload(["/congratulations.gif"]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescriptionValue(e.target.value);
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

  const handleReport = async (payload: SubmitReportPayload) => {
    try {
      setErrorMessage("");
      await setReport(payload);
      setViewCompleted(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "400") {
          setErrorMessage("유효하지 않은 입력 정보입니다.");
        } else if (error.message === "403") {
          setErrorMessage("한국 내부에서만 위치를 지정할 수 있습니다.");
        } else if (error.message === "406") {
          setErrorMessage(
            "새로운 위치가 기존 위치와 너무 멀리 떨어져 있습니다."
          );
        } else if (error.message === "409") {
          setErrorMessage("이미지를 등록해주세요.");
        } else {
          setErrorMessage(
            "서버가 원활하지 않습니다. 나중에 다시 시도해주세요."
          );
        }
      }
    }
  };

  const handleSubmit = async () => {
    const markerPayload: SubmitReportPayload = {
      markerId: markerData.markerId,
      description: descriptionValue,
      photos: files.map((file) => file.file),
      newLatitude: curLocation.lat || markerData.latitude,
      newLongitude: curLocation.lng || markerData.longitude,
      latitude: markerData.latitude,
      longitude: markerData.longitude,
    };

    await handleReport(markerPayload);
  };

  const submitDisabled = files.length <= 0 || setReportLoading;

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
            <div className="text-sm text-grey-dark dark:text-grey">
              요청하신 내역은 내 정보 페이지에서 확인 가능합니다.
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

        <Section>
          <div className="text-xs text-red text-center">{errorMessage}</div>
        </Section>

        {viewCompleted ? (
          <BottomFixedButton os={os} onClick={close}>
            돌아가기
          </BottomFixedButton>
        ) : (
          <BottomFixedButton
            os={os}
            onClick={viewChangeLocationMap ? changeCurLocation : handleSubmit}
            disabled={viewChangeLocationMap ? false : submitDisabled}
          >
            {viewChangeLocationMap ? "위치 적용" : "수정 요청"}
          </BottomFixedButton>
        )}
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
