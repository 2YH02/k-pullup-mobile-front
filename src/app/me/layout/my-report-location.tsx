"use client";

import { ReportsRes, ReportStatus } from "@/api/user";
import { Button } from "@/components/button/button";
import NotFoundImage from "@/components/not-found-image/not-found-image";
import Section from "@/components/section/section";
import Skeleton from "@/components/skeleton/skeleton";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import { useDeleteReport } from "@/hooks/api/report/use-delete-report";
import { useReportMarker } from "@/hooks/api/user/use-report-marker";
import cn from "@/utils/cn";
import Image from "next/image";

interface MyReportLocationProps {
  os?: string;
  close?: VoidFunction;
  openDetail: (id: number) => void;
}

const MyReportLocation = ({
  close,
  os = "Windows",
  openDetail,
}: MyReportLocationProps) => {
  const { data, isLoading } = useReportMarker();

  if (isLoading) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="내가 요청한 수정 목록"
        slideType="horizontal"
      >
        <Section>
          <Skeleton className="w-full h-44" />
        </Section>
      </SwipeClosePage>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SwipeClosePage
        os={os}
        close={close}
        headerTitle="내가 요청한 수정 목록"
        slideType="horizontal"
      >
        <div className="mt-12">
          <NotFoundImage text="요청한 장소가 없습니다." size="lg" />
        </div>
      </SwipeClosePage>
    );
  }

  return (
    <SwipeClosePage
      os={os}
      close={close}
      headerTitle="내가 요청한 수정 목록"
      slideType="horizontal"
    >
      <Section>
        {data.map((report) => {
          return (
            <ReportItem
              key={report.reportId}
              report={report}
              openDetail={openDetail}
            />
          );
        })}
      </Section>
    </SwipeClosePage>
  );
};

const ReportItem = ({
  report,
  openDetail,
}: {
  report: ReportsRes;
  openDetail: (id: number) => void;
}) => {
  const { mutate: deleteReport, isPending } = useDeleteReport();

  return (
    <div className="shadow-full p-4 rounded-md mb-5 flex flex-col gap-3">
      <div>
        <div className="flex items-center">
          <span className="font-bold grow">수정 요청 정보</span>
          <span className="text-sm shrink-0 flex items-center">
            <span
              className={cn(
                "rounded-full w-2 h-2 mr-1",
                getReportStatusColor(report.status)
              )}
            />
            <span>{getReportStatusText(report.status)}</span>
          </span>
        </div>
        <div className="text-sm">
          <span>주소: </span>
          <span className="break-words">{report.address}</span>
        </div>
        <div className="text-sm">
          <span>설명: </span>
          <span className="break-words">{report.description}</span>
        </div>
      </div>
      {report.photoUrls && (
        <div>
          <div className="font-bold">추가된 이미지</div>
          <div className="flex gap-2 flex-wrap">
            {report.photoUrls.map((url) => {
              return (
                <div key={url} className="relative w-28 h-28">
                  <Image src={url} fill alt="report" className="object-cover" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex gap-3">
          <Button
            className="border-primary dark:bg-transparent dark:text-white w-1/2"
            appearance="outlined"
            onClick={() =>
              deleteReport({
                markerId: report.markerId,
                reportId: report.reportId,
              })
            }
            disabled={isPending}
            clickAction
          >
            요청 삭제
          </Button>
          <Button
            className="bg-primary dark:bg-primary w-1/2"
            onClick={() => openDetail(report.markerId)}
            clickAction
          >
            위치 자세히 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getReportStatusText = (status: ReportStatus) => {
  if (status === "APPROVED") {
    return "승인됨";
  } else if (status === "DENIED") {
    return "거절됨";
  } else {
    return "대기중";
  }
};

export const getReportStatusColor = (status: ReportStatus) => {
  if (status === "APPROVED") {
    return "bg-green";
  } else if (status === "DENIED") {
    return "bg-red";
  } else {
    return "bg-grey";
  }
};

export default MyReportLocation;
