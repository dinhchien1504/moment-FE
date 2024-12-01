import cookie from "js-cookie";
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
        // console.error("Error fetching data:", error);
      } finally {
      }
}

export const FetchPostApi = async (api: string,bodyData: any) => {
    console.log(api)
    try {
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
        return data;
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
}

