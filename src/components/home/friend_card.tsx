"use client";

import Link from "next/link";

interface Props {
  friendResponse: IFriendResponse;
}
const FriendCard = (props: Props) => {
  const name = props.friendResponse.name;
  const urlPhoto = props.friendResponse.urlPhoto;
  const urlProfile = props.friendResponse.urlProfile;
  const friendStatus = props.friendResponse.friendStatus;
  const requestedAt = props.friendResponse.requestedAt;
  return (
    <>
      <div className="friend-card">
        <Link href={urlProfile} className="d-flex text-decoration-none text-black" title={name}>
          <img
            src={
              urlPhoto
                ? urlPhoto
                : "https://avatars.githubusercontent.com/u/91814060"
            }
            alt={name}
            className="img-avt d-flex flex-column mx-2"
          />
          <div className="info-friend">
            <p className=" mb-1 text-decoration-underline">{name}</p>
            <span className=" text-decoration-none">{friendStatus=="accepted"?"Đã kết bạn":"Đã gửi lời mời"}</span>
          </div>
          {/* <div>{requestedAt}</div> */}
        </Link>
      </div>
    </>
  );
};
export default FriendCard;
