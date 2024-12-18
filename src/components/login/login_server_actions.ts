'use server'
import API from "@/api/api";
import { FetchServerPostApiNoToken } from "@/api/fetch_server_api";
import { setSessionId } from "@/utils/session_store"
export const LoginServerActions = async (AuthenticationRequest: AuthenticationRequest) => {

    // post login
    const res = await FetchServerPostApiNoToken(API.AUTH.TOKEN, AuthenticationRequest);
    // thanh cong
    if (res && res.status === 200) {
        const data:AuthenticationResponse = res.result 
        setSessionId(data.token);

    }
    return res;
}