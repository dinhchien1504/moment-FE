'use server'
import { getSessionId } from "@/utils/session_store";

export const FetchPostLoginApi = async (api: string,bodyData: any)=> {
    try {
        const res = await fetch(api, {
          method: "POST", // Đúng phương thức POST
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json", // Đặt Content-Type là JSON
          },
          body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.log("error")
      } finally {
      }
}

export const FetchPostApi = async (api: string,bodyData: any) => {
    try {
        const res = await fetch(api, {
          method: "POST", // Đúng phương thức POST
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json", // Đặt Content-Type là JSON
            Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
          },
          body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.log("error")
      }
}

export const FetchGetApi = async (api: string) => {
  try {
      // if (cookie.get("session-id") === undefined) {throws}

      const res = await fetch(api, {
        method: "GET", // Đúng phương thức POST
        headers: {
          Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      // console.error("Error fetching data:", error);
      console.log("error")
    }
}

