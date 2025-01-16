"use client";

import { useSocketContext } from "@/context/socket_context";
import { useEffect, useState } from "react";
import FriendCard from "../home/friend_card";
import sendPushNotification from "../shared/send_push_notification";
import { FetchClientGetApi } from "@/api/fetch_client_api";
import API from "@/api/api";

interface Props {
  setTotalFriendRequest: (value: number) => void;
}

const RequestFriend = (props: Props) => {
  const setTotalFriendRequest = props.setTotalFriendRequest;
  const [friendRequests, setFriendRequests] = useState<
    IAccountResponse[] | null
  >(null);

  const { subscribe } = useSocketContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await FetchClientGetApi(API.ACCOUNT.LIST_INVITED_RECENT);
        setFriendRequests(res.result);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe("/user/queue/friend", (message) => {
      const receivedMessage: IAccountResponse = JSON.parse(message.body);
  
      setFriendRequests((prevFriendRequests) => {
        const updatedRequests = prevFriendRequests || [];
        const filteredRequests = updatedRequests.filter(
          (friend) => friend.urlProfile !== receivedMessage.urlProfile
        );
        const newRequests = [...filteredRequests, receivedMessage];
        setTotalFriendRequest(newRequests.length);
        return newRequests;
      });
  
      sendPushNotification(
        `${receivedMessage.name} gửi lời mời kết bạn`,
        `/friends`
      );
    });
    
  }, []);
  

  return (
    <>
      {Array.isArray(friendRequests) && friendRequests.length > 0 && (
        <div className="title d-flex justify-content-between p-2">
          <h5>Lời mời kết bạn </h5>
        </div>
      )}

      {Array.isArray(friendRequests) &&
        friendRequests?.map((friendRequest, index) => (
          <FriendCard key={index} accountResponse={friendRequest} />
        ))}
    </>
  );
};

export default RequestFriend;
