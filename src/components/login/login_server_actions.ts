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
export async function fetchGoogleToken(code: string) {
    if (!code) throw new Error("Thiếu mã code");
  
    const NEXT_PUBLIC_API_HOST= process.env.NEXT_PUBLIC_API_HOST;
    const response = await fetch(
      `${NEXT_PUBLIC_API_HOST}/api/auth/google-login?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
  
    if (!response.ok) {
      throw new Error("Lỗi từ server");
    }
  
    const res = await response.json();
    setSessionId(res.result.token);

    return res.result;
  }