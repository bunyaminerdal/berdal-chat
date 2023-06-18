import basicApi from "@/services/basicApi";
import { AxiosError, AxiosResponse } from "axios";
import useSWR, { SWRResponse } from "swr";

const useRoomsBySenderName = (senderName: string | undefined) => {
  return useSWR<AxiosResponse<Room[]>, AxiosError>(
    senderName ? `/api/room/${senderName}` : null,
    basicApi
  );
};

export default useRoomsBySenderName;
