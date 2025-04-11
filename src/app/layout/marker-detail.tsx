"use client";

import { convertWgs } from "@/api/marker";
import { type UserInfo } from "@/api/user";
import { Badge } from "@/components/badge/badge";
import BottomSheet from "@/components/bottom-sheet/bottom-sheet";
import { Button } from "@/components/button/button";
import Divider from "@/components/divider/divider";
import Loading from "@/components/loading/loading";
import ModalCloseButton from "@/components/modal-close-button/modal-close-button";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import Textarea from "@/components/textarea/textarea";
import { useAddComment } from "@/hooks/api/comments/use-add-comment";
import { useDeleteComment } from "@/hooks/api/comments/use-delete-comment";
import { useInfiniteComments } from "@/hooks/api/comments/use-infinite-comments";
import { useAddToFavorite } from "@/hooks/api/marker/use-add-to-favorite";
import { useDeleteFavorite } from "@/hooks/api/marker/use-delete-favorite";
import { useDeleteMarker } from "@/hooks/api/marker/use-delete-marker";
import { useDownloadPdf } from "@/hooks/api/marker/use-download-pdf";
import { useMarkerDetails } from "@/hooks/api/marker/use-marker-details";
import { useMarkerFacilities } from "@/hooks/api/marker/use-marker-facilities";
import { useMarkerWeather } from "@/hooks/api/marker/use-marker-weather";
import { useClipboard } from "@/hooks/use-clipboard";
import useToast from "@/hooks/use-toast";
import useAlertStore from "@/store/use-alert-store";
import { useBottomSheetStore } from "@/store/use-bottom-sheet-store";
import { useGpsStore } from "@/store/use-gps-store";
import useMarkerStore from "@/store/use-marker-store";
import { useUserStore } from "@/store/use-user-store";
import { type KakaoMap } from "@/types/kakao-map.types";
import type { MarkerDetail, Photo } from "@/types/marker.types";
import cn from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import MapWalker from "@/utils/map-walker";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import {
  BsArrowLeftShort,
  BsBookmark,
  BsBookmarkFill,
  BsCloudDownload,
  BsCopy,
  BsFillPinMapFill,
  BsFillShareFill,
  BsPersonBoundingBox,
  BsThreeDots,
  BsTrash,
} from "react-icons/bs";
import Slider from "react-slick";
import FacilitiesEditRequestForm from "./facilities-edit-request-form";
import LocationEditRequestForm from "./location-edit-request-form";
import Moment from "./moment";
import Signin from "./signin";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Ads from "@/components/ads/ads";

interface MarkerDetailProps {
  imageUrl?: string | null;
  markerId: number;
  os?: string;
  closeDetail?: VoidFunction;
  imageCache?: (img: string | null) => void;
  slideType?: "vertical" | "horizontal" | "none";
  className?: React.ComponentProps<"div">["className"];
}

