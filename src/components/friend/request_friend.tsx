"use client";

import { useSocketContext } from "@/context/socket_context";
import MobileDetect from "mobile-detect";
import { useEffect, useState } from "react";
import FriendCard from "../home/friend_card";

const RequestFriend = () => {
  const [friendRequests, setFriendRequests] =
    useState<IAccountResponse[] | null>(null);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const { subscribe } = useSocketContext();
  useEffect(() => {
      subscribe('/user/queue/friend', (message) => {
          const receivedMessage:IAccountResponse = JSON.parse(message.body);
          setFriendRequests((prevFriendRequests) => [receivedMessage, ...prevFriendRequests?prevFriendRequests:[]]);
      });
  }, [])

  return (
    <>
    {
      friendRequests!=null && (<h5>Lời mời kết bạn</h5>)
    }

        {
        friendRequests?.map(
          (friendRequest, index) => (
            <FriendCard key={index} accountResponse={friendRequest} />
          )
        )}
    </>
  );
};

export default RequestFriend;
