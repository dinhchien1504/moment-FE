"use client";
import { useState } from "react";
import FriendList from "./friend_list";
import RequestFriend from "../friend/request_friend";
import { PushNotificationRegister } from "../push/PushNotificationRegister";
const OffcanvasFriend = () => {
  const [show, setShow] = useState(false);
  const [showBadge, setShowBadge] = useState<boolean>(false);

  const handleShow = () => {
    if (show) 
      setShow(false);
    else {
      setShow(true);
      if(showBadge)
        setShowBadge(false);
    }
  };
  const handleClose = () => setShow(false);

  const setHasRequest = (value: boolean) => {
    setShowBadge(value);
  };

  return (
    <>
      <div className={`d-md-block ${show ? "d-block" : "d-none"}`}>
        <div
          className={`position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-25 z-2 ${
            show ? "d-block" : "d-none"
          }`}
          onClick={() => handleClose()}
        ></div>
        <div className="d-flex flex-column position-sm-fixed">
          <div className="height-list-friend">
            <RequestFriend setHasRequest={setHasRequest} />
            <FriendList />
          </div>
        </div>
      </div>

      <div className="button-show-friend position-fixed z-1 d-flex d-md-none">
        <div
          className="bg-dark-subtle p-2 rounded-2 ms-1"
          onClick={() => {
            handleShow();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-people-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
        </div>
        {showBadge && 
        (
          <span
            className="badge text-bg-secondary align-items-center badge-home position-absolute bg-danger"
          >&nbsp;</span>
        )}
      </div>
     <PushNotificationRegister />
    </>
  );
};
export default OffcanvasFriend;
