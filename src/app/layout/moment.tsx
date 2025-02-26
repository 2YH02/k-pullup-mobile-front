import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";

interface MomentProps {
  close: VoidFunction;
  className?: React.ComponentProps<"div">["className"];
}
const Moment = ({ close, className }: MomentProps) => {
  return (
    <SwipeClosePage
      close={close}
      className={className}
      slideType="horizontal"
      headerTitle="모먼트"
    >
      <div>모먼트 페이지</div>
    </SwipeClosePage>
  );
};

export default Moment;
