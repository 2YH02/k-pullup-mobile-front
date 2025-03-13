import { useMapStore } from "@/store/use-map-store";
import { Pos } from "@/types/kakao-map.types";

interface OverlayProps {
  title: string;
  position: Pos;
}

const Overlay = ({ title, position }: OverlayProps) => {
  const { map } = useMapStore();

  const handleClick = () => {
    if (!map) return;

    const level = map.getLevel();

    map.setLevel(level - 1, { anchor: position });
  };

  return (
    <div className="bg-white dark:bg-black absolute -bottom-3 -left-10 w-[80px] h-[55px] flex items-center justify-center rounded-[3rem]">
      <button className="w-full h-full" onClick={handleClick}>
        <div>{title}</div>
      </button>
    </div>
  );
};

export default Overlay;
