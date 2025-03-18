import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";

interface ChattingProps {
  close?: VoidFunction;
  os?: string;
}
const Chatting = ({ os = "Windows", close }: ChattingProps) => {
  return (
    <SwipeClosePage os={os} close={close}>
      Chatting
    </SwipeClosePage>
  );
};

export default Chatting;
