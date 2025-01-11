"use client";

import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { useState } from "react";
import "@/styles/friend_card.css";
import SpinnerAnimation from "../shared/spiner_animation";

interface Props {
  accountResponse: IAccountResponse;
}
const FriendCard = (props: Props) => {
  const { name, urlPhoto, urlProfile, friendStatus, requestedAt, id } =
    props.accountResponse;

  const [loading ,setLoading]=useState<boolean>(false);

  const timeDifference=(targetDate:string) =>{
    // Thời gian hiện tại
    const currentDate = new Date();
  
    // Tính chênh lệch thời gian
    const diffInMs = currentDate.getTime() - new Date(targetDate).getTime();
  
    // Chuyển đổi mili giây thành các đơn vị thời gian
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
  
    // Tạo kết quả tuỳ thuộc vào các đơn vị thời gian
    let result = '';

    if (years > 0) {
      result = `${years} năm trước`;
    } else if (months > 0) {
      result = `${months} tháng trước`;
    } else if (days > 0) {
      result = `${days} ngày trước`;
    } else if (hours > 0) {
      result = `${hours} giờ trước`;
    } else if (minutes > 0) {
      result = `${minutes} phút trước`;
    } else {
      result = `${seconds} giây trước`;
    }
  
    return result.trim();
  }

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
          <>
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
          </>
        );
      case "invited":
        return (
          <div title={'Yêu cầu vào '+timeDifference(requestedAt)}>
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
        setStatusMessage(convertStatusMessage(res?.result?.friendStatus));
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      setLoading(false);
    }
  };

  const [statusMessage, setStatusMessage] = useState(
    convertStatusMessage(friendStatus)
  );

  const handleChangeStatus = async (status: string) => {
    try {
      setLoading(true);
      const dataChangeStatus: FriendStatusRequest = {
        accountFriendId: id,
        status: status,
      };
      const res = await FetchClientPostApi(
        API.ACCOUNT.CHANGE_STATUS,
        dataChangeStatus
      );
      if (res.status === 200)
        setStatusMessage(convertStatusMessage(res?.result?.friendStatus));
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="friend-card bg-hover p-2 rounded-2 d-flex"
        title={name}>
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
          <Link className=" mb-1 d-block text-black" href={urlProfile}>
              {name}
            </Link>
            <span>{loading ?<SpinnerAnimation/>:statusMessage}</span>
        </div>
      </div>
    </>
  );
};
export default FriendCard;
