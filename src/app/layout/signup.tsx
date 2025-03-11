import BottomFixedButton from "@/components/bottom-fixed-button/bottom-fixed-button";
import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import Loading from "@/components/loading/loading";
import Section from "@/components/section/section";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Timer from "@/components/timer/timer";
import { useSendSignupCode } from "@/hooks/api/auth/use-send-signup-code";
import { useSignup } from "@/hooks/api/auth/use-signup";
import { useVarifyCode } from "@/hooks/api/auth/use-varify-code";
import useImagePreload from "@/hooks/use-image-preload";
import useInput from "@/hooks/use-input";
import useAlertStore from "@/store/use-alert-store";
import {
  validateCode,
  validateEmail,
  validateMassage,
  validatePassword,
} from "@/utils/validate";
import wait from "@/utils/wait";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";

export type SignupStatus = "pending" | "complete" | "error";

const Signup = ({
  os = "Windows",
  close,
}: {
  close: VoidFunction;
  os?: string;
}) => {
  const { openAlert } = useAlertStore();
  const { mutateAsync: signup } = useSignup({});

  const [signupValue, setSignupValue] = useState({
    email: "",
    username: "",
    password: "",
    verified: false,
    passwordConformed: false,
    step: 0,
  });

  const [signupStatus, setSignupStatus] = useState<SignupStatus>("pending");
  const [signupMessage, setSignupMessage] = useState([""]);

  const headerTitle = useMemo(() => {
    if (signupValue.step === 0) return "이메일 확인 (1 / 3)";
    if (signupValue.step === 1) return "사용자 이름 입력 (2 / 3)";
    if (signupValue.step === 2) return "비밀번호 입력 (3 / 3)";
  }, [signupValue.step]);

  const getButtonDisabled = useCallback(() => {
    if (signupValue.step === 0) {
      if (signupValue.verified) return false;
      else return true;
    } else if (signupValue.step === 1) {
      if (signupValue.username.length <= 0) return true;
      else return false;
    } else if (signupValue.step === 2) {
      if (signupValue.passwordConformed) return false;
      else return true;
    }

    return false;
  }, [
    signupValue.step,
    signupValue.verified,
    signupValue.username,
    signupValue.passwordConformed,
  ]);

  useImagePreload(["/signup-loading.gif"]);

  const next = async () => {
    setSignupValue((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));

    if (signupValue.step === 2) {
      try {
        setSignupMessage(["회원가입 요청 중..."]);
        await signup({
          email: signupValue.email,
          password: signupValue.password,
          username: signupValue.username,
        });

        await wait(800);
        setSignupStatus("complete");
        setSignupMessage(["회원가입이 완료되었습니다.", "환경합니다!"]);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "400") {
            setSignupMessage([
              "인증되지 않은 이메일입니다.",
              "잠시 후 다시 시도해주세요.",
            ]);
          } else if (error.message === "409") {
            setSignupMessage(["이미 등록된 이메일입니다."]);
          } else {
            setSignupMessage([
              "서버가 원활하지 않습니다.",
              "잠시 후 다시 시도해주세요.",
            ]);
          }
        }
        setSignupStatus("error");
      }
    }
  };

  const handleVerified = () => {
    setSignupValue((prev) => ({ ...prev, verified: true }));
  };
  const handleConformed = (confirm: boolean) => {
    setSignupValue((prev) => ({ ...prev, passwordConformed: confirm }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupValue((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupValue((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupValue((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handlePrev = () => {
    if (signupValue.step > 0) {
      setSignupValue((prev) => ({ ...prev, step: prev.step - 1 }));
    } else {
      openAlert({
        title: "가입 취소",
        description: "정말 회원가입을 취소하시겠습니까?",
        cancel: true,
        onClick: close,
      });
    }
  };

  return (
    <SwipeClosePage
      os={os}
      close={close}
      slideType="horizontal"
      headerTitle={headerTitle}
      dragClose={false}
      onPrevClick={handlePrev}
    >
      {signupValue.step === 0 && (
        <VerifyEmail
          email={signupValue.email}
          changeEmail={handleEmailChange}
          handleVerified={handleVerified}
        />
      )}
      {signupValue.step === 1 && (
        <EnterUsername
          username={signupValue.username}
          changeUsername={handleUsernameChange}
        />
      )}
      {signupValue.step === 2 && (
        <EnterPassword
          handleConformed={handleConformed}
          password={signupValue.password}
          changePassword={handlePasswordChange}
        />
      )}
      {signupValue.step === 3 && (
        <SignupComplete
          close={close}
          status={signupStatus}
          message={signupMessage}
        />
      )}

      {signupValue.step < 3 && (
        <BottomFixedButton
          onClick={next}
          disabled={getButtonDisabled()}
          os={os}
        >
          다음
        </BottomFixedButton>
      )}
    </SwipeClosePage>
  );
};

const VerifyEmail = ({
  email,
  changeEmail,
  handleVerified,
}: {
  email: string;
  changeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVerified: VoidFunction;
}) => {
  const { mutateAsync: sendCode, isPending: sendCodeLoading } =
    useSendSignupCode();
  const { mutateAsync: varifyCode, isPending: varifyLoading } = useVarifyCode();

  const code = useInput("");

  const [viewCode, setViewCode] = useState(false);
  const [viewError, setViewError] = useState<{
    email?: boolean;
    code?: boolean;
  }>({ email: false, code: false });

  const [completed, setCompleted] = useState<{ email: boolean; code: boolean }>(
    {
      email: false,
      code: false,
    }
  );

  const [timerReset, setTimerReset] = useState(false);

  const [errorMessage, setErrorMessage] = useState(() =>
    validateSignupEmail({ email: email, code: code.value })
  );

  useEffect(() => {
    setErrorMessage(validateSignupEmail({ email: email, code: code.value }));
  }, [email, code.value]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewError((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const sendEmail = async () => {
    setTimerReset(false);

    try {
      await sendCode(email);
      setViewCode(true);
      setCompleted((prev) => ({
        ...prev,
        email: true,
      }));

      setTimerReset(true);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "409") {
          setErrorMessage((prev) => ({
            ...prev,
            email: "이미 등록된 이메일입니다.",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            email: "잠시 후 다시 시도해주세요.",
          }));
        }
      }
    }
  };

  const verify = async () => {
    try {
      await varifyCode({ email: email, code: code.value });
      setCompleted((prev) => ({
        ...prev,
        code: true,
      }));

      handleVerified();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "400") {
          setErrorMessage((prev) => ({
            ...prev,
            code: "시간이 만료되었거나 존재하지 않는 코드입니다.",
          }));
        } else {
          setErrorMessage((prev) => ({
            ...prev,
            code: "잠시 후 다시 시도해주세요.",
          }));
        }
      }
    }
  };

  return (
    <div>
      <Section>
        <div>
          <div className="h-[74px]">
            <Input
              label="이메일"
              name="email"
              placeholder="pullup@pullup.com"
              value={email}
              onChange={changeEmail}
              onBlur={handleBlur}
              status={
                viewError.email && !!errorMessage.email ? "error" : "default"
              }
              message={
                viewError.email && errorMessage.email ? errorMessage.email : ""
              }
              disabled={completed.code}
            />
          </div>
        </div>
        <Button
          onClick={sendEmail}
          disabled={sendCodeLoading || !!errorMessage.email || completed.code}
          className="bg-primary disabled:bg-grey mt-4 h-10 flex items-center justify-center"
          fullWidth
          clickAction
        >
          {sendCodeLoading ? (
            <Loading className="text-white" size="sm" />
          ) : completed.email ? (
            "다시 요청"
          ) : (
            "인증 요청"
          )}
        </Button>
      </Section>
      <Section>
        {viewCode && (
          <div>
            <div className="relative h-[74px]">
              <Timer
                start={completed.email && !completed.code}
                reset={timerReset}
                count={300}
                className="absolute top-0 right-0 z-30"
              />
              <Input
                label="인증코드"
                name="code"
                value={code.value}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (/^\d*$/.test(inputValue) && inputValue.length <= 6) {
                    code.onChange(e);
                  }
                }}
                onBlur={handleBlur}
                status={
                  viewError.code && !!errorMessage.code ? "error" : "default"
                }
                message={
                  viewError.code && errorMessage.code ? errorMessage.code : ""
                }
                disabled={completed.code}
              />
            </div>
            <Button
              onClick={verify}
              disabled={varifyLoading || !!errorMessage.code || completed.code}
              className="bg-primary disabled:bg-grey mt-4 h-10 flex items-center justify-center"
              fullWidth
              clickAction
            >
              {varifyLoading ? (
                <Loading className="text-white" size="sm" />
              ) : completed.code ? (
                "인증 완료"
              ) : (
                "인증 확인"
              )}
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
};

const EnterUsername = ({
  username,
  changeUsername,
}: {
  username: string;
  changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Section>
      <Input label="사용자 이름" value={username} onChange={changeUsername} />
    </Section>
  );
};

const EnterPassword = ({
  password,
  changePassword,
  handleConformed,
}: {
  password: string;
  changePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConformed: (confirm: boolean) => void;
}) => {
  const [confirmValue, setConfirmValue] = useState("");

  const [passwordValidate, setPasswordValidate] = useState({
    hasLetterAndNumber: false,
    isLongEnough: false,
  });
  const [confirmValidate, setConfirmValidate] = useState({
    isSame: false,
  });

  const handleConfirmValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmValue(e.target.value);
  };

  useEffect(() => {
    const { hasLetterAndNumber, isLongEnough } = validatePassword(password);

    setPasswordValidate({ hasLetterAndNumber, isLongEnough });
  }, [password]);

  useEffect(() => {
    setConfirmValidate({ isSame: password === confirmValue });
  }, [confirmValue, password]);

  useEffect(() => {
    if (
      passwordValidate.hasLetterAndNumber &&
      passwordValidate.isLongEnough &&
      confirmValidate.isSame
    ) {
      handleConformed(true);
    } else {
      handleConformed(false);
    }
  }, [
    passwordValidate.hasLetterAndNumber,
    passwordValidate.isLongEnough,
    confirmValidate.isSame,
  ]);

  return (
    <Section>
      <div className="mb-4">
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={password}
          onChange={changePassword}
          className="mb-2"
        />
        <div className="text-sm">
          <div className="flex items-center">
            <span className="mr-2">
              {passwordValidate.hasLetterAndNumber ? (
                <BsCheck size={20} className="text-green" />
              ) : (
                <BsX size={20} className="text-red" />
              )}
            </span>
            <span>하나 이상의 숫자와 문자를 포함</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">
              {passwordValidate.isLongEnough ? (
                <BsCheck size={20} className="text-green" />
              ) : (
                <BsX size={20} className="text-red" />
              )}
            </span>
            <span>8자 이상</span>
          </div>
        </div>
      </div>
      <div>
        <Input
          label="비밀번호 확인"
          type="password"
          name="confirm"
          value={confirmValue}
          onChange={handleConfirmValue}
          className="mb-2"
        />
        <div className="flex items-center">
          <span className="mr-2">
            {!confirmValidate.isSame || password.length <= 0 ? (
              <BsX size={20} className="text-red" />
            ) : (
              <BsCheck size={20} className="text-green" />
            )}
          </span>
          <span>일치</span>
        </div>
      </div>
    </Section>
  );
};

const SignupComplete = ({
  status,
  message,
  close,
}: {
  status: SignupStatus;
  message: string[];
  close: VoidFunction;
}) => {
  return (
    <Section className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[220px]">
        <Image
          src="/signup-loading.gif"
          alt="회원가입 로딩"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority={true}
        />
      </div>
      {message?.map((text) => {
        return (
          <div key={text} className="text-lg font-bold">
            {text}
          </div>
        );
      })}

      <div className="h-24 w-full">
        {status !== "pending" && (
          <Button onClick={close} fullWidth className="mt-10 bg-primary">
            {status === "complete" ? "로그인 하러가기" : "돌아가기"}
          </Button>
        )}
      </div>
    </Section>
  );
};

interface Errors {
  email?: string | null;
  code?: string | null;
  password?: string | null;
  confirm?: string | null;
}

const validateSignupEmail = (values: {
  email: string;
  code: string;
}): Errors => {
  const errors: Errors = {};

  if (!validateEmail(values.email)) {
    errors.email = validateMassage.email;
  }

  if (!validateCode(values.code)) {
    errors.code = validateMassage.emailCode;
  }

  return errors;
};

export default Signup;
