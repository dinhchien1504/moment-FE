"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import "@/styles/post_modal.css";
import { useUserContext } from "@/context/user_context";
import { captureScreen } from "./screen_shot";
import CropModal from "./crop_modal";
import Form from 'react-bootstrap/Form';
import TakePhotoModal from "./take_photo_modal";
import { handlePreviewImg, handleUploadImg } from "@/utils/handle_images";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';
import { FetchClientPostApi } from "@/api/fetch_client_api";
import API from "@/api/api";
import { startLoading, stopLoading } from "../shared/nprogress";
import MobileDetect from "mobile-detect";
import { getServerUTC } from "@/utils/utc_server_action";
import { getCurrentTime } from "@/utils/utils_time";



interface IProps {
    handleReloadPhoto: () => void;
}

const PostModal = (props: IProps) => {
    const { handleReloadPhoto } = props;
    const { user } = useUserContext();

    const [fileRoot, setFileRoot] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<File | null>(null);

    const [showCrop, setShowCrop] = useState<boolean>(false)
    const [showTakePhoto, setShowTakePhoto] = useState<boolean>(false)

    const [caption, setCaption] = useState<string>("")

    const [md, setMd] = useState<MobileDetect | null>(null);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const mobileDetect = new MobileDetect(window.navigator.userAgent);
            setMd(mobileDetect);
        }
    }, []); // Đảm bảo rằng đoạn mã này chỉ chạy trên client

    const handleCaptureScreen = async () => {
        const file: any = await captureScreen()
        if (file != null) {
            setFilePreview(file)
            setFileRoot(file)
        }
    }

    const handleRestore = () => {
        setFilePreview(fileRoot)
    }

    const handleDelete = () => {
        setFilePreview(null)
        setFileRoot(null)
    }

    const handlePost = async () => {
      console.log("thời gian khi bấm nút đăng",getCurrentTime())
        startLoading()

        if (filePreview) {
            const res = await handleUploadImg(filePreview)
            // lưu thành công ảnh trên cloundy
            if (res.public_id) {
                const postRequest: PostRequest = {
                    url: res.public_id,
                    caption: caption
                }

                const resPost = await FetchClientPostApi(API.POST.POST, postRequest)
                if (resPost && resPost.status === 200) {
                console.log("thời gian khi status 200",getCurrentTime())
                const time = await getServerUTC(); // Gọi hàm Server Action
                console.log("get time server vercel >>> ", time)
                    handleReloadPhoto()
                    setCaption("")
                    setFileRoot(null)
                    setFilePreview(null)
                }
            }

        }


    }


    const handleFileChange = async (event: any) => {
        const file = event.target.files?.[0];
        setFilePreview(file)
        setFileRoot(file)
    }

    return (
        <>
             <div className="d-flex justify-content-center align-items-center shadow-sm rounded-2 m-2 p-2 bg-light h-100 w-100">
                <div className="flex-grow-1 flex-shrink-1 flex-basis-auto">
                  <div className="div-info-capture">
                    <div>
                      <Image
                        src="/images/avatar.jpg"
                        width={50}
                        height={50}
                        alt="Dropdown Trigger"
                        className="img-avatar-item"
                      />
                      {user?.name}
                    </div>

                    <div className="div-btn-capture">
                      {md !== null && md.mobile() ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            id="fileInput"
                            hidden
                            onChange={(e) => {
                              handleFileChange(e);
                            }}
                          />

                          <label
                            htmlFor="fileInput"
                            typeof="button"
                            className="btn-screen-shot lable-screen-shot"
                          >
                            <i className="fa-solid fa-camera"></i>
                          </label>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => {
                              setShowTakePhoto(true);
                            }}
                            className="btn-screen-shot"
                          >
                            <i className="fa-solid fa-camera"></i>
                          </Button>
                          <Button
                            onClick={() => {
                              handleCaptureScreen();
                            }}
                            className="btn-screen-shot"
                          >
                            <i className="fa-regular fa-image"></i>
                          </Button>
                        </>
                      )}

                      {filePreview != null && (
                        <>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              id="dropdown-basic"
                              className="btn-screen-shot"
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  setShowCrop(true);
                                }}
                              >
                                <i className="fa-solid fa-scissors "></i> Cắt
                                ảnh
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleRestore();
                                }}
                              >
                                <i className="fa-solid fa-reply "></i> Khôi phục
                              </Dropdown.Item>
                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handleDelete();
                                }}
                              >
                                <i className="fa-solid fa-trash-can "></i> Xóa
                                ảnh
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="div-img-capture">
                    <img
                      style={{
                        display: "block",
                        maxWidth: "100%",
                      }}
                      src={handlePreviewImg(filePreview)}
                      className="img-capture"
                    />
                  </div>

                  <div className="div-caption">
                    <Form.Control
                      as="textarea"
                      aria-label="With textarea"
                      placeholder="Nêu cảm nghĩ của bạn"
                      value={caption}
                      onChange={(e) => {
                        setCaption(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid" className="mt-0">
                      {"Vui lòng điền tài khoản."}
                    </Form.Control.Feedback>
                  </div>

                  <Button
                    className="btn-post mt-2"
                    disabled={filePreview === null}
                    onClick={() => {
                      handlePost();
                    }}
                  >
                    Đăng
                  </Button>
                </div>
              </div>

            <CropModal
                setShowCrop={setShowCrop}
                showCrop={showCrop}
                setFilePreview={setFilePreview}
                fileRoot={fileRoot}

            />

            <TakePhotoModal
                showTakePhoto={showTakePhoto}
                setShowTakePhoto={setShowTakePhoto}
                setFilePreview={setFilePreview}
                setFileRoot={setFileRoot}
            />





        </>
    );
};

export default PostModal;
