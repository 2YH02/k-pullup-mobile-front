import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { Button } from "../button/button";

interface NumberInputProps {
  value?: number;
  increase?: VoidFunction;
  decrease?: VoidFunction;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberInput = ({
  value = 0,
  increase,
  decrease,
  onChange,
}: NumberInputProps) => {
  return (
    <div className="flex items-center">
      <Button
        className="bg-primary rounded-full p-[6px] text-white"
        icon={<BsDashLg />}
        appearance="borderless"
        onClick={decrease}
        clickAction
      />
      <input
        type="number"
        className="px-1 mx-1 w-16 outline-primary text-center bg-transparent"
        value={value}
        onChange={onChange}
        min={0}
        max={100}
      />
      <Button
        className="bg-primary rounded-full p-[6px] text-white"
        icon={<BsPlusLg />}
        appearance="borderless"
        onClick={increase}
        clickAction
      />
    </div>
  );
};

export default NumberInput;
