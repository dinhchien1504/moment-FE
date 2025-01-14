"use client";

import { useSocketContext } from "@/context/socket_context";
import { useEffect, useState } from "react";
import FriendCard from "../home/friend_card";
import sendPushNotification from "../shared/send_push_notification";

interface Props {
  setFriendRequest: (value: number) => void;
}

const RequestFriend = (props: Props) => {
  const setFriendRequestProp = props.setFriendRequest;
  const [friendRequests, setFriendRequests] = useState<
    IAccountResponse[] | null
  >(null);

  const { subscribe } = useSocketContext();
  useEffect(() => {
    subscribe("/user/queue/friend", (message) => {
      const receivedMessage: IAccountResponse = JSON.parse(message.body);
      setFriendRequests((prevFriendRequests) => {
        const updatedRequests = prevFriendRequests || [];
        const isExisting = updatedRequests.some(
          (friend) => friend.urlProfile === receivedMessage.urlProfile
        );
  
        const newRequests = isExisting
          ? updatedRequests.map((friend) =>
              friend.friendStatus === receivedMessage.friendStatus
                ? receivedMessage
                : friend
            )
          : [receivedMessage, ...updatedRequests];
  
        // Trả về danh sách bạn mới
        return newRequests;
      });
  
      // Tính toán số lượng lời mời mới và cập nhật cha
      setFriendRequests((prevFriendRequests) => {
        const count = prevFriendRequests ? prevFriendRequests.length : 0;
        setFriendRequestProp(count);
        return prevFriendRequests;
      });
  
      // Gửi thông báo nếu có lời mời mới
      sendPushNotification(
        `${receivedMessage.name} gửi lời mời kết bạn`,
        `/friends`
      );
    });
  }, []);
  

  return (
    <>
      {friendRequests != null && (
        <div className="title d-flex justify-content-between p-2">
          <h5>Lời mời kết bạn </h5>
        </div>
      )}

      {friendRequests?.map((friendRequest, index) => (
        <FriendCard key={index} accountResponse={friendRequest} />
      ))}
    </>
  );
};

export default RequestFriend;
