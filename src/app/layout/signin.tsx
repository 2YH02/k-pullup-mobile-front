import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import useImagePreload from "@/hooks/use-image-preload";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResetPasswordForm from "./reset-password-form";
import Signup from "./signup";

interface SigninProps {
  close?: VoidFunction;
  os?: string;
}

const Signin = ({ os = "Windows", close }: SigninProps) => {
  const [viewEmailSignin, setViewEmailSignin] = useState(false);

  useImagePreload(["/logo.png"]);

  return (
    <SwipeClosePage
      os={os}
      headerTitle="로그인"
      close={close}
      slideType="horizontal"
    >
      {viewEmailSignin && (
        <EmailSigninForm os={os} close={() => setViewEmailSignin(false)} />
      )}

      <OauthSignin />

      <button
        className="w-full text-center text-sm active:underline"
        onClick={() => setViewEmailSignin(true)}
      >
        이메일로 로그인
      </button>
    </SwipeClosePage>
  );
};

const OauthSignin = () => {
  return (
    <Section className="flex flex-col items-center justify-start">
      <div className="w-36 h-36 rounded-3xl overflow-hidden">
        <Image
          src="/logo.png"
          alt="로그인"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-xl font-bold mt-3 mb-6">대한민국 철봉 지도</div>

      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`}
        className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#FFDB6D] flex items-center justify-center
          web:text-lg mb-4"
      >
        <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
          <img src="/kakao-logo.svg" alt="카카오 로고" className="" />
        </div>
        <div className="w-full text-center text-[#3D1200]">카카오 로그인</div>
      </Link>

      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/naver`}
        className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#1FBB64] flex items-center justify-center
          web:text-lg text-white mb-4"
      >
        <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
          <img src="/naver-logo.svg" alt="네이버 로고" className="" />
        </div>
        <div className="w-full text-center text-white">네이버 로그인</div>
      </Link>

      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}
        className="w-[90%] min-w-[300px] h-12 rounded-lg bg-white flex items-center justify-center
          web:text-lg border border-solid border-grey"
        replace
      >
        <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
          <img src="/google-logo.svg" alt="구글 로고" className="" />
        </div>
        <div className="w-full text-center text-black">구글 로그인</div>
      </Link>
    </Section>
  );
};

const EmailSigninForm = ({
  close,
  os = "Windows",
}: {
  close: VoidFunction;
  os?: string;
}) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [viewResetPasswordPage, setViewResetPasswordPage] = useState(false);
  const [viewEmailSignupPage, setViewEmailSignupPage] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  return (
    <SwipeClosePage
      os={os}
      close={close}
      slideType="horizontal"
      headerTitle="이메일 로그인"
    >
      {viewEmailSignupPage && (
        <Signup os={os} close={() => setViewEmailSignupPage(false)} />
      )}
      {viewResetPasswordPage && (
        <ResetPasswordForm close={() => setViewResetPasswordPage(false)} />
      )}
      <Section className="mt-10">
        <div className=" h-[90px]">
          <Input
            label="이메일"
            type="email"
            value={emailValue}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <Input
            label="비밀번호"
            type="password"
            value={passwordValue}
            onChange={handlePasswordChange}
          />
        </div>

        <Button
          className="bg-primary mt-5 disabled:bg-grey"
          clickAction
          fullWidth
        >
          로그인
        </Button>
      </Section>
      <Section>
        <div className="text-sm">
          <span className="font-bold mr-1">계정이 없으신가요?</span>
          <button
            className="active:underline"
            onClick={() => setViewEmailSignupPage(true)}
          >
            이메일로 회원가입하기
          </button>
        </div>
        <div className="text-sm">
          <span className="font-bold mr-1">비밀번호를 잊어버리셨나요?</span>
          <button
            className="active:underline"
            onClick={() => setViewResetPasswordPage(true)}
          >
            비밀번호 초기화하기
          </button>
        </div>
      </Section>
    </SwipeClosePage>
  );
};

export default Signin;
