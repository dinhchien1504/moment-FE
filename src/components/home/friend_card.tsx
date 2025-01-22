"use client";

import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { useState, useMemo } from "react";
import "@/styles/friend_card.css";
import SpinnerAnimation from "../shared/spiner_animation";

interface Props {
  accountResponse: IAccountResponse;
}
const FriendCard = ({ accountResponse }: Props) => {
  const { name, urlPhoto, urlProfile, friendStatus, requestedAt, id } = accountResponse;
  // console.log('this is id ', id)
  const [loading, setLoading] = useState<boolean>(false);

  // Tính toán sự chênh lệch thời gian
  const timeDifference = useMemo(() => {
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - new Date(requestedAt).getTime();
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
  
    if (years > 0) return `${years} năm trước`;
    if (months > 0) return `${months} tháng trước`;
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  }, [requestedAt]);

  const convertStatusMessage = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span>
            Đã kết bạn
            <Button
              className="btn-sm m-1 btn"
              variant="outline-primary"
              onClick={() => handleChangeStatus("deleted")}
            >
              Hủy
            </Button>
          </span>
        );
      case "sent":
        return (
          <span>
            Đã gửi
            <Button
              className="btn-sm m-1 btn"
              variant="outline-primary"
              onClick={() => handleChangeStatus("deleted")}
            >
              Xóa
            </Button>
          </span>
        );
      case "invited":
        return (
          <div title={`Yêu cầu vào ${timeDifference}`}>
            <Button
              className="btn-sm m-1 btn btn-primary"
              onClick={() => handleChangeStatus("accepted")}
            >
              Chấp nhận
            </Button>
            <Button
              className="btn-sm m-1 btn"
              variant="outline-primary"
              onClick={() => handleChangeStatus("deleted")}
            >
              Từ chối
            </Button>
          </div>
        );
      case "me":
        return (
          <Button variant="outline-primary" 
            className="btn-sm m-1"
            href={urlProfile}
          >
            Xem thông tin
          </Button>
        );
      default:
        return (
          <Button
            className="btn-sm m-1 btn btn-primary"
            onClick={() => handleSend()}
          >
            Kết bạn
          </Button>
        );
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const dataChangeStatus = {
        accountFriendId: id,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.ADD, dataChangeStatus);
      if (res.status === 200)
        setStatusMessage(
          convertStatusMessage(res?.result?.friendStatus || "none")
        );
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const [statusMessage, setStatusMessage] = useState(
    convertStatusMessage(friendStatus)
  );

  const handleChangeStatus = async (statusNew: string) => {
    try {
      setLoading(true);
      const dataChangeStatus: FriendStatusRequest = {
        accountFriendId: id,
        status: statusNew,
      };
      const res = await FetchClientPostApi(
        API.ACCOUNT.CHANGE_STATUS,
        dataChangeStatus
      );
      if (res.status === 200)
        setStatusMessage(
          convertStatusMessage(res?.result?.friendStatus || "none")
        );
    } catch (error) {
      console.error("Error changing friend status:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="friend-card bg-hover p-2 rounded-2 d-flex" title={name}>
      <img
        src={urlPhoto || "/images/avatar.jpg"}
        alt={name}
        className="img-avt d-flex flex-column mx-2"
      />
      <div className="info-friend">
        <Link className="mb-1 d-block text-black text-decoration-none" href={urlProfile}>
          {name}
        </Link>
        <span>{loading ? <SpinnerAnimation /> : statusMessage}</span>
      </div>
    </div>
  );
};
export default FriendCard;
