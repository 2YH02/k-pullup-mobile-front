import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import cn from "@/utils/cn";
import { useState } from "react";
import UploadImageForm from "./upload-image-form";

interface Props {
  os?: string;
  close?: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}

const LocationEditRequestForm = ({
  os = "Windows",
  close,
  className,
}: Props) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <SwipeClosePage
      os={os}
      close={close}
      className={cn("pb-10 z-[33]", className)}
      slideType="horizontal"
      headerTitle="정보 수정 요청"
    >
      <Section title="수정할 설명을 입력해주세요.">
        <Textarea
          value={value}
          onChnage={handleChange}
          maxLength={40}
          placeholder="해당 위치에 대한 설명을 40자 이내로 작성해주세요."
        />
      </Section>

      <Section title="새로운 이미지를 추가해주세요. (필수!)">
        <UploadImageForm />
      </Section>

      <Section title="위치가 정확하지 않나요?">
        <div>위치 변경</div>
      </Section>
      <Section title="기구 개수 수정">
        <div>기구 개수 변경</div>
      </Section>

      <BottomFixedButton>수정 요청</BottomFixedButton>
    </SwipeClosePage>
  );
};

export default LocationEditRequestForm;
