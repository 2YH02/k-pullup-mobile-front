import HorizontalScroll from "@/components/horizontal-scroll/horizontal-scroll";
import { useChatStore } from "@/store/use-chat-store";

const chatData = [
  { location: "서울", icon: "🏙️", message: "서울 핫플 어디야?🔥" },
  { location: "경기", icon: "🏡", message: "근교 드라이브 갈 사람? 🚗" },
  { location: "인천", icon: "🌊", message: "월미도 회 먹으러 갈까?🐟" },
  { location: "부산", icon: "🌅", message: "광안리 야경 보러 갈래?✨" },
  { location: "대전", icon: "🚆", message: "성심당 빵 먹으러 가자!🥐" },
  { location: "제주도", icon: "🏝️", message: "오늘 제주 날씨 어때?☀️" },
  { location: "충남", icon: "⛵", message: "대천해수욕장 가본 사람?🏖️" },
  { location: "충북", icon: "🍇", message: "와인 마시러 충북 가볼까?🍷" },
  { location: "전남", icon: "🍜", message: "순천에서 먹을 거 추천!🤤" },
  { location: "전북", icon: "🏯", message: "전주 한옥마을 가고 싶다!🏡" },
  { location: "경남", icon: "🌉", message: "창원 가볼 만한 곳?🎡" },
  { location: "경북", icon: "⛰️", message: "경주 불국사 어떰?🕌" },
  { location: "대구", icon: "🔥", message: "대프리카 너무 덥다...🥵" },
  { location: "강원", icon: "⛷️", message: "강릉에서 커피 한 잔?☕" },
  { location: "울산", icon: "🐋", message: "고래 보고 싶다!🐳" },
];

const LocalChatList = () => {
  const { show } = useChatStore();

  const handleClick = () => {
    show();
  };
  
  return (
    <HorizontalScroll className="gap-4 py-1 px-1">
      {chatData.map((v) => {
        return (
          <button
            key={v.location}
            onClick={handleClick}
            className="text-left flex flex-col shrink-0 w-32 h-32 p-2 rounded-md shadow-full dark:border dark:border-solid dark:border-black-light"
          >
            <div className="font-bold">{v.location} 채팅방</div>
            <div className="mt-2 text-sm text-grey-dark dark:text-grey">
              {v.message}
            </div>
          </button>
        );
      })}
    </HorizontalScroll>
  );
};

export default LocalChatList;
