'use client'
import cookie from "js-cookie";


export const FetchClientPostApi = async (api: string,bodyData: any) => {
    try {
      if (cookie.get("session-id") === undefined) { 
        throw new Error("Session ID is undefined"); 
      }

        const res = await fetch(api, {
          method: "POST", // Đúng phương thức POST
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json", // Đặt Content-Type là JSON
            Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
          },
          body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
        });

    
        const data = await res.json();
        if (data.status === 401) {
          throw new Error("Unauthorize"); 
     
        }
        return data;
      } catch (error) {
        window.location.href= "/login"
      }
}

export const FetchClientGetApi = async (api: string) => {
  try {

    if (cookie.get("session-id") === undefined) { 
      throw new Error("Session ID is undefined"); 
    }

      const res = await fetch(api, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("session-id")}`,
        },
      });

      const data = await res.json();

      if (data.status === 401) {
        throw new Error("Unauthorize"); 
   
      }

      return data;
    } catch (error) {
         window.location.href= "/login"
    }
}

export const FetchClientPutApi = async (api: string,bodyData: any) => {
  try {
    if (cookie.get("session-id") === undefined) { 
      throw new Error("Session ID is undefined"); 
    }

      const res = await fetch(api, {
        method: "PUT", // Đúng phương thức PUT
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json", // Đặt Content-Type là JSON
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
        body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
      });

  
      const data = await res.json();
      if (data.status === 401) {
        throw new Error("Unauthorize"); 
   
      }
      return data;
    } catch (error) {
      window.location.href= "/login"
    }
}





export const FetchClientGetApiWithSignal = async (api: string, signal: AbortSignal) => {
  try {
    // Kiểm tra nếu session-id không có trong cookie
    const sessionId = cookie.get("session-id");
    if (sessionId === undefined) {
      throw new Error("Session ID is undefined");
    }

    // Thực hiện yêu cầu GET với signal để có thể hủy khi cần
    const res = await fetch(api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionId}`, // Gửi token trong header Authorization
      },
      signal, // Thêm signal vào request
    });

    const data = await res.json();

    return data;

  } catch (error: any) {
    // Nếu yêu cầu bị hủy (AbortError)
    if (error.name === "AbortError") {
    } else if (error.message === "Unauthorized") {
      window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập nếu Unauthorized
    } else {
      console.error("Lỗi khi fetch dữ liệu:", error.message);
    }
  }
};
