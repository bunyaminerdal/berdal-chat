import basicApi from "@/services/basicApi";
import { AxiosError, AxiosResponse } from "axios";
import useSWR, { SWRResponse } from "swr";

const useSenderById = (senderId: string | undefined) => {
  return useSWR<AxiosResponse<Sender>, AxiosError>(
    senderId ? `/api/sender/${senderId}` : null,
    basicApi
  );
};

export default useSenderById;
