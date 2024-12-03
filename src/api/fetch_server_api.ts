'use server'
import { getSessionId } from "@/utils/session_store";

import { redirect } from 'next/navigation'; // Import hàm redirect
export const FetchServerPostApiNoToken = async (api: string,bodyData: any)=> {
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

      } 
}

// export const FetchServerPostApi = async (api: string,bodyData: any) => {
//     try {

//         const res = await fetch(api, {
//           method: "POST", // Đúng phương thức POST
//           headers: {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json", // Đặt Content-Type là JSON
//             Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
//           },
//           body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
//         });
//         const data = await res.json();
//         return data;
//       } catch (error) {
//         console.log("error")
//       }
// }


export const FetchServerGetApi = async (api: string) => {
  try {    
    if (getSessionId() === undefined) { throw new Error("Session ID is undefined"); }
      const res = await fetch(api, {
        method: "GET", // Đúng phương thức POST
        headers: {
          Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
        },
      });
      const data = await res.json();

      if (data.status === 401) {
        throw new Error("Unauthorization"); 
      }

      return data;
    } catch (error) {
      redirect('/login');
    }
}

