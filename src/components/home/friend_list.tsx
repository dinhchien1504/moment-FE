"use client";
import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { getServerUTC } from "@/utils/utc_server_action";
import Link from "next/link";
import { useEffect, useState } from "react";
import SpinnerAnimation from "../shared/spiner_animation";
import FriendCard from "./friend_card";



const FriendList = () => {

  const [accountAcceptedResponses, setAccountAcceptedResponse] = useState<
    IAccountResponse[] | null
  >(null);
  const [countTotalFriend, setCountTotalFriend] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
      const time = await getServerUTC();
      const dataBody: IFriendFilterRequest = {
        pageCurrent: 0,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST, dataBody);
      setAccountAcceptedResponse(res.result);
      setCountTotalFriend(res.totalItems);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bạn bè:", error);
    }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="title d-flex justify-content-between p-2">
        <div className="d-flex align-items-center">
          <h5>
            Bạn bè <span className="fs-5 ms-2">{countTotalFriend==0?'':countTotalFriend}</span>
          </h5>
        </div>

        <Link href={"/friends"} className="text-decoration-none">
          Xem tất cả
        </Link>
      </div>
      <div className="">
        {accountAcceptedResponses === null ? (
          <div className="d-flex justify-content-center align-items-center">
            <SpinnerAnimation></SpinnerAnimation>
          </div>
        ) : (
          Array.isArray(accountAcceptedResponses) &&
          accountAcceptedResponses?.map((accountResponse, index) => (
            <div key={index} className="m-1">
              <FriendCard accountResponse={accountResponse}></FriendCard>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default FriendList;
