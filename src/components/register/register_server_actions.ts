'use server'
import API from "@/api/api";
import { FetchServerPostApiNoToken } from "@/api/fetch_server_api";
import { setSessionId } from "@/utils/session_store"
export const RegisterServerActions = async (RegisterRequest:RegisterRequest) => {

    // post register
    const res = await FetchServerPostApiNoToken(API.ACCOUNT.REGISTER, RegisterRequest);
    // thanh cong
    if (res.status === 200) {
        const data:AuthenticationResponse = res.result 
        setSessionId(data.token);

    }
    return res;
}