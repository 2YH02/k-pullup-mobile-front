"use client";

import type { ContributionLevel, UserInfo } from "@/api/user";
import { Button } from "@/components/button/button";
import Main from "@/components/main/main";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import usePageTransition from "@/hooks/use-page-transition";
import BookmarkIcon from "@/icons/bookmark-icon";
import MylocateIcon from "@/icons/mylocation-icon";
import ProposalIcon from "@/icons/proposal-icon";
import ReceivedIcon from "@/icons/received-icon";
import { useUserStore } from "@/store/use-user-store";
import { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { useSessionStore } from "../../store/use-session-store";
import MarkerDetail from "../layout/marker-detail";
import Signin from "../layout/signin";
import BookmarkLocation from "./layout/bookmark-location";
import Config from "./layout/config";
import MyInfo from "./layout/my-info";
import MyLocation from "./layout/my-location";

const MePageClient = ({ os, user }: { os: string; user: UserInfo | null }) => {
  const { setUser, setLoading, loading } = useUserStore();
  const { isFirstVisit } = useSessionStore();
  const { slideIn } = usePageTransition();

  const [viewSingin, setViewSignin] = useState(false);
  const [viewMyInfo, setViewMyInfo] = useState(false);
  const [viewConfig, setViewConfig] = useState(false);
  const [viewBookmark, setViewBookmark] = useState(false);
  const [viewMyLocation, setViewMyLocation] = useState(false);

  const [viewDetail, setViewDetail] = useState(false);
  const [curDetailId, setCurDetailId] = useState(0);

  useEffect(() => {
    setUser(user);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (isFirstVisit) return;
    slideIn();
  }, []);

  const openDetail = (id: number) => {
    setViewDetail(true);
    setCurDetailId(id);
  };

  if (loading) {
    return (
      <Main os={os} headerTitle={["오늘도 와주셔서", "감사해요!"]}>
        <Section>
          <Skeleton className="w-full h-10" />
        </Section>
        <Section>
          <Skeleton className="w-full h-44" />
        </Section>
      </Main>
    );
  }

  return (
    <Main
      os={os}
      headerTitle={!user ? ["오늘도 와주셔서", "감사해요!"] : undefined}
    >
      {viewSingin && <Signin os={os} close={() => setViewSignin(false)} />}
      {viewMyInfo && (
        <MyInfo os={os} close={() => setViewMyInfo(false)} user={user} />
      )}
      {viewConfig && <Config os={os} close={() => setViewConfig(false)} />}
      {viewBookmark && (
        <BookmarkLocation
          os={os}
          close={() => setViewBookmark(false)}
          openDetail={openDetail}
        />
      )}
      {viewMyLocation && (
        <MyLocation
          os={os}
          close={() => setViewMyLocation(false)}
          openDetail={openDetail}
        />
      )}

      {(viewDetail || curDetailId !== 0) && (
        <MarkerDetail
          markerId={curDetailId}
          closeDetail={() => {
            setViewDetail(false);
            setCurDetailId(0);
          }}
          className="z-[33]"
        />
      )}

      {!user ? (
        <Section className="pb-0">
          <div className="active:bg-primary active:bg-opacity-20 rounded font-bold text-lg">
            <Button
              icon={<BsChevronRight />}
              onClick={() => setViewSignin(true)}
              className="flex-row-reverse justify-between active:scale-90 px-0 text-primary dark:text-primary bg-transparent dark:bg-transparent"
              appearance="borderless"
              clickAction
              fullWidth
            >
              로그인 및 회원가입하기
            </Button>
          </div>
        </Section>
      ) : (
        <Section className="pb-0">
          <div className="flex flex-col text-lg">
            <span>
              <span className="font-bold text-xl mr-1">{user.username}</span>
              <span>님</span>
            </span>
            <span>안녕하세요!</span>
          </div>
        </Section>
      )}

      {/* 내 정보, 설정 */}
      <Section>
        <div className="relative shadow-full rounded p-1 flex dark:border dark:border-solid dark:border-grey-dark">
          <button
            className="w-1/2 text-center active:bg-grey-light p-1 rounded dark:active:bg-grey-dark"
            onClick={() => setViewMyInfo(true)}
          >
            내 정보 관리
          </button>
          <div className="mx-3 w-[0.5px] bg-[#ddd]" />
          <button
            className="w-1/2 text-center active:bg-grey-light p-1 rounded dark:active:bg-grey-dark"
            onClick={() => setViewConfig(true)}
          >
            설정
          </button>
        </div>
      </Section>

      {/* 유저 등급 */}
      {user && (
        <Section>
          <div className="flex justify-center items-center p-4 bg-white shadow-full rounded dark:border dark:border-solid dark:border-grey-dark dark:bg-black">
            <div className="flex flex-col justify-center items-center relative w-2/5">
              <div className="w-20 mb-2">
                <img
                  src={getContributionLevelImage(user.contributionLevel)}
                  alt="등급"
                />
              </div>
              <div className="mb-2 font-bold text-xl">
                {user.contributionLevel}
              </div>
              <div>
                정보 기여 총{" "}
                <span className="text-primary font-bold">
                  {user.contributionCount || 0}
                </span>
                회
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* 버튼 링크 */}
      {user && (
        <div className="mt-4">
          <IconLinkButton
            onClick={() => setViewBookmark(true)}
            icon={<BookmarkIcon size={30} />}
          >
            저장한 장소
          </IconLinkButton>
          <IconLinkButton
            onClick={() => setViewMyLocation(true)}
            icon={<MylocateIcon size={28} />}
          >
            등록한 장소
          </IconLinkButton>
          <IconLinkButton icon={<ProposalIcon size={28} />}>
            내가 요청한 수정 목록
          </IconLinkButton>
          <IconLinkButton icon={<ReceivedIcon size={30} />}>
            받은 수정 요청 목록
          </IconLinkButton>
        </div>
      )}

      <div className="pb-10" />
    </Main>
  );
};

const IconLinkButton = ({
  icon,
  onClick,
  children,
}: React.PropsWithChildren<{
  icon: React.ReactElement;
  onClick?: VoidFunction;
}>) => {
  return (
    <Button
      className="px-4 py-2 flex items-center bg-transparent dark:text-white text-black active:scale-95 active:bg-grey-light dark:bg-black"
      fullWidth
      onClick={onClick}
      clickAction
    >
      <span className="mr-4">{icon}</span>
      <span>{children}</span>
      <div className="grow" />
      <span>
        <BsChevronRight />
      </span>
    </Button>
  );
};

const getContributionLevelImage = (level?: ContributionLevel) => {
  switch (level) {
    case "초보 운동자":
    case "운동 길잡이":
      return "/ranking1.png";
    case "철봉 탐험가":
    case "스트릿 워리어":
      return "/ranking2.png";
    case "피트니스 전도사":
    case "철봉 레인저":
      return "/ranking3.png";
    case "철봉 매버릭":
    case "거장":
      return "/ranking4.png";
    case "명인":
      return "/ranking5.png";
    default:
      return "/ranking1.png";
  }
};

export default MePageClient;
