"use client";
import { useState } from "react";
import FriendCard from "./friend_card";
import { Tab, Tabs } from "react-bootstrap";

interface Props {
  accountAcceptedResponses: IAccountResponse[];
  accountSentResponses: IAccountResponse[];
  accountInvitedResponses: IAccountResponse[];
}
const FriendList = (props: Props) => {
  const {
    accountAcceptedResponses,
    accountSentResponses,
    accountInvitedResponses,
  } = props;
  const [show, setShow] = useState(false);

  const handleShow = () => {
    if(show)
      setShow(false);
    else setShow(true);
  };
  const handleClose = () => setShow(false);

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
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="m-1"
          >
            <Tab eventKey="home" title="Bạn bè">
              {Array.isArray(accountAcceptedResponses) &&
                accountAcceptedResponses?.map((accountResponse, index) => (
                  <div key={index} className="m-1 bg-hover p-2 rounded-2">
                    <FriendCard accountResponse={accountResponse}></FriendCard>
                  </div>
                ))}
            </Tab>
            <Tab eventKey="profile" title="Đã nhận">
              {Array.isArray(accountInvitedResponses) &&
                accountInvitedResponses?.map((accountResponse, index) => (
                  <div key={index} className="m-1 bg-hover p-2 rounded-2">
                    <FriendCard accountResponse={accountResponse}></FriendCard>
                  </div>
                ))}
            </Tab>
            <Tab eventKey="contact" title="Đã gửi">
              {Array.isArray(accountSentResponses) &&
                accountSentResponses?.map((accountResponse, index) => (
                  <div key={index} className="m-1 bg-hover p-2 rounded-2">
                    <FriendCard accountResponse={accountResponse}></FriendCard>
                  </div>
                ))}
            </Tab>
          </Tabs>
        </div>
      </div>

      <div className="top-calc-100vh-126px position-fixed z-1 d-flex d-sm-none">
        <div
          className="bg-dark-subtle p-2 rounded-2"
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
      </div>
    </>
  );
};
export default FriendList;
