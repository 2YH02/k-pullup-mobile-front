import { type Moment, type PostMomentPayload } from "@/api/moment";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import { Button } from "@/components/button/button";
import Divider from "@/components/divider/divider";
import Input from "@/components/input/input";
import Loading from "@/components/loading/loading";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useAddToMomentFavorite } from "@/hooks/api/moment/use-add-to-moment-favorite";
import { useDeleteMoment } from "@/hooks/api/moment/use-delete-moment";
import { useMomentForMarker } from "@/hooks/api/moment/use-moment-for-marker";
import { usePostMoment } from "@/hooks/api/moment/use-post-moment";
import { useRemoveMomentFavorite } from "@/hooks/api/moment/use-remove-moment-favorite";
import useImageLoading from "@/hooks/use-image-loading";
import useAlertStore from "@/store/use-alert-store";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useUserStore } from "@/store/use-user-store";
import cn from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BsHeart,
  BsHeartFill,
  BsThreeDots,
  BsTrash,
  BsUpload,
} from "react-icons/bs";

interface MomentProps {
  close: VoidFunction;
  os?: string;
  className?: React.ComponentProps<"div">["className"];
  openSignin?: VoidFunction;
  markerId: number;
}

const Moment = ({
  close,
  os = "Windows",
  className,
  openSignin,
  markerId,
}: MomentProps) => {
  const { user } = useUserStore();
  const { openAlert } = useAlertStore();
  const { handleImageChange, reset, previewUrl, file } = useImageLoading();

  const {
    data: moments,
    error: getMomentsError,
    isLoading: getMomentsLoading,
  } = useMomentForMarker(markerId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAuth = () => {
    if (!user) {
      openAlert({
        title: "로그인이 필요합니다.",
        description: "로그인 페이지로 이동하시겠습니까?",
        cancel: true,
        onClick: () => {
          openSignin?.();
        },
      });

      return false;
    }

    return true;
  };

  const handleUploadMoment = () => {
    const auth = handleAuth();
    if (!auth) return;

    fileInputRef.current?.click();
  };

  if (getMomentsError instanceof Error && getMomentsError.message === "500") {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        className={cn("pb-10", className)}
        slideType="horizontal"
        headerTitle="모먼트"
      >
        <div className="text-center mt-16">
          <div className="text-2xl font-bold">ERROR</div>
          <div className="text-sm">서버의 상태가 원활하지 않습니다.</div>
          <div className="text-sm">잠시 후 다시 시도해주세요</div>
        </div>
      </SwipeClosePage>
    );
  }

  return (
    <div className="relative">
      {/* 모먼트 작성 폼 */}
      {previewUrl && (
        <AddMomentForm
          imageUrl={previewUrl}
          close={reset}
          os={os}
          file={file}
          markerId={markerId}
        />
      )}

      {/* 모먼트 리스트 */}
      <SwipeClosePage
        os={os}
        close={close}
        className={cn("pb-10", className)}
        slideType="horizontal"
        headerTitle="모먼트"
        icon={
          <div className="flex items-center">
            <span className="text-xs mr-1">등록</span>
            <BsUpload />
          </div>
        }
        iconClick={handleUploadMoment}
      >
        {getMomentsLoading ? (
          <Section>
            <Skeleton className="w-full h-80 mt-6" />
            <Skeleton className="w-full h-80 mt-6" />
          </Section>
        ) : (
          <div>
            <input
              type="file"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            {!moments || moments?.length <= 0 ? (
              <div className="mt-12">
                <NotFoundImage text="등록된 모먼트가 없습니다." size="lg" />
              </div>
            ) : (
              <>
                {/* 모먼트 리스트 */}
                {moments.map((moment, i) => {
                  return (
                    <div key={moment.storyID}>
                      <MomentItem
                        data={moment}
                        isOwner={
                          user?.chulbong || user?.username === moment.username
                        }
                        markerId={markerId}
                        handleAuth={handleAuth}
                      />
                      {i !== moments.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </SwipeClosePage>
    </div>
  );
};

const MomentItem = ({
  data,
  isOwner,
  markerId,
  handleAuth,
}: {
  data: Moment;
  isOwner: boolean;
  markerId: number;
  handleAuth: () => boolean;
}) => {
  const { show } = useBottomSheetStore();

  const { mutate: addToFavorite, isPending: addLoading } =
    useAddToMomentFavorite(markerId, data.storyID);

  const { mutate: removeFavorite, isPending: deleteLoading } =
    useRemoveMomentFavorite(markerId, data.storyID);

  const handleFavorite = () => {
    const auth = handleAuth();
    if (!auth) return;

    if (data.userLiked) {
      removeFavorite(data.storyID);
    } else {
      addToFavorite(data.storyID);
    }
  };

  const isLoading = addLoading || deleteLoading;

  return (
    <div className="mb-2">
      <div className="px-4 py-2 flex items-center justify-between">
        <div>
          <div className="font-bold">{data.username}</div>
          <div className="text-xs text-grey">{formatDate(data.createdAt)}</div>
        </div>
        {isOwner && (
          <Button
            appearance="borderless"
            icon={<BsThreeDots color="#777" />}
            className="dark:bg-black dark:text-white text-grey-dark"
            onClick={() => show(`moment-${data.storyID}`)}
            clickAction
          />
        )}
      </div>
      <div className="px-4 pb-1 text-sm">{data.caption}</div>
      <div className="relative w-full h-96 sm:h-80 shadow-sm">
        <Image
          src={data.photoURL}
          alt={data.caption}
          className="object-cover"
          draggable={false}
          fill
        />
      </div>
      <button
        className="px-4 py-2 flex items-center text-sm"
        onClick={handleFavorite}
        disabled={isLoading}
      >
        <span className="mr-2">
          {!data.userLiked ? (
            <BsHeart size={12} fill="#ee2f2f" />
          ) : data.userLiked ? (
            <BsHeartFill size={12} fill="#ee2f2f" />
          ) : (
            <BsHeart size={12} fill="#ee2f2f" />
          )}
        </span>
        <span className="mr-1 text-grey-dark">좋아요</span>
        <span className="font-bold">{data.thumbsUp || 0}</span>
      </button>

      <MomentOption markerId={data.markerID} momentId={data.storyID} />
    </div>
  );
};

const MomentOption = ({
  markerId,
  momentId,
}: {
  markerId: number;
  momentId: number;
}) => {
  const { hide } = useBottomSheetStore();
  const { mutateAsync: deleteMoment, isPending } = useDeleteMoment(markerId);

  const handleDelete = async () => {
    await deleteMoment({ markerId, momentId });
    hide();
  };

  return (
    <BottomSheet title="공유" id={`moment-${momentId}`} className="pb-10">
      <button
        className="p-3 w-full flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
        onClick={handleDelete}
        disabled={isPending}
      >
        <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
          <BsTrash size={22} />
        </span>
        <span>삭제</span>
        {isPending && (
          <span className="ml-3">
            <Loading size="sm" />
          </span>
        )}
      </button>
    </BottomSheet>
  );
};

const AddMomentForm = ({
  imageUrl,
  close,
  file,
  markerId,
  os,
}: {
  imageUrl: string;
  close: VoidFunction;
  file: File | null;
  markerId: number;
  os: string;
}) => {
  const { mutate: postMoment, isPending, isSuccess } = usePostMoment(markerId);

  const [value, setValue] = useState("");

  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handlePost = () => {
    if (!file) return;
    const data: PostMomentPayload = {
      caption: value,
      markerId: markerId,
      photo: file,
    };

    postMoment(data);
  };

  return (
    <SwipeClosePage
      close={close}
      slideType="vertical"
      className="bg-black z-[34] flex flex-col"
    >
      <ModalCloseButton os={os} onClick={close} />
      <div className="relative w-full h-3/5 mt-36 mb-10">
        <Image
          src={imageUrl}
          fill
          alt=""
          className="object-cover"
          draggable={false}
        />
      </div>
      <div className="px-4">
        <div className="text-white mb-1">내용</div>
        <Input
          className="bg-grey-dark border-none text-white"
          value={value}
          onChange={handleChange}
          placeholder="오운완 🦾"
        />
      </div>
      <div className="grow" />
      <div className="text-center pb-4">
        <button
          className="text-white p-2 h-10"
          onClick={handlePost}
          disabled={isPending}
        >
          {isPending ? <Loading size="sm" /> : "만들기"}
        </button>
      </div>
    </SwipeClosePage>
  );
};

export default Moment;
