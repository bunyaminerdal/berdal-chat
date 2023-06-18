type Sender = {
  id: string;
  messages?: Message[];
  rooms?: string[];
  contacts?: string[];
  name: string;
};

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  roomId: string;
  text: string;
};
type Room = {
  id: string;
  senders?: string[];
  messages?: Message[];
  name?: string;
};

type MessageType = {
  senderName: string;
  text: string;
  id: string;
};
