import React, { FormEvent, useRef, useState } from "react";
import Input from "../styled/Input";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createMessage } from "@/services/chatService";
import { v4 as uuidv4 } from "uuid";
import { RealtimeChannel } from "@supabase/supabase-js";
import { VList, VListHandle } from "virtua";

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
  const [messages, setMessages] = useState<MessageType[]>(messageList ?? []);
  const [value, setValue] = useState("");
  const ref = useRef<VListHandle>(null);

  useEffect(() => {
    if (roomId) setMessages(messageList);
    ref.current?.scrollToIndex(messageList.length);
  }, [roomId, setMessages, messageList]);

  useEffect(() => {
    if (messages.length > messageList.length)
      ref.current?.scrollToIndex(messages.length);
  }, [messageList.length, messages.length]);
  useEffect(() => {
    if (channel) {
      channel?.on("broadcast", { event: "message" }, (payload: any) => {
        return setMessages((prev) => prev.concat([payload.payload]));
      });
      console.log("listen to channel", channel.topic);
    }
    //TODO: we need to checkout message count if sended and received count is different, have to catch up lost messages
  }, [channel]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!senderInfo?.name || !senderId || !roomId || value?.trim() === "")
      return;
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
  return (
    <div id="chat-room" className="w-full flex-col flex p-2 gap-2">
      <VList ref={ref} className="w-full" mode="reverse">
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
      </VList>
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
