import basicApi from "@/services/basicApi";
import { AxiosError, AxiosResponse } from "axios";
import useSWR, { SWRResponse } from "swr";

const useMessagesByRoomId = (roomId: string | undefined) => {
  return useSWR<AxiosResponse<Message[]>, AxiosError>(
    roomId ? `/api/message/${roomId}` : null,
    basicApi
  );
};

export default useMessagesByRoomId;
