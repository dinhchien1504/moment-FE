'use server'
import API from "@/api/api";
import { FetchPostLoginApi } from "@/api/fetch_api";

import { setSessionId } from "@/utils/session_store"
export const LoginServerActions = async (AuthenticationRequest:AuthenticationRequest) => {

    // post login
    const res = await FetchPostLoginApi(API.AUTH.LOGIN, AuthenticationRequest);
    console.log("res >>> ", res)
    // thanh cong
    if (res.status === 200) {
        setSessionId(res.result.token);
    } 
    return res;
}