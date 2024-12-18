"use client";
import FriendCard from "./friend_card";

interface Props {
  accountResponses: IAccountResponse[];
}
const FriendList = (props: Props) => {
  const accountResponses =props.accountResponses;
  return (
    <>
      <div className="d-flex flex-column">
        {Array.isArray(accountResponses) &&accountResponses?.map((accountResponse, index) => (
          <div key={index} className="m-1 bg-hover p-2 rounded-4">
            <FriendCard accountResponse={accountResponse}></FriendCard>
          </div>
        )

        )}
      </div>
    </>
  );
};
export default FriendList;
