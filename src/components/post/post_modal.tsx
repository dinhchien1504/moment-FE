"use client";

import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "@/styles/post_modal.css";
import Image from "next/image";
import { useUserContext } from "@/context/user_context";
import { captureScreen } from "./screen_shot";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useCallback } from 'react'
import Cropper from 'react-easy-crop'
import CropModal from "./crop_modal";
import Form from 'react-bootstrap/Form';
import TakePhotoModal from "./take_photo_modal";

interface IProps {
    showPost: boolean;
    setShowPost: (value: boolean) => void;
}

const PostModal = (props: IProps) => {
    const { user } = useUserContext();
    const { showPost, setShowPost } = props;

    const [srcRoot, setSrcRoot] = useState<any>("") // cai nay la anh chup man hinh kh cat
    const [src, setSrc] = useState<any>("/images/unnamed.png") // cai nay la anh da cat

    const [showCrop, setShowCrop] = useState<boolean>(false)
    const [showTakePhoto,setShowTakePhoto] = useState<boolean> (false)

    const handleClosePost = () => {
        setShowPost(false);
    };

    const handleCaptureScreen = async () => {
        const img: any = await captureScreen()
        if (img != "unknow") {
            setSrc(img)
            setSrcRoot(img)
        }
    }

    const handleRestore = () => {
        setSrc(srcRoot)
    }

    const handleDelete = () => {
        setSrc("/images/unnamed.png")
        setSrcRoot("")
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

                    {/* <div>
                            <Image
                                src="/images/avatar.jpg"
                                width={50}
                                height={50}
                                alt="Dropdown Trigger"
                                className="img-avatar-item"
                            />
                            {user?.name}
                        </div> */}

                    <div className="div-btn-capture">
                        <Button 
                        onClick={() => { setShowTakePhoto(true) }} 
                        style={{marginRight:"10px"}}
                        className="btn-screen-shot">
                            <i className="fa-solid fa-camera icon-action"></i>
                            Chụp ảnh
                        </Button>

                        <Button onClick={() => { handleCaptureScreen() }} className="btn-screen-shot">
                            <i className="fa-solid fa-camera-retro icon-action"></i>
                            Chụp màn hình
                        </Button>

                        {src != "/images/unnamed.png" &&
                            <>
                                <Button onClick={() => { setShowCrop(true) }} className="btn-action-img">
                                    <i className="fa-solid fa-scissors icon-action"></i>
                                    Cắt ảnh</Button>

                                <Button onClick={() => { handleRestore() }} className="btn-action-img">
                                    <i className="fa-solid fa-reply icon-action"></i>
                                    Phục hồi</Button>

                                <Button onClick={() => { handleDelete() }} className="btn-action-img">
                                    <i className="fa-solid fa-trash-can icon-action"></i>
                                    Xóa ảnh</Button>
                            </>
                        }


                    </div>






                    <div className="div-img-capture">
                        <img
                            style={{
                                display: "block",
                                maxWidth: "100%",
                            }}
                            src={src}
                            className="img-capture"
                        />
                    </div>

                    <div className="div-caption">
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="Nêu cảm nghĩ của bạn" />
                        <Form.Control.Feedback type="invalid" className='mt-0'>
                            {"Vui lòng điền tài khoản."}
                        </Form.Control.Feedback>
                    </div>





                </Modal.Body>
                <Modal.Footer className="mdl-footer">
                    <Button className="btn-post">Đăng</Button>
                </Modal.Footer>
            </Modal>

            <CropModal
                setShowCrop={setShowCrop}
                showCrop={showCrop}
                srcRoot={srcRoot}
                setSrc={setSrc}

            />

            <TakePhotoModal
            showTakePhoto = {showTakePhoto}
            setShowTakePhoto={setShowTakePhoto}
            setSrc = {setSrc}
            setSrcRoot = {setSrcRoot}
            />





        </>
    );
};

export default PostModal;
