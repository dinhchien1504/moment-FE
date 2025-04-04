"use client";

import API from "@/api/api";
import { GetImage } from "@/utils/handle_images";
import { FetchClientPostApi, FetchClientPutApi } from "@/api/fetch_client_api";
import React, { use, useState, useRef, useEffect } from "react";
import { Col, Container, Row, Button, Stack, Image } from "react-bootstrap";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import FriendList from "../home/friend_list";
import "@/styles/profile_user.css"

import RequestFriend from "../friend/request_friend";
import Link from "next/link";
import AvatarModal from "./avatar_modal";
import SpinnerAnimation from "../shared/spiner_animation";

interface Props {
  profileRespone: IProfileResponse;
  time: string;
  params: string;
}

const InforUser = (props: Props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAvtModal, setShowAvtModal] = useState<boolean>(false)
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false)


  const { params, time } = props;
  const [pageCurrent, setPageCurrent] = useState(0);

  const [profileRespone, setProfileRespone] = useState<IProfileResponse>(
    props.profileRespone
  );

  const [friendStatus, setFriendStatus] = useState<string>(
    props.profileRespone.friendStatus
  );

  const target = useRef(null);
  const changeStatus = async (idAccountChange: string, newStatus: string) => {
    try {
      setIsLoadingAction(true)
      const dataChangeStatus = {
        accountFriendId: idAccountChange,
        status: newStatus,
      };
      // console.log ('this is datachange', dataChangeStatus)
      const result = await FetchClientPutApi(API.ACCOUNT.CHANGE_STATUS, dataChangeStatus);
      console.log('result', result)
      if (result.status === 200) {
        setProfileRespone((prevProfile) => ({
          ...prevProfile,
          friendStatus: newStatus,
        }));
        console.log('profil status', profileRespone.friendStatus)
        if (profileRespone.friendStatus == "received") {
          setFriendStatus(dataChangeStatus.status);

        }
        else {
          setFriendStatus(profileRespone.friendStatus);
        }
        // setFriendStatus(result.);

      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoadingAction(false)
    }
  };

  const handleAddFriend = async () => {
    try {
      setIsLoadingAction(true)
      const dataChange = {
        accountFriendId: profileRespone.idAccount,
      };

      const addFriend = await FetchClientPostApi(API.ACCOUNT.ADD, dataChange);

      if (addFriend.status === 200) {

        setFriendStatus(addFriend.result.friendStatus);
      }
    } catch (error) {
      console.error("Error :", error);
    } finally {
      setIsLoadingAction(false)
    }
  };
  useEffect(() => {
    console.log('friendStatus updated:', friendStatus);
  }, [friendStatus]);


  useEffect(() => {
    const fetchUpdatedProfile = async () => {
      try {
        setIsLoadingAction(true)
        const dataProfile: IProfileFillterRequest = {
          pageCurrent: pageCurrent,
          time: time,
          userName: params,
        };

        const response = await FetchClientPostApi(
          API.PROFILE.PROFILE,
          dataProfile
        );

        if (
          response.status === 200 &&
          response.result.friendStatus !== profileRespone.friendStatus
        ) {
          console.log('this is res', response.result)
          setProfileRespone(response.result);
          setFriendStatus(response.result.friendStatus);
        }
      } catch (error) {
        console.error("Error fetching updated profile:", error);
      } finally {
        setIsLoadingAction(false)
      }
    };

    if (friendStatus !== profileRespone.friendStatus) {
      // Kiểm tra nếu trạng thái mới khác trạng thái hiện tại
      fetchUpdatedProfile();
      // setFriendStatus(fetchUpdatedProfile().res)
    }
  }, [friendStatus, profileRespone.friendStatus]); // Thêm `profileRespone.friendStatus` để tránh gọi API khi giá trị không đổi


  const handleShowAvtModal = () => {
    setShowAvtModal(true)
  }

  return (
    <>

      <Row
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: " 2% 0 ",
        }}
      >
        <Col className="center_col">
          <Stack gap={3} className="center_col ">
            <div className="div-avt-btn">
              <Image
                alt=""
                src={GetImage(profileRespone.urlAvt)}
                style={{
                  objectFit: "cover",
                }}
                height="150px"
                width="150px"
                roundedCircle
              />
              {profileRespone.friendStatus === "me" &&
                <Button variant="dark" className="btn-change-avt"
                  onClick={() => { handleShowAvtModal() }}>
                  <i className="fa-solid fa-camera"></i>
                </Button>
              }

            </div>

            <div className="">
              {profileRespone.name}
            </div>
            <div className="">
              {profileRespone.userName}
            </div>

            {/* ------------------------------------------------------------------------------- */}
            {isLoadingAction === true ? (
              <div>
                <SpinnerAnimation/>
             </div>
            ) : (
                <div className="flex gap-2">
                  {friendStatus === "me" && (
                    <>
                      {/* <Button variant="dark">Đăng bài </Button> */}
                      <Link href={"/setting"}>
                        <Button variant="dark">
                          <i className="fa-solid fa-gear"></i>
                        </Button>
                      </Link>

                      {/* <Button variant="dark">
                  <i className="fa-solid fa-share"></i>
                </Button> */}
                    </>
                  )}
                  {friendStatus === "accepted" && (
                    <>
                      {/* <Button variant="dark"></Button> */}
                      <Button
                        variant="dark"
                        ref={target}
                        onClick={() => setShow(!show)}
                      >
                        Bạn Bè
                      </Button>
                      <Overlay
                        target={target.current}
                        show={show}
                        placement="bottom-start"
                      >
                        {(props) => (
                          <Tooltip id="overlay-example" {...props}>
                            <Button
                              style={{
                                color: "white"
                              }}
                              variant="none"
                              onClick={() => {
                                changeStatus(profileRespone.idAccount, "deleted");
                              }}
                            >
                              Hủy kết bạn
                            </Button>
                          </Tooltip>
                        )}
                      </Overlay>
                      {/* <Button variant="dark">Nhắn tin</Button> */}
                    </>
                  )}
                  {friendStatus === "received" && (
                    <>
                      <Button
                        variant="dark"
                        onClick={() => {
                          changeStatus(profileRespone.idAccount, "accepted");
                        }}
                      >
                        Chấp nhận
                      </Button>

                      <Button
                        variant="dark"
                        onClick={() => {
                          changeStatus(profileRespone.idAccount, "deleted");
                        }}
                        style={{ backgroundColor: "white", color: "black" }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}

                  {friendStatus === "sent" && (
                    <>
                      <Button
                        variant="dark"
                      >
                        Đã gửi lời mời{" "}
                      </Button>
                      <Button
                        variant="white"
                        onClick={() =>
                          changeStatus(profileRespone.idAccount, "deleted")
                        }
                        style={{ borderColor: "black" }}
                      >
                        Hủy{" "}
                      </Button>
                    </>
                  )}

                  {friendStatus === "none" && (
                    <Button variant="dark" onClick={() => handleAddFriend()}>
                      {" "}
                      Kết bạn{" "}
                    </Button>
                  )}
                </div>
              )
            }


            {/* --------------------------------------------------------------- */}

            {/* <div className="boild">{profileRespone.quantityFriend} Friend</div> */}
          </Stack>
        </Col>
      </Row>
      <AvatarModal
        setShowAvtModal={setShowAvtModal}
        showAvtModal={showAvtModal}
        profileRespone={profileRespone}
      />
    </>
  );
};

export default InforUser;
