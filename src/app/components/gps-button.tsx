import { Button } from "@/components/button/button";
import { BsCrosshair } from "react-icons/bs";

const GpsButton = () => {
  return (
    <Button
      className="bg-white text-primary-dark border border-solid border-[#eee] dark:border-grey-dark dark:bg-black dark:text-primary-dark"
      icon={<BsCrosshair />}
      clickAction
    />
  );
};

export default GpsButton;
