import { Button } from "@/components/button/button";
import Divider from "@/components/divider/divider";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import cn from "@/utils/cn";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import { BsHeart, BsTrash3, BsUpload } from "react-icons/bs";

type Post = {
  photoURL: string;
  username: string;
  createdAt: string;
  caption: string;
  thumbsDown: number;
  thumbsUp: number;
};

const postsMockData: Post[] = [
  {
    photoURL: "/metaimg.webp",
    username: "user1",
    createdAt: "2025-02-26T12:00:00Z",
    caption: "오늘도 좋은 하루!",
    thumbsDown: 3,
    thumbsUp: 15,
  },
  {
    photoURL: "/metaimg.webp",
    username: "user2",
    createdAt: "2025-02-25T08:30:00Z",
    caption: "커피 한 잔의 여유 ☕",
    thumbsDown: 1,
    thumbsUp: 20,
  },
  {
    photoURL: "/metaimg.webp",
    username: "user3",
    createdAt: "2025-02-24T18:45:00Z",
    caption: "운동 끝! 땀 뺐다 💪",
    thumbsDown: 5,
    thumbsUp: 30,
  },
  {
    photoURL: "/metaimg.webp",
    username: "user4",
    createdAt: "2025-02-23T14:10:00Z",
    caption: "새로운 프로젝트 시작!",
    thumbsDown: 2,
    thumbsUp: 18,
  },
  {
    photoURL: "/metaimg.webp",
    username: "user5",
    createdAt: "2025-02-22T21:00:00Z",
    caption: "영화 추천 좀 해줘요 🎬",
    thumbsDown: 4,
    thumbsUp: 12,
  },
];

interface MomentProps {
  close: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}
const Moment = ({ close, className }: MomentProps) => {
  return (
    <SwipeClosePage
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
      iconClick={() => {}}
    >
      {postsMockData.map((v, i) => {
        return (
          <div key={i}>
            <MomentItem data={v} />
            {i !== postsMockData.length - 1 && <Divider />}
          </div>
        );
      })}
    </SwipeClosePage>
  );
};

const MomentItem = ({ data }: { data: Post }) => {
  return (
    <div className="mb-2">
      <div className="px-4 py-2 flex items-center justify-between">
        <div>
          <div className="font-bold">{data.username}</div>
          <div className="text-xs text-grey">{formatDate(data.createdAt)}</div>
        </div>
        <Button
          appearance="borderless"
          icon={<BsTrash3 color="#777" />}
          clickAction
        />
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
      <button className="px-4 py-2 flex items-center text-sm">
        <span className="mr-2">
          <BsHeart size={12} fill="#ee2f2f" />
          {/* <BsHeartFill size={12} fill="#ee2f2f" /> */}
        </span>
        <span className="mr-1 text-grey-dark">좋아요</span>
        <span className="font-bold">{data.thumbsUp}</span>
      </button>
    </div>
  );
};

export default Moment;
