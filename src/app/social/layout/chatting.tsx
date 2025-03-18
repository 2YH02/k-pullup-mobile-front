"use client";

import { Button } from "@/components/button/button";
import Input from "@/components/input/input";
import SwipeClosePage from "@/components/swipe-close-page/swipe-close-page";
import WarningText from "@/components/warning-text/warning-text";
import useInput from "@/hooks/use-input";
import { useChatStore } from "@/store/use-chat-store";
import cn from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { BsArrowUp } from "react-icons/bs";

interface Message {
  uid: string;
  message: string;
  userId: string;
  userNickname: string;
  roomID: string;
  timestamp: number;
  isOwner?: boolean;
}

interface ChattingProps {
  close?: VoidFunction;
  os?: string;
}

const Chatting = ({ os = "Windows", close }: ChattingProps) => {
  const chatValue = useInput("");
  const { cid, code, title } = useChatStore();

  const ws = useRef<WebSocket | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [isConnectionError, setIsConnectionError] = useState(false);

  const [subTitle, setSubTitle] = useState("");

  useEffect(() => {
    ws.current?.close();

    if (!cid) return;

    ws.current = new WebSocket(
      `wss://api.k-pullup.com/ws/${code}?request-id=${cid}`
    );

    ws.current.onopen = () => {
      setMessages([]);
    };

    ws.current.onmessage = async (event) => {
      const data: Message = JSON.parse(event.data);
      if (data.userNickname === "chulbong-kr") {
        const titleArr = data.message.split(" ");
        const subTitle = `${titleArr[1]} ${titleArr[2]} ${titleArr[3]}`;
        setSubTitle(subTitle);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
        },
      ]);
    };

    ws.current.onerror = () => {
      setIsConnectionError(true);
    };

    ws.current.onclose = () => {
      setIsConnectionError(true);
    };

    return () => {
      ws.current?.close();
    };
  }, [cid, code]);

  useEffect(() => {
    if (!ws) return;
    const pingInterval = setInterval(() => {
      ws.current?.send(JSON.stringify({ type: "ping" }));
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, []);

  useEffect(() => {
    const scrollBox = chatBox.current;

    if (scrollBox) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  }, [messages]);

  const handleChat = () => {
    if (chatValue.value === "") return;
    ws.current?.send(chatValue.value);
    chatValue.resetValue();
    inputRef.current?.focus();
  };

  if (!cid) return null;

  return (
    <SwipeClosePage os={os} close={close} headerTitle={`${title} ${subTitle}`}>
      {isConnectionError ? (
        <div className="mt-14 text-center">
          <div className="text-2xl font-bold mb-1">연결 실패</div>
          <div className="text-grey text-sm">채팅방 입장에 실패하였습니다.</div>
          <div className="text-grey text-sm">잠시 후 다시 접속해주세요.</div>
        </div>
      ) : (
        <>
          <div
            ref={chatBox}
            className={cn(
              "p-4 overflow-auto overflow-x-hidden",
              os === "iOS" ? "h-[calc(90%-86px)]" : "h-[calc(92%-50px)]"
            )}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {messages.map((message) => {
              return (
                <MessageBubble
                  key={`${message.timestamp} ${message.message}`}
                  message={message}
                  cid={cid}
                />
              );
            })}
          </div>

          <div
            className={cn(
              "shrink-0 px-4 flex gap-4 items-center",
              os === "iOS" ? "pb-6 h-[10%]" : "h-[8%]"
            )}
          >
            <div className="grow">
              <Input
                type="text"
                className="h-9 bg-[#f1f1f1] dark:bg-black-light border-none"
                value={chatValue.value}
                onChange={chatValue.onChange}
                placeholder="메시지를 입력해 주세요."
              />
            </div>
            <div>
              <Button
                className="bg-primary rounded-full dark:bg-primary"
                icon={<BsArrowUp />}
                onClick={handleChat}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChat();
                  }
                }}
                clickAction
              />
            </div>
          </div>
        </>
      )}
    </SwipeClosePage>
  );
};

const MessageBubble = ({ message, cid }: { message: Message; cid: string }) => {
  if (message.userNickname === "chulbong-kr") return;
  if (message.message?.includes("님이 입장하셨습니다.")) {
    return (
      <div className="shrink-0 truncate px-5 py-2 text-center text-sm text-grey-dark p-2">
        <div className="text-grey text-xs">
          {message.userNickname}님이 참여하였습니다.
        </div>
      </div>
    );
  }
  if (message.message?.includes("님이 퇴장하셨습니다.")) {
    return (
      <div className="shrink-0 truncate px-5 py-2 text-center text-sm text-grey-dark p-2">
        <div className="text-grey text-sm">
          {message.userNickname}님이 나가셨습니다.
        </div>
      </div>
    );
  }

  if (message.message?.includes("공지:")) {
    return (
      <WarningText className="justify-center p-2">
        {message.message}
      </WarningText>
    );
  }
  return (
    <>
      {message.userId === cid ? (
        <div className="flex flex-col items-end w-full p-2">
          <div className="max-w-[90%] px-5 py-1 flex items-center justify-start rounded-3xl bg-primary dark:bg-primary-dark shadow-sm">
            <div className="text-white text-sm">{message.message}</div>
          </div>
          <div className="text-xs">
            <div className="text-xs mt-[2px]">{message.userNickname}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start w-full p-2">
          <div className="max-w-[90%] px-5 py-1 flex items-center justify-start rounded-3xl bg-grey-light text-black-light dark:bg-grey dark:text-white shadow-sm">
            <div className="text-sm">{message.message}</div>
          </div>
          <div className="text-xs">
            <div className="text-xs mt-[2px]">{message.userNickname}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatting;
