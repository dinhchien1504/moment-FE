"use client";

import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { startLoading, stopLoading } from "../shared/nprogress";
import { useState } from "react";

interface Props {
  accountResponse: IAccountResponse;
}
const FriendCard = (props: Props) => {
  const { name, urlPhoto, urlProfile, friendStatus, requestedAt, id } =
    props.accountResponse;
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span>
            Đã kết bạn
            <Button
              className="btn-sm mx-1 btn"
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
                className="btn-sm mx-1 btn"
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
          <>
            <Button
              className="btn-sm mx-1 btn btn-primary"
              onClick={() => handleChangeStatus("accepted")}
            >
              Chấp nhận
            </Button>
            <Button
              className="btn-sm mx-1 btn"
              variant="outline-primary"
              onClick={() => handleChangeStatus("deleted")}
            >
              Xóa
            </Button>
          </>
        );
      default:
        return (
          <Button
            className="btn-sm mx-1 btn btn-primary"
            onClick={() => handleSend()}
          >
            Kết bạn
          </Button>
        );
    }
  };

  const handleSend = async () => {
    try {
      startLoading();
      const dataChangeStatus = {
        accountFriendId: id,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.ADD, dataChangeStatus);
      if (res.status === 200)
        setStatusMessage(getStatusMessage(res.result.friendStatus));
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      stopLoading();
    }
  };

  const [statusMessage, setStatusMessage] = useState(
    getStatusMessage(friendStatus)
  );

  const handleChangeStatus = async (status: string) => {
    try {
      startLoading();
      const dataChangeStatus: FriendStatusRequest = {
        accountFriendId: id,
        status: status,
      };
      const res = await FetchClientPostApi(
        API.ACCOUNT.CHANGE_STATUS,
        dataChangeStatus
      );
      if (res.status === 200)
        setStatusMessage(getStatusMessage(res.result.friendStatus));
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      stopLoading();
    }
  };
  return (
    <>
      <div className="friend-card">
        <div className="d-flex " title={name}>
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
            <span>{statusMessage}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default FriendCard;
