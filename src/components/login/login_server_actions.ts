"use server";
import API from "@/api/api";
import { FetchServerGetApiNoToken, FetchServerPostApiNoToken } from "@/api/fetch_server_api";
import { setSessionId } from "@/utils/session_store";
export const LoginServerActions = async (
  AuthenticationRequest: AuthenticationRequest
) => {
  // post login
  const res = await FetchServerPostApiNoToken(
    API.AUTH.TOKEN,
    AuthenticationRequest
  );
  // thanh cong
  if (res && res.status === 200) {
    const data: AuthenticationResponse = res.result;
    setSessionId(data.token);
  }
  return res;
};
export const fetchGoogleToken = async (code: string) => {
  if (!code) throw new Error("Thiếu mã code");

  const response = await FetchServerGetApiNoToken(
    API.AUTH.LOGIN_GOOGLE+`?code=${encodeURIComponent(code)}`
  );

  setSessionId(response.result.token);

  return response.result;
};