const MarkerDetail = ({
  markerId,
  imageUrl,
  os = "Windows",
  className,
  slideType = "vertical",
  closeDetail,
  imageCache,
}: MarkerDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { location } = useGpsStore();
  const { deleteMarker: deleteCurMarker } = useMarkerStore();
  const { user } = useUserStore();
  const { show, hide } = useBottomSheetStore();
  const { toast } = useToast();
  const { openAlert } = useAlertStore();

  const {
    data: marker,
    isLoading: markerLoading,
    error: markerError,
  } = useMarkerDetails(markerId);
  const { data: facilities, error: facilitiesError } =
    useMarkerFacilities(markerId);
  const {
    data: weather,
    error: weatherError,
    isLoading: weatherLoading,
  } = useMarkerWeather(marker?.latitude as number, marker?.longitude as number);

  const { mutate: deleteFavorite, isPending: deleteFavoriteLoading } =
    useDeleteFavorite(marker?.markerId || 0);
  const { mutate: addToFavorite, isPending: addToFavoriteLoading } =
    useAddToFavorite(marker?.markerId || 0);

  const { mutateAsync: deleteMarker, isPending: deleteLoading } =
    useDeleteMarker();

  const titleRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<null | KakaoMap>(null);

  const [viewHeader, setViewHeader] = useState(false);

  const [roadviewMap, setRoadviewMap] = useState(false);
  const [activeRoadview, setActiveRoadview] = useState(true);

  const [viewMoment, setViewMoment] = useState(false);

  const [viewLocationEditForm, setViewLocationEditForm] = useState(false);
  const [viewFacilitiesEditForm, setViewFacilitiesEditForm] = useState(false);

  const [viewImageDetail, setViewImageDetail] = useState(false);
  const [curImageIndex, setCurImageIndex] = useState(0);

  const [viewSignin, setViewSignin] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewHeader(false);
        } else {
          setViewHeader(true);
        }
      },
      { threshold: 0.6 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [titleRef.current]);

  useEffect(() => {
    if (!marker || !map) return;
    const position = new window.kakao.maps.LatLng(
      marker.latitude,
      marker.longitude
    );
    map.relayout();
    map.setCenter(position);
  }, [activeRoadview]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["marker-details", markerId] });
  }, [user]);

  const openRoadview = () => {
    setRoadviewMap(true);
    setActiveRoadview(true);
  };
  const closeRoadview = () => {
    setRoadviewMap(false);
    setMap(null);
  };

  const openMoment = () => {
    setViewMoment(true);
  };
  const closeMoment = () => {
    setViewMoment(false);
  };

  const onImageClick = (index: number) => {
    setCurImageIndex(index);
    setViewImageDetail(true);
  };

  const handleFavorite = () => {
    if (!marker) return;

    if (!user) {
      openAlert({
        title: "로그인이 필요합니다.",
        description: "로그인 페이지로 이동하시겠습니까?",
        cancel: true,
        onClick: () => {
          setViewSignin(true);
        },
      });

      return;
    }

    if (marker.favorited) {
      deleteFavorite(marker.markerId);
    } else {
      addToFavorite(marker.markerId);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMarker(markerId);
      if (closeDetail) closeDetail();
      deleteCurMarker(markerId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "403") {
          toast("삭제 권한이 없습니다.");
        } else if (error.message === "400") {
          toast("존재하지 않거나 이미 삭제된 위치입니다.");
        } else {
          toast("서버가 원할하지 않습니다 잠시 후 다시 시도해주세요.");
        }
      }
    }
  };

  const openLocation = async () => {
    if (!location || !marker) return;

    const sp = await convertWgs(location.lat, location.lng);
    const dst = await convertWgs(marker.latitude, marker.longitude);

    if (sp && dst) {
      const url = `https://map.kakao.com/?map_type=TYPE_MAP&target=walk&rt=${sp.X},${sp.Y},${dst.X},${dst.Y}&rt1=내 위치&rt2=${marker.address}`;

      window.open(url, "_blank");
    }
  };

  if (markerError?.message === "404") {
    return (
      <SwipeClosePage close={closeDetail} headerTitle="404 Not Found">
        <div className="mt-10">
          <NotFoundImage size="lg" text="위치를 찾을 수 없습니다." />
        </div>
      </SwipeClosePage>
    );
  }

  if (!markerLoading && !marker) return null;

  return (
    <div className={className}>
      {/* 로드뷰 지도 모달 */}
      {roadviewMap && (
        <SwipeClosePage
          close={closeRoadview}
          className="z-[33]"
          slideType="horizontal"
          dragClose={false}
        >
          <ModalCloseButton os={os} onClick={closeRoadview} />
          {activeRoadview && (
            <div className="relative w-full h-2/3 shadow-lg z-20 border-b border-solid border-grey">
              <RoadView
                id="detail-roadview"
                lat={marker?.latitude}
                lng={marker?.longitude}
                isView={activeRoadview}
                close={() => setActiveRoadview(false)}
                map={map}
              />
            </div>
          )}

          <div
            className={cn(
              "relative w-full z-10",
              activeRoadview ? "h-1/3" : "h-full"
            )}
          >
            <Map
              id="roadview-map"
              lat={marker?.latitude}
              lng={marker?.longitude}
              type={activeRoadview ? "ROADVIEW" : "ROADMAP"}
              setMap={setMap}
            />
          </div>
        </SwipeClosePage>
      )}

      {/*  모먼트 페이지 모달 */}
      {viewMoment && (
        <Moment
          os={os}
          close={closeMoment}
          openSignin={() => setViewSignin(true)}
          className="z-[33]"
          markerId={markerId}
        />
      )}

      {/* 정보 수정 요청 */}
      {viewLocationEditForm && marker && (
        <LocationEditRequestForm
          os={os}
          close={() => setViewLocationEditForm(false)}
          markerData={marker}
        />
      )}

      {/* 기구 개수 수정 */}
      {marker && viewFacilitiesEditForm && (
        <FacilitiesEditRequestForm
          os={os}
          close={() => setViewFacilitiesEditForm(false)}
          markerId={marker.markerId}
          facilitiesData={facilities}
        />
      )}

      {/* 이미지 상세 모달 */}
      {viewImageDetail && (
        <ImageDetail
          os={os}
          close={() => setViewImageDetail(false)}
          className="z-[33]"
          images={marker?.photos}
          curImageIndex={curImageIndex}
        />
      )}

      {/* 로그인 모달 */}
      {viewSignin && (
        <Signin os={os} close={() => setViewSignin(false)} className="z-[34]" />
      )}

      {/* 헤더 */}
      <div
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 w-full z-[32] flex items-center px-2 duration-300 max-w-[600px]",
          os === "iOS"
            ? "h-24 pt-8"
            : os === "Android"
            ? "pt-4 h-[70px]"
            : "h-12",
          viewHeader
            ? "bg-white dark:bg-black"
            : "bg-transparent dark:bg-transparent"
        )}
      >
        <Button
          icon={<BsArrowLeftShort size={26} />}
          clickAction
          className="rounded-full bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(35,35,35,0.7)] text-black dark:text-white p-1 mr-2"
          onClick={() => {
            if (closeDetail) closeDetail();
            else router.back();
            imageCache?.(null);
          }}
        />
        {viewHeader && (
          <div className="truncate">{marker?.address || "주소 정보 없음"}</div>
        )}
      </div>

      <SwipeClosePage
        close={closeDetail}
        className="z-[31]"
        slideType={slideType}
      >
        {markerLoading || !marker ? (
          <>
            {imageUrl && (
              <div className="w-full h-72">
                <img
                  src={imageUrl}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
            <DetailSkeletons imageUrl={imageUrl} />
          </>
        ) : (
          <>
            {/* 이미지 슬라이드 */}
            <ImageSlide photos={marker.photos} loadingImage={imageUrl} />
            {!marker.photos && (
              <div
                className={cn(
                  "w-full h-10 bg-transparent",
                  os === "iOS" ? "h-20" : os === "Android" ? "h-16" : "h-12"
                )}
              />
            )}
            {/* 기구 개수 정보 */}
            <Section className="flex flex-wrap gap-2 pt-2 pb-0">
              {facilities && !facilitiesError && facilities.length > 0 && (
                <>
                  {facilities[0].quantity > 0 && (
                    <MarkerDetailBadge>
                      철봉 {facilities[0].quantity} 개
                    </MarkerDetailBadge>
                  )}
                  {facilities[1].quantity > 0 && (
                    <MarkerDetailBadge>
                      평행봉 {facilities[1].quantity} 개
                    </MarkerDetailBadge>
                  )}
                </>
              )}

              {weatherLoading && <Skeleton className="w-24 h-7 rounded-full" />}
              {weather && !weatherError && (
                <MarkerDetailBadge>
                  <div className="relative w-5 h-5 shrink-0">
                    <Image src={weather.iconImage} fill alt={weather.desc} />
                  </div>
                  <div className="shrink-0">{weather.temperature} °C</div>
                </MarkerDetailBadge>
              )}
            </Section>

            {/* 정보 및 버튼 버튼 */}
            <Section className="pb-0 pt-2">
              <h1 ref={titleRef} className="text-xl">
                {marker.address}
              </h1>
              <p className="text-sm font-bold mb-2">{marker.description}</p>
              <p className="text-xs text-grey mb-2">
                최종 수정일: {formatDate(marker.updatedAt)}
              </p>
              <div className="flex justify-between text-xs mb-4">
                <div>
                  <button
                    className="underline mr-2"
                    onClick={() => setViewLocationEditForm(true)}
                  >
                    정보 수정 요청
                  </button>
                  <button
                    className="underline"
                    onClick={() => setViewFacilitiesEditForm(true)}
                  >
                    기구 개수 수정
                  </button>
                </div>
                <span className="flex items-center">
                  <span className="mr-1">
                    <StarIcon />
                  </span>
                  <span>정보 제공자: {marker.username}</span>
                </span>
              </div>
              <div className="flex h-16 border-t border-solid border-[#ccc] py-1">
                <IconButton
                  icon={
                    marker.favorited ? (
                      <BsBookmarkFill size={20} className="fill-primary" />
                    ) : (
                      <BsBookmark size={20} className="fill-primary" />
                    )
                  }
                  disabled={addToFavoriteLoading || deleteFavoriteLoading}
                  onClick={handleFavorite}
                >
                  북마크
                </IconButton>
                <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
                <IconButton
                  icon={<BsFillPinMapFill size={20} className="fill-primary" />}
                  onClick={openLocation}
                >
                  길찾기
                </IconButton>
                <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
                <IconButton
                  icon={
                    <BsPersonBoundingBox size={20} className="fill-primary" />
                  }
                  onClick={openMoment}
                >
                  모먼트
                </IconButton>
                <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
                <IconButton
                  icon={<BsFillShareFill size={20} className="fill-primary" />}
                  onClick={() => show("share")}
                >
                  공유
                </IconButton>
                {marker.isChulbong && (
                  <>
                    <div className="h-11 my-auto border-r border-solid border-[#ccc]" />
                    <IconButton
                      icon={<BsTrash size={20} className="fill-primary" />}
                      onClick={() => {
                        openAlert({
                          title: "정말 삭제하시겠습니까?",
                          description:
                            "해당 위치에 대한 정보가 모두 삭제됩니다.",
                          cancel: true,
                          onClickAsync: handleDelete,
                        });
                      }}
                      disabled={deleteLoading}
                    >
                      삭제
                    </IconButton>
                  </>
                )}
              </div>
            </Section>

            <Divider />
            <Ads type="feed" />

            {/* 지도 및 길찾기 */}
            <Section>
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                <div
                  role="button"
                  className={cn("absolute w-full h-full z-20")}
                  onClick={() => {
                    setActiveRoadview(false);
                    setRoadviewMap(true);
                  }}
                />
                <Map
                  id="detail-map"
                  lat={marker.latitude}
                  lng={marker.longitude}
                />
              </div>
              <Button
                fullWidth
                clickAction
                className="bg-primary active:scale-90"
                onClick={openRoadview}
              >
                거리뷰
              </Button>
            </Section>

            <Divider />

            {/* 이미지 */}
            <Section
              title="이미지"
              subTitle="정보 수정 요청"
              subTitleClick={() => setViewLocationEditForm(true)}
            >
              <MarkerDetailImages
                images={marker.photos}
                onImageClick={onImageClick}
              />
            </Section>

            {/* 리뷰 */}
            <MarkerComments markerId={marker.markerId} user={user} />
            <MarkerCommentsForm
              markerId={marker.markerId}
              close={hide}
              isLoggedIn={!!user}
              openSignin={() => setViewSignin(true)}
            />

            {/* 공유 모달 */}
            <ShareModal
              address={marker.address || "주소 정보 제공 안됨"}
              id={marker.markerId}
              location={{ lat: marker.latitude, lng: marker.longitude }}
            />
          </>
        )}
      </SwipeClosePage>
    </div>
  );
};

