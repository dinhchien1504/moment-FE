"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "@/styles/post_modal.css";
import { useUserContext } from "@/context/user_context";
import { captureScreen } from "./screen_shot";
import CropModal from "./crop_modal";
import Form from 'react-bootstrap/Form';
import TakePhotoModal from "./take_photo_modal";
import {  handlePreviewImg, handleUploadImg } from "@/utils/handle_images";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';
import { FetchClientPostApi } from "@/api/fetch_client_api";
import API from "@/api/api";
import { startLoading, stopLoading } from "../shared/nprogress";
import MobileDetect from "mobile-detect";



interface IProps {
    showPost: boolean;
    setShowPost: (value: boolean) => void;
}

const PostModal = (props: IProps) => {
    const { user } = useUserContext();
    const { showPost, setShowPost } = props;

    const [fileRoot, setFileRoot] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<File | null>(null);

    const [showCrop, setShowCrop] = useState<boolean>(false)
    const [showTakePhoto, setShowTakePhoto] = useState<boolean>(false)

    const [caption, setCaption] = useState<string>("")

    const [md, setMd] = useState<MobileDetect | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const mobileDetect = new MobileDetect(window.navigator.userAgent);
            setMd(mobileDetect);
        }
    }, []); // Đảm bảo rằng đoạn mã này chỉ chạy trên client


    const handleClosePost = () => {
        setShowPost(false);
    };

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
        setIsLoading(true);  // Bắt đầu quá trình tải lên
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
                    setShowPost(false)
                    setCaption("")
                    setFileRoot(null)
                    setFilePreview(null)
                }
            }

        }


        stopLoading()
        setIsLoading(false);  // Kết thúc quá trình tải lên
    }


    const handleFileChange = async (event: any) => {
        const file = event.target.files?.[0];
        setFilePreview(file)
        setFileRoot(file)
    }

    return (
        <>
            <Modal
                show={showPost}
                size={"lg"}
                onHide={() => {
                    handleClosePost();
                }}
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Tạo khoảnh khắc của bạn</Modal.Title>
                </Modal.Header>
                <Modal.Body className="md-bd-post">
                    <div className="div-info-capture">

                        <div >
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

                            {md !== null && md.mobile() ? (<>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    id="fileInput"
                                    hidden
                                    onChange={(e) => { handleFileChange(e) }}
                                />

                                <label htmlFor="fileInput" typeof="button" className="btn-screen-shot lable-screen-shot">
                                    <i className="fa-solid fa-camera"></i>
                                </label>

                            </>) : (<>
                                <Button
                                    onClick={() => { setShowTakePhoto(true) }}

                                    className="btn-screen-shot">
                                    <i className="fa-solid fa-camera"></i>

                                </Button>
                            </>)}






                            <Button onClick={() => { handleCaptureScreen() }} className="btn-screen-shot">
                                <i className="fa-regular fa-image"></i>

                            </Button>

                            {filePreview != null &&
                                <>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic"
                                            className="btn-screen-shot"
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item as="button" onClick={() => { setShowCrop(true) }}>
                                                <i className="fa-solid fa-scissors "></i> Cắt ảnh
                                            </Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={() => { handleRestore() }}>
                                                <i className="fa-solid fa-reply "></i> Khôi phục
                                            </Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={() => { handleDelete() }}>
                                                <i className="fa-solid fa-trash-can "></i> Xóa ảnh
                                            </Dropdown.Item>


                                        </Dropdown.Menu>
                                    </Dropdown>


                                </>
                            }


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
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="Nêu cảm nghĩ của bạn"
                            onChange={(e) => { setCaption(e.target.value) }}
                        />
                        <Form.Control.Feedback type="invalid" className='mt-0'>
                            {"Vui lòng điền tài khoản."}
                        </Form.Control.Feedback>
                    </div>





                </Modal.Body>
                <Modal.Footer className="mdl-footer">
                    <Button className={`btn-post`}
                        disabled={filePreview === null || isLoading}
                        onClick={() => { handlePost() }}
                    >Đăng</Button>
                </Modal.Footer>
            </Modal >

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
