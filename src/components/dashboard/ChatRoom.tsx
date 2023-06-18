import React, { FormEvent, useRef, useState } from "react";
import Input from "../styled/Input";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createMessage } from "@/services/chatService";
import { v4 as uuidv4 } from "uuid";
import { RealtimeChannel } from "@supabase/supabase-js";

let scrolledDiv: HTMLElement | null;

const ChatRoom = ({
  senderInfo,
  messageList,
  channel,
}: {
  senderInfo: Sender;
  messageList: MessageType[];
  channel: RealtimeChannel;
}) => {
  const {
    query: { roomId, senderId },
  } = useRouter();
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const scrollNumber = Math.floor(window.screen.availHeight / 65);
  const [extraNumber, setExtraNumber] = useState(scrollNumber);
  const initialMessages =
    messageList.length < extraNumber
      ? messageList
      : messageList.slice(messageList.length - extraNumber, messageList.length);
  const [messages, setMessages] = useState<MessageType[]>(
    initialMessages ?? []
  );
  const [value, setValue] = useState("");

  const resizeHandler = () => {
    setExtraNumber((prev) =>
      prev !== Math.floor(window.screen.availHeight / 65)
        ? Math.floor(window.screen.availHeight / 65)
        : prev
    );
  };
  useEffect(() => {
    scrolledDiv = null;
    window.onresize = null;
    if (roomId) {
      setIsAutoScroll(true);
      scrolledDiv = document.getElementById("scrolledDiv");
      window.onresize = resizeHandler;
      setExtraNumber(scrollNumber);
    }
    return () => {
      scrolledDiv = null;
      window.onresize = null;
    };
  }, [roomId, scrollNumber]);

  useEffect(() => {
    setMessages(
      messageList.length < extraNumber
        ? messageList
        : messageList.slice(
            messageList.length - extraNumber,
            messageList.length
          )
    );
  }, [extraNumber, messageList]);
  useEffect(() => {
    if (channel) {
      channel?.on("broadcast", { event: "message" }, (payload: any) => {
        return setMessages((prev) => prev.concat([payload.payload]));
      });
      console.log("listen to channel", channel.topic);
    }
    //TODO: we need to checkout message count if sended and received count is different, have to catch up lost messages
  }, [channel]);

  useEffect(() => {
    if (scrolledDiv && isAutoScroll) {
      scrolledDiv.scrollTo(0, scrolledDiv.scrollHeight);
      console.log("scroll changed");
    }
  }, [isAutoScroll, messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!senderInfo?.name || !senderId || !roomId || value?.trim() === "")
      return;
    setIsAutoScroll(true);
    const tempMessageId = uuidv4();
    channel?.send({
      type: "broadcast",
      event: "message",
      payload: { text: value, senderName: senderInfo?.name, id: tempMessageId },
    });
    setMessages((prev) => [
      ...prev,
      { text: value, senderName: senderInfo?.name, id: tempMessageId },
    ]);
    setValue("");
    await createMessage(
      tempMessageId,
      senderId?.toString(),
      senderInfo.name,
      roomId?.toString(),
      value
    );
  };
  const handleShowOldMessages = () => {
    if (messageList.length > extraNumber + scrollNumber) {
      setExtraNumber((prev) => prev + scrollNumber);
    } else setExtraNumber(messageList.length);
    setIsAutoScroll(false);
  };

  return (
    <div
      id="chat-room"
      className="w-full flex-col flex justify-end p-2 overflow-hidden"
    >
      <div id="scrolledDiv" className="overflow-y-auto flex flex-col mb-3 p-1">
        <div>
          {messageList.length > extraNumber ? (
            <div className="divider p-0 m-0">
              <button
                className="btn btn-link"
                type="button"
                onClick={handleShowOldMessages}
              >
                show older messages
              </button>
            </div>
          ) : null}
        </div>
        {messages.map((message, index) => (
          <div key={message.id}>
            {index === 0 ? (
              <div className="divider p-0 m-0 text-ellipsis">
                {message.senderName === senderInfo.name
                  ? "You"
                  : message.senderName}
              </div>
            ) : messages[index - 1].senderName !== message.senderName ? (
              <div className="divider p-0 m-0">
                {message.senderName === senderInfo.name
                  ? "You"
                  : message.senderName}
              </div>
            ) : null}

            <div
              className={`chat ${
                message.senderName === senderInfo.name
                  ? "chat-end"
                  : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble font-semibold ${
                  message.senderName === senderInfo.name
                    ? "chat-bubble-info"
                    : "chat-bubble-secondary"
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-control w-full gap-2">
            <div className="join justify-end">
              <Input
                className="join-item"
                type="text"
                placeholder="Enter your message"
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
              />
              <button className="btn btn-primary join-item" type="submit">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