// TODO: 메모이제이션 성능 비교 필요
const ImageSlide = ({
  photos,
  loadingImage,
}: {
  photos?: Photo[];
  loadingImage?: string | null;
}) => {
  const [curImageIndex, setCurImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slideSettings = {
    accessibility: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_: number, newIndex: number) => {
      setCurImageIndex(newIndex);
    },
  };

  if (!photos) return null;

  return (
    <div>
      <div className="relative w-full h-72 overflow-hidden">
        {!imageLoaded && <Skeleton className="w-full h-72" />}
        <Slider {...slideSettings}>
          {photos.map((item, index) => (
            <div key={item.photoId} className="w-full h-72 focus:outline-none">
              <img
                src={
                  !imageLoaded && loadingImage
                    ? loadingImage
                    : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.photoUrl}`
                }
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover block"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          ))}
        </Slider>
        <div className="absolute right-3 bottom-3 bg-[rgba(0,0,0,0.5)] text-white text-xs px-3 py-[2px] rounded-md">
          {`${curImageIndex + 1} / ${photos.length}`}
        </div>
      </div>
    </div>
  );
};

const DetailSkeletons = ({
  imageUrl,
}: {
  imageUrl?: string | null | undefined;
}) => {
  return (
    <div className="overflow-hidden">
      {!imageUrl && <Skeleton className="w-full h-72" />}

      <Section className="flex flex-wrap gap-2 pt-2 pb-0">
        <div className="flex gap-2">
          <Skeleton className="w-24 h-7 rounded-full" />
          <Skeleton className="w-24 h-7 rounded-full" />
        </div>
      </Section>
      <Section className="pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-5/6 h-7" />
          <Skeleton className="w-32 h-4 mb-1" />
          <div className="flex justify-between mb-4">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div>
            <Skeleton className="w-full h-16" />
          </div>
        </div>
      </Section>
      <div className="w-gull h-4 bg-grey-light dark:bg-[#111]" />
      <Section>
        <Skeleton className="w-full h-48 rounded-lg" />
      </Section>
    </div>
  );
};

const MarkerDetailBadge = ({ children }: React.PropsWithChildren) => {
  return (
    <Badge
      className="bg-white dark:bg-black border-primary font-bold flex items-center justify-center gap-2"
      variant="outline"
    >
      {children}
    </Badge>
  );
};

const MarkerDetailImages = ({
  images,
  onImageClick,
}: {
  images?: Photo[];
  onImageClick: (index: number) => void;
}) => {
  if (!images) {
    return <NotFoundImage text="우와, 사진이 하나도 없네요 ㅠㅠ" />;
  }
  return (
    <div className="flex">
      <div className="w-1/2 mr-1">
        {images.map((image, index) => {
          if (index % 2 === 1) return;
          return (
            <button
              key={image.photoId}
              className="relative w-full mb-2"
              onClick={() => onImageClick(index)}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.photoUrl}`}
                width={300}
                height={300}
                alt="상세"
                className="rounded-md object-cover"
              />
            </button>
          );
        })}
      </div>
      <div className="w-1/2 ml-1">
        {images.map((image, index) => {
          if (index % 2 !== 1) return;
          return (
            <button
              key={image.photoId}
              className="relative w-full mb-2"
              onClick={() => onImageClick(index)}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image.photoUrl}`}
                width={300}
                height={300}
                alt="상세"
                className="rounded-md object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ShareModal = ({
  location,
  address,
  id,
}: {
  address: string;
  id: number;
  location: { lat: number; lng: number };
}) => {
  const { mutate: downloadPdf, isPending } = useDownloadPdf();
  const { copyToClipboard } = useClipboard();

  return (
    <BottomSheet title="공유" id="share" className="pb-10">
      <div
        role="button"
        className="p-3 flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
        onClick={() => copyToClipboard(address)}
      >
        <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
          <BsCopy size={22} />
        </span>
        <span>주소 복사</span>
      </div>
      <div
        role="button"
        className="p-3 flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
        onClick={() => copyToClipboard(`https://m.k-pullup.com/pullup/${id}`)}
      >
        <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
          <BsCopy size={22} />
        </span>
        <span>링크 복사</span>
      </div>
      <div
        role="button"
        className="p-3 flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
        onClick={() => {
          if (isPending) return;
          downloadPdf(location);
        }}
      >
        <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
          <BsCloudDownload size={22} />
        </span>
        <span>PDF 저장</span>
        {isPending && (
          <span className="ml-3">
            <Loading size="sm" />
          </span>
        )}
      </div>
    </BottomSheet>
  );
};

const MarkerComments = ({
  markerId,
  user,
}: {
  markerId: number;
  user: UserInfo | null;
}) => {
  const { copyToClipboard } = useClipboard();
  const { show } = useBottomSheetStore();
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteComments(markerId);

  const {
    mutate: deleteComment,
    isError: isDeleteError,
    error: deleteError,
    isPending,
  } = useDeleteComment(markerId);

  const isRefreshing =
    Boolean(data) && isFetching && !isFetchingNextPage && !isLoading;

  let loadingShown = false;

  useEffect(() => {
    if (!isDeleteError) return;
    if (deleteError?.message === "404") {
      toast("접근 권한이 없습니다. 잠시 후 다시 시도해주세요.");
    } else {
      toast("잠시 후 다시 시도해주세요.");
    }
  }, [isDeleteError, deleteError]);

  if (isLoading) {
    return (
      <Section title="리뷰" className="pb-20">
        <Skeleton className="w-full h-24" />
      </Section>
    );
  }

  if (!data || data.pages.flatMap((page) => page.comments).length === 0) {
    return (
      <Section title="리뷰" className="pb-20">
        <div className="flex flex-col items-center justify-center">
          <NotFoundImage text="우와, 리뷰가 하나도 없네요 ㅠㅠ" />
          <button
            className="underline text-sm active:text-primary"
            onClick={() => show("review")}
          >
            리뷰 작성하기
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section
      title="리뷰"
      className="pb-20"
      subTitle="리뷰 작성하기"
      subTitleClick={() => show("review")}
    >
      <div>
        {data.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.comments.map((comment, index) => {
              if (comment.username === "k-pullup") {
                return (
                  <div
                    key={comment.commentId}
                    className="bg-white text-sm dark:bg-black-light shadow-full p-4 rounded-md flex justify-between items-center mb-2"
                  >
                    <div>
                      <div className="font-bold">{comment.commentText}</div>
                      <div className="text-xs text-grey">
                        {formatDate(comment.postedAt)}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span>{comment.username}</span>
                      {user?.chulbong && (
                        <span>
                          <Button
                            className="bg-white dark:bg-black"
                            icon={<BsThreeDots color="#777" />}
                            appearance="borderless"
                            onClick={() => show(`option-${comment.commentId}`)}
                            clickAction
                          />
                        </span>
                      )}
                    </div>

                    <MarkerCommentsOption
                      id={comment.commentId}
                      isOwner={
                        user?.chulbong || user?.userId === comment.userId
                      }
                      deleteComment={() => {
                        deleteComment(comment.commentId);
                      }}
                      copyComment={() => copyToClipboard(comment.commentText)}
                      isLoading={isPending}
                    />
                  </div>
                );
              } else {
                const showLoading = !loadingShown && isRefreshing;
                if (showLoading) {
                  loadingShown = true;
                }
                return (
                  <div
                    key={comment.commentId}
                    className={cn(
                      "p-3 text-sm",
                      (index !== page.comments.length - 1 ||
                        page.comments.length === 1) &&
                        "border-b border-solid border-grey-light dark:border-grey-dark"
                    )}
                  >
                    {showLoading && (
                      <div className="flex items-center justify-center">
                        <Loading />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="font-bold">{comment.username}</div>
                      <Button
                        className="bg-white dark:bg-black"
                        icon={<BsThreeDots color="#777" />}
                        appearance="borderless"
                        onClick={() => show(`option-${comment.commentId}`)}
                        clickAction
                      />
                    </div>
                    <div className="break-words">{comment.commentText}</div>
                    <div className="text-xs text-grey">
                      {formatDate(comment.postedAt)}
                    </div>

                    <MarkerCommentsOption
                      id={comment.commentId}
                      isOwner={
                        user?.chulbong || user?.userId === comment.userId
                      }
                      deleteComment={() => {
                        deleteComment(comment.commentId);
                      }}
                      isLoading={isPending}
                      copyComment={() => copyToClipboard(comment.commentText)}
                    />
                  </div>
                );
              }
            })}
          </Fragment>
        ))}
      </div>
      <div>
        {isFetchingNextPage && <Skeleton className="w-full h-20 my-4" />}
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-primary active:scale-90"
            clickAction
            fullWidth
          >
            더 보기
          </Button>
        )}
      </div>
    </Section>
  );
};

