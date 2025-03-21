import { type RankingMarker } from "@/api/marker";
import Skeleton from "@/components/skeleton/skeleton";
import { useAreaMarkerRanking } from "@/hooks/api/marker/use-area-marker-ranking";
import { useMarkerRanking } from "@/hooks/api/marker/use-marker-ranking";
import PinIcon from "@/icons/pin-icon";
import { useGpsStore } from "@/store/use-gps-store";
import { useViewDetailStore } from "@/store/use-view-detail-store";
import cn from "@/utils/cn";
import { useState } from "react";

const MarkerRankingList = () => {
  const { location } = useGpsStore();

  const [rankingType, setRankingType] = useState<"all" | "around">("all");

  const { data: allRanking, isLoading: isAllRankingLoading } =
    useMarkerRanking();

  const { data: aroundRanking, isLoading: isAroundRankingLoading } =
    useAreaMarkerRanking({
      latitude: location?.lat as number,
      longitude: location?.lng as number,
      enabled: rankingType === "around" && !!location,
    });

  return (
    <div>
      {/* 랭킹 타입 버튼 */}
      <div className="flex gap-2 text-sm text-grey-dark dark:text-grey mb-2">
        <button
          className={cn("underline", rankingType === "all" && "text-primary")}
          onClick={() => setRankingType("all")}
        >
          전체
        </button>
        <button
          className={cn(
            "underline",
            rankingType === "around" && "text-primary"
          )}
          onClick={() => setRankingType("around")}
        >
          내 주변
        </button>
      </div>

      {/* 모든 랭킹 */}
      {rankingType === "all" && (
        <List data={allRanking} isLoading={isAllRankingLoading} />
      )}

      {rankingType === "around" && (
        <List data={aroundRanking} isLoading={isAroundRankingLoading} />
      )}
    </div>
  );
};

const List = ({
  data,
  isLoading,
}: {
  data?: RankingMarker[];
  isLoading: boolean;
}) => {
  const { show } = useViewDetailStore();
  const [visibleCount, setVisibleCount] = useState(10);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <div>랭킹에 등록되어 있는 철봉이 없습니다.</div>
      </div>
    );
  }

  const hasMore = visibleCount < data.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, data.length));
  };

  const resetList = () => {
    setVisibleCount(10);
  };

  return (
    <div>
      {data.slice(0, visibleCount).map((item, index) => {
        return (
          <button
            key={item.markerId}
            className="flex items-center mb-1 p-2 text-left active:bg-grey-light dark:active:bg-grey-dark w-full rounded-md"
            onClick={() => show(item.markerId)}
          >
            <div className="shrink-0 font-bold mr-2 w-7">{index + 1}</div>
            <div className="grow text-sm">{item.address}</div>
            <div className="shrink-0">
              <PinIcon />
            </div>
          </button>
        );
      })}
      <div className="flex justify-center gap-3">
        {hasMore && (
          <button
            onClick={loadMore}
            className="underline text-sm text-grey-dark dark:text-grey"
          >
            더보기
          </button>
        )}
        {visibleCount > 10 && (
          <button
            onClick={resetList}
            className="underline text-sm text-grey-dark dark:text-grey"
          >
            접기
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkerRankingList;
