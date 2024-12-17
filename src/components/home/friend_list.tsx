"use client";
import { useState } from "react";
import FriendCard from "./friend_card";

interface Props {
  friendResponses: IFriendResponse[];
}
const FriendList = (props: Props) => {
  const [friendResponses] = useState<IFriendResponse[]>(props.friendResponses);
  console.log(friendResponses)
  return (
    <>
      <div className="d-flex flex-column">
        {Array.isArray(friendResponses) &&friendResponses?.map((friendResponse, index) => (
          <div key={index} className="m-1 bg-hover p-2 rounded-4">
            <FriendCard friendResponse={friendResponse}></FriendCard>
          </div>
        )

        )}
      </div>
    </>
  );
};
export default FriendList;