const MarkerCommentsForm = ({
  markerId,
  close,
  isLoggedIn,
  openSignin,
}: {
  markerId: number;
  close: VoidFunction;
  isLoggedIn: boolean;
  openSignin: VoidFunction;
}) => {
  const { toast } = useToast();
  const {
    mutate: addCommentMutation,
    error,
    isError,
    isPending,
  } = useAddComment(markerId);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isError) return;
    if (error?.message === "400") {
      toast("최대 3개까지 리뷰를 작성하실 수 있습니다.");
    } else {
      toast("잠시 후 다시 시도해주세요.");
    }
  }, [error, isError]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    if (inputValue.length <= 0) return;
    if (inputValue.trim() === "") return;
    addCommentMutation({ commentText: inputValue });
    setInputValue("");
    close();
  };

  return (
    <BottomSheet id="review" title="리뷰 작성" className="pb-10">
      {isLoggedIn ? (
        <div>
          <Textarea
            value={inputValue}
            onChnage={handleChange}
            maxLength={40}
            placeholder="다른 사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현은 주의해주세요."
            className="mb-4"
          />
          <div className="flex items-center">
            <Button
              className="w-3/4 bg-primary"
              onClick={handleClick}
              disabled={isPending}
              clickAction
            >
              등록하기
            </Button>
            <div className="grow" />
            <div className="mr-2">{inputValue.length}/40</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-5">먼저 로그인을 해주셔야 해요.</div>
          <Button
            className="bg-primary"
            onClick={() => {
              openSignin();
              close();
            }}
            fullWidth
            clickAction
          >
            로그인 하러 가기
          </Button>
        </div>
      )}
    </BottomSheet>
  );
};

const MarkerCommentsOption = ({
  id,
  isOwner,
  deleteComment,
  copyComment,
  isLoading,
}: {
  id: number;
  isOwner: boolean;
  deleteComment: VoidFunction;
  copyComment: VoidFunction;
  isLoading: boolean;
}) => {
  return (
    <BottomSheet title="공유" id={`option-${id}`} className="pb-10">
      <button
        className="p-3 w-full flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
        onClick={copyComment}
      >
        <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
          <BsCopy size={22} />
        </span>
        <span>리뷰 복사</span>
      </button>
      {isOwner && (
        <button
          className="p-3 w-full flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
          onClick={deleteComment}
          disabled={isLoading}
        >
          <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
            <BsTrash size={22} />
          </span>
          <span>삭제</span>
        </button>
      )}
    </BottomSheet>
  );
};

const IconButton = ({
  icon,
  disabled,
  onClick,
  children,
}: React.PropsWithChildren<{
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: VoidFunction;
}>) => {
  return (
    <Button
      className="flex flex-col gap-[6px] grow text-xs dark:bg-black dark:text-white p-0"
      icon={icon}
      appearance="borderless"
      onClick={onClick}
      disabled={disabled}
      clickAction
    >
      {children}
    </Button>
  );
};

const Map = ({
  lat,
  lng,
  id,
  withPin = true,
  type = "ROADMAP",
  setMap,
}: {
  lat?: number;
  lng?: number;
  id: string;
  type?: "ROADVIEW" | "ROADMAP";
  setMap?: React.Dispatch<React.SetStateAction<KakaoMap | null>>;
  withPin?: boolean;
}) => {
  const mapRef = useRef<KakaoMap>(null);

  useEffect(() => {
    if (!lat || !lng || mapRef.current) return;

    const mapContainer = document.getElementById(id);
    const centerPosition = new window.kakao.maps.LatLng(lat, lng);
    const mapOption = {
      center: centerPosition,
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    if (type === "ROADVIEW") {
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    } else {
      map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
    }

    if (setMap) setMap(map);

    if (withPin) {
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
    }

    mapRef.current = map;
  }, []);

  return <div id={id} className={cn("relative w-full h-full z-10")} />;
};

const RoadView = ({
  lat,
  lng,
  map,
  id,
  isView = true,
  close,
}: {
  lat?: number;
  lng?: number;
  map?: KakaoMap | null;
  id: string;
  isView?: boolean;
  close?: VoidFunction;
}) => {
  const { toast } = useToast();
  const roadviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roadviewRef.current || !map || !isView) return;
    map.setZoomable(false);

    const roadview = new window.kakao.maps.Roadview(roadviewRef.current);
    const roadviewClient = new window.kakao.maps.RoadviewClient();

    const position = new window.kakao.maps.LatLng(lat, lng);

    roadviewClient.getNearestPanoId(position, 50, (panoId: number) => {
      if (panoId === null) {
        toast("로드뷰가 지원되지 않는 위치입니다.");
        map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
        map.setZoomable(true);
        close?.();
      } else {
        roadview.setPanoId(panoId, position);
      }
    });

    let mapWalker: any = null;

    const handleViewpintChanged = () => {
      const viewpoint = roadview.getViewpoint();
      mapWalker.setAngle(viewpoint.pan);
    };

    const handlePositionChanged = () => {
      const position = roadview.getPosition();
      mapWalker.setPosition(position);
      map.setCenter(position);
    };

    const handleMapCenterChanged = () => {
      const position = map.getCenter();
      mapWalker.setPosition(position);
    };

    const handleMapDragend = () => {
      mapWalker.toggleRoadview();
    };

    const handleMapDragstart = () => {
      const position = map.getCenter();
      mapWalker.setPrevPosition(position);
    };

    const handleInit = () => {
      const rMarker = new window.kakao.maps.Marker({
        position: position,
        map: roadview,
      });

      const projection = roadview.getProjection();

      const viewpoint = projection.viewpointFromCoords(
        rMarker.getPosition(),
        rMarker.getAltitude()
      );
      roadview.setViewpoint(viewpoint);

      mapWalker = new MapWalker(position, map, roadview, roadviewClient);
      mapWalker.setMap();

      window.kakao.maps.event.addListener(
        roadview,
        "viewpoint_changed",
        handleViewpintChanged
      );

      window.kakao.maps.event.addListener(
        roadview,
        "position_changed",
        handlePositionChanged
      );

      window.kakao.maps.event.addListener(
        map,
        "center_changed",
        handleMapCenterChanged
      );

      window.kakao.maps.event.addListener(map, "dragend", handleMapDragend);
      window.kakao.maps.event.addListener(map, "dragstart", handleMapDragstart);
    };

    window.kakao.maps.event.addListener(roadview, "init", handleInit);

    return () => {
      window.kakao.maps.event.removeListener(roadview, "init", handleInit);
      window.kakao.maps.event.removeListener(
        roadview,
        "viewpoint_changed",
        handleViewpintChanged
      );

      window.kakao.maps.event.removeListener(
        roadview,
        "position_changed",
        handlePositionChanged
      );

      window.kakao.maps.event.removeListener(
        map,
        "center_changed",
        handleMapCenterChanged
      );

      window.kakao.maps.event.removeListener(map, "dragend", handleMapDragend);
      window.kakao.maps.event.removeListener(
        map,
        "dragstart",
        handleMapDragstart
      );
    };
  }, [map]);

  return (
    <div id={id} ref={roadviewRef} className="relative w-full h-full z-10" />
  );
};

