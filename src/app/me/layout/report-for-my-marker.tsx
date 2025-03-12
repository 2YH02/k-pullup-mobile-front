import { type ReportMarker } from "@/api/user";
import { Button } from "@/components/button/button";
import Carousel, {
  SlideContainer,
  SlideItem,
} from "@/components/carousel/carousel";
import Loading from "@/components/loading/loading";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useApproveReport } from "@/hooks/api/report/use-approve-report";
import { useDeleteReport } from "@/hooks/api/report/use-delete-report";
import { useDenyReport } from "@/hooks/api/report/use-deny-report";
import { useReportForMyMarker } from "@/hooks/api/user/use-report-for-my-marker";
import cn from "@/utils/cn";
import Image from "next/image";
import { BsChevronRight } from "react-icons/bs";
import {
  getReportStatusColor,
  getReportStatusText,
} from "./my-report-location";

interface ReportForMyMarkerProps {
  os?: string;
  close?: VoidFunction;
  openDetail: (id: number) => void;
}

const ReportForMyMarker = ({
  os = "Windows",
  close,
  openDetail,
}: ReportForMyMarkerProps) => {
  const { data, isLoading, error } = useReportForMyMarker();
  
  if (isLoading) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="받은 수정 요청 목록"
        slideType="horizontal"
      >
        <Section>
          <Skeleton className="w-full h-44" />
        </Section>
      </SwipeClosePage>
    );
  }

  if (!data || data.markers.length <= 0 || error?.message === "404") {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="받은 수정 요청 목록"
        slideType="horizontal"
      >
        <div className="mt-12">
          <NotFoundImage text="받은 요청이 없습니다." size="lg" />
        </div>
      </SwipeClosePage>
    );
  }

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="받은 수정 요청 목록"
      slideType="horizontal"
    >
      {data.markers.map((marker) => {
        return (
          <Section key={marker.markerID}>
            <button
              className="w-full flex items-center"
              onClick={() => openDetail(marker.markerID)}
            >
              <span className="text-lg max-w-[90%] font-bold shrink-0 break-words">
                {marker.address}
              </span>
              <div className="grow" />
              <span className="shrink-0">
                <BsChevronRight className="text-grey-dark dark:text-grey" />
              </span>
            </button>
            <Carousel className="py-3">
              <SlideContainer>
                {marker.reports.map((report) => {
                  return (
                    <SlideItem key={report.reportID}>
                      <ListItem data={report} markerId={marker.markerID} />
                    </SlideItem>
                  );
                })}
              </SlideContainer>
            </Carousel>
          </Section>
        );
      })}
    </SwipeClosePage>
  );
};

const ListItem = ({
  data,
  markerId,
}: {
  data: ReportMarker;
  markerId: number;
}) => {
  const { mutate: approve, isPending: approveLoading } =
    useApproveReport(markerId);
  const { mutate: deny, isPending: denyLoading } = useDenyReport();
  const { mutate: deleteReport, isPending: deleteLoading } = useDeleteReport();

  return (
    <div className="w-full h-full">
      <div className="mb-3">
        <div className="flex items-center">
          <span className="font-bold grow">설명</span>
          <span className="text-sm shrink-0 flex items-center">
            <span
              className={cn(
                "rounded-full w-2 h-2 mr-1",
                getReportStatusColor(data.status)
              )}
            />
            <span>{getReportStatusText(data.status)}</span>
          </span>
        </div>

        <span className="text-sm break-words">{data.description}</span>
      </div>

      {data.photos.length > 0 && (
        <div className="mb-3">
          <div className="font-bold grow">이미지</div>

          <div className="flex gap-2 flex-wrap">
            {data.photos.map((image, index) => {
              return (
                <div
                  key={`${image} ${index}`}
                  className="relative w-32 h-32 rounded-md overflow-hidden"
                >
                  <Image
                    src={image}
                    alt="report"
                    className="object-cover"
                    draggable={false}
                    fill
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        {data.status === "PENDING" ? (
          <div className="flex gap-3">
            <Button
              className="border-primary dark:bg-transparent dark:text-white w-1/2 h-10 flex items-center justify-center"
              appearance="outlined"
              onClick={() => deny(data.reportID)}
              disabled={denyLoading}
              clickAction
            >
              {denyLoading ? (
                <Loading className="text-primary" size="sm" />
              ) : (
                "거절"
              )}
            </Button>
            <Button
              className="bg-primary dark:bg-primary w-1/2 h-10 flex items-center justify-center"
              onClick={() => approve(data.reportID)}
              disabled={approveLoading}
              clickAction
            >
              {approveLoading ? (
                <Loading className="text-white" size="sm" />
              ) : (
                "승인"
              )}
            </Button>
          </div>
        ) : (
          <Button
            className="bg-primary h-10 flex items-center justify-center"
            onClick={() =>
              deleteReport({ markerId: markerId, reportId: data.reportID })
            }
            disabled={deleteLoading}
            clickAction
            fullWidth
          >
            {deleteLoading ? (
              <Loading className="text-white" size="sm" />
            ) : (
              "삭제"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportForMyMarker;
