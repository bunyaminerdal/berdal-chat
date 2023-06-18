import Dashboard from "@/components/dashboard";
import ChatRoom from "@/components/dashboard/ChatRoom";
import useMessagesByRoomId from "@/hooks/useMessagesByRoomId";
import useSenderById from "@/hooks/useSenderById";
import { supabase } from "@lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
export let channel: RealtimeChannel | null;
const RoomPage = () => {
  const {
    query: { roomId, senderId },
  } = useRouter();
  const { data: messageList } = useMessagesByRoomId(roomId?.toString());
  const { data: senderInfo } = useSenderById(senderId?.toString());

  useEffect(() => {
    if (channel) {
      channel.unsubscribe();
      channel = null;
    }
    channel =
      roomId && senderInfo?.data?.name
        ? supabase
            .channel(roomId?.toString(), {
              config: {
                presence: {
                  key: senderInfo.data.name,
                },
              },
            })
            .subscribe()
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
              console.log("Joined", key, newPresences);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
              console.log("left", key, leftPresences);
            })
        : null;
    if (channel)
      channel.track({
        user: senderInfo?.data.name,
        online_at: new Date().toISOString(),
      });
    return () => {
      if (channel) {
        channel?.unsubscribe();
        channel = null;
      }
    };
  }, [senderInfo?.data.name, roomId]);

  if (!senderInfo || !messageList || !channel)
    return (
      <Dashboard>
        <div>Chat Loading...</div>
      </Dashboard>
    );

  return (
    <Dashboard>
      <ChatRoom
        senderInfo={senderInfo.data}
        messageList={
          messageList?.data?.map((message) => {
            return {
              text: message.text,
              senderName: message.senderName,
              id: message.id,
            };
          }) ?? []
        }
        channel={channel}
      />
    </Dashboard>
  );
};

export default RoomPage;
