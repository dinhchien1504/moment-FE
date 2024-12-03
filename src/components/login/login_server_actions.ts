'use server'
import API from "@/api/api";
import { FetchServerPostApiNoToken } from "@/api/fetch_server_api";
import { redirect } from 'next/navigation'; // Import hàm redirect
import { setSessionId } from "@/utils/session_store"
export const LoginServerActions = async (AuthenticationRequest: AuthenticationRequest) => {

    // post login
    const res = await FetchServerPostApiNoToken(API.AUTH.TOKEN, AuthenticationRequest);
    // thanh cong
    if (res.status === 200) {
        setSessionId(res.result.token);
        redirect("/")
    }
    return res;
}