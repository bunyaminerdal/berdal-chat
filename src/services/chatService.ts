import basicApi from "./basicApi";

export const createSender = async (name: string): Promise<Sender> => {
  const res = await basicApi.post(`/api/sender`, { name });

  return res.data;
};
export const updateSender = async (sender: Sender): Promise<Sender> => {
  const { id, ...rest } = sender;
  const res = await basicApi.patch(`/api/sender/${id}`, { ...rest });

  return res.data;
};
export const addContact = async (
  senderId: string,
  contactNames: string[],
  newContactName: string,
  rooms: string[],
  senderName: string
): Promise<Sender> => {
  const res = await basicApi.patch(`/api/sender/${senderId}`, {
    contactNames,
    newContactName,
    rooms,
    senderName,
  });

  return res.data;
};

export const getSender = async (senderId: string): Promise<Sender> => {
  const res = await basicApi.get(`/api/sender/${senderId}`);

  return res.data;
};
export const createRoom = async (senders: string[]): Promise<Room> => {
  const res = await basicApi.post(`/api/room`, { senders });

  return res.data;
};

export const createMessage = async (
  id: string,
  senderId: string,
  senderName: string,
  roomId: string,
  text: string
): Promise<Message> => {
  const res = await basicApi.post(`/api/message`, {
    id,
    senderId,
    senderName,
    roomId,
    text,
  });

  return res.data;
};