const StarIcon = () => {
  return (
    <svg
      enableBackground="new 0 0 64 64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={18}
      height={18}
    >
      <g id="quality">
        <path
          d="M45.4,22.3l5.3-13c0.1-0.3,0.1-0.7-0.1-1l-0.4-0.5h-0.5l-13.5,3.6L25.9,2.3L25.5,2h-0.4c-0.6,0-1.1,0.5-1.1,1l-0.8,14l-11.7,7.3c-0.4,0.2-0.5,0.6-0.5,1l0.1,0.7l13.4,5.4L31,51.2c0.1,0.5,0.6,0.8,1,0.8s0.9-0.3,1-0.7l6.3-17l12.5,1.5l0.1,0c0.4,0,0.8-0.2,0.9-0.6l0.3-0.6L45.4,22.3z"
          className="fill-[#FFD54F]"
        />
        <g>
          <polygon
            points="38,13 35.7,13.7 33,11.3 41.5,32.6 46,33.1"
            className="fill-[#FFECB3]"
          />
          <polygon
            points="28.3,7.1 25.9,5 25.2,18.2 24.3,18.7 34,43 38,32.1 38.3,32.2"
            className="fill-[#FFE082]"
          />
        </g>
        <path
          d="M32.2,49.7l-1.7-5.1l1.1-0.4l0.7,2l1.3-3.6l1.1,0.4L32.2,49.7z M35.4,40.9l-1.1-0.4l3.5-9.4l4.7,0.6l-0.1,1.1l-3.8-0.5L35.4,40.9z M49.7,32.8l-1.2-2l1-0.6l1.2,2L49.7,32.8z M26.2,31.4L25.7,30l-13-5.2l1.5-0.9l0.3,0.4l12.2,4.9l0.6,1.9L26.2,31.4z M16.8,23.6l-0.6-1l7.8-4.9l0.6,1L16.8,23.6z M45.7,18.7l-1.1-0.4l3.5-8.5l1.1,0.4L45.7,18.7z M35.9,13.6l-2.1-1.9l0.8-0.9l1.7,1.5l10.6-2.8l0.3,1.1L35.9,13.6z M26.8,5.6L26.1,5l-0.6,0l0.1-2l2,1.8L26.8,5.6z"
          className="fill-[#FFCA28]"
        />
        <g>
          <rect
            x="21"
            y="50"
            width="22"
            height="5"
            className="fill-[#FF7043]"
          />
          <rect
            x="17"
            y="53"
            width="30"
            height="8"
            className="fill-[#B71C1C]"
          />
          <rect
            x="16"
            y="60"
            width="32"
            height="2"
            className="fill-[#3E2723]"
          />
          <rect
            x="25"
            y="53"
            width="14"
            height="6"
            className="fill-[#FFB300]"
          />
          <rect
            x="26"
            y="54"
            width="12"
            height="4"
            className="fill-[#FBE9E7]"
          />
        </g>
        <g>
          <path
            d="M16.8,49l-4.2-5.7c-1-3.1-1-6.3,0-9.3c0.1-0.3,0.4-0.6,0.8-0.7c0.4-0.1,0.7,0.1,1,0.3C17.8,37.9,18.8,43.8,16.8,49z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M11.4,41.1c-0.4-0.9-0.7-1.6-0.9-2.3c1.7-5.2,0.6-10.9-2.9-15c-0.2-0.2-0.5-0.3-0.7-0.3c-0.5,0-0.8,0.3-1,0.7c-1.6,5.3-0.1,11.1,3.7,15.1l0,0c0.2,0.7,0.5,1.4,0.9,2.3L11.4,41.1z"
            className="fill-[#FFCA28]"
          />
          <path
            d="M14.5,44c-0.8,0-1.5-0.9-1.5-2s0.7-2,1.5-2s1.5,0.9,1.5,2S15.3,44,14.5,44z"
            className="fill-[#FFB300]"
          />
          <path
            d="M7.8,39.4c-0.5,0-1.1-0.3-1.6-0.7c-0.4-0.4-0.6-0.8-0.7-1.2c-0.1-0.5,0-1,0.3-1.3c0.6-0.6,1.7-0.4,2.5,0.4c0.4,0.4,0.6,0.8,0.7,1.2c0.1,0.5,0,1-0.3,1.3C8.5,39.3,8.1,39.4,7.8,39.4z"
            className="fill-[#FFB300]"
          />
          <path
            d="M19,50.4c-0.7-0.5-1.5-1.1-2.3-1.9c-1.7-5.2-6-9.2-11.4-10.3c-0.4-0.1-0.8,0.1-1,0.4c-0.2,0.3-0.2,0.6-0.1,0.9c1.9,5.1,6.5,8.9,11.9,9.8c0.8,0.7,1.6,1.4,2.3,1.9L19,50.4z"
            className="fill-[#FFB300]"
          />
        </g>
        <g>
          <path
            d="M47.2,49l4.2-5.7c1-3.1,1-6.3,0-9.3c-0.1-0.3-0.4-0.6-0.8-0.7c-0.4-0.1-0.7,0.1-1,0.3C46.2,37.9,45.2,43.8,47.2,49z"
            className="fill-[#FFE082]"
          />
          <path
            d="M52.6,41.1c0.4-0.9,0.7-1.6,0.9-2.3c-1.7-5.2-0.6-10.9,2.9-15c0.2-0.2,0.5-0.3,0.7-0.3c0.5,0,0.8,0.3,1,0.7c1.6,5.3,0.1,11.1-3.7,15.1l0,0c-0.2,0.7-0.5,1.4-0.9,2.3L52.6,41.1z"
            className="fill-[#FFD54F]"
          />
          <path
            d="M48,42c0-1.1,0.7-2,1.5-2s1.5,0.9,1.5,2s-0.7,2-1.5,2S48,43.1,48,42z"
            className="fill-[#FFB300]"
          />
          <path
            d="M55.3,39c-0.3-0.3-0.4-0.8-0.3-1.3c0.1-0.4,0.3-0.9,0.7-1.2c0.8-0.8,1.9-0.9,2.5-0.4c0.3,0.3,0.4,0.8,0.3,1.3c-0.1,0.4-0.3,0.9-0.7,1.2c-0.5,0.5-1,0.7-1.6,0.7C55.9,39.4,55.5,39.3,55.3,39z"
            className="fill-[#FFB300]"
          />
          <path
            d="M45,50.4c0.7-0.5,1.5-1.1,2.3-1.9c1.7-5.2,6-9.2,11.4-10.3c0.4-0.1,0.8,0.1,1,0.4c0.2,0.3,0.2,0.6,0.1,0.9c-1.9,5.1-6.5,8.9-11.9,9.8c-0.8,0.7-1.6,1.4-2.3,1.9L45,50.4z"
            className="fill-[#FFCA28]"
          />
        </g>
      </g>
    </svg>
  );
};

const ImageDetail = ({
  os = "Windows",
  close,
  curImageIndex,
  images,
  className,
}: {
  os?: string;
  close: VoidFunction;
  images?: Photo[];
  curImageIndex: number;
  className?: React.ComponentProps<"div">["className"];
}) => {
  const [imageIndex, setImageIndex] = useState(curImageIndex);

  const slideSettings = {
    accessibility: false,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    autoplay: false,
    autoplaySpeed: 3000,
    initialSlide: curImageIndex,
    afterChange: (index: number) => setImageIndex(index),
  };

  if (!images) return;

  return (
    <SwipeClosePage
      os={os}
      close={close}
      className={cn("bg-black flex flex-col", className)}
      headerTitle={`${imageIndex + 1}/${images.length}`}
      headerStyleClass="bg-black text-white"
    >
      <div className="grow h-full overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            <Slider {...slideSettings}>
              {images.map((item, index) => (
                <div
                  key={item.photoId}
                  className="w-full h-[calc(100dvh-50px)] focus:outline-none"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.photoUrl}`}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-contain block"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </SwipeClosePage>
  );
};

export default MarkerDetail;
