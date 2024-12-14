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
import { UploadImages } from "@/utils/upload_images";
import { GetImage } from "@/utils/get_images";
import Image from "next/image";
import Dropdown from 'react-bootstrap/Dropdown';
import { FetchClientPostApi } from "@/api/fetch_client_api";
import API from "@/api/api";
import { startLoading, stopLoading } from "../shared/nprogress";

interface IProps {
    showPost: boolean;
    setShowPost: (value: boolean) => void;
}

const PostModal = (props: IProps) => {
    const { user } = useUserContext();
    const { showPost, setShowPost } = props;

    const [srcRoot, setSrcRoot] = useState<any>("") // cai nay la anh chup man hinh kh cat
    const [src, setSrc] = useState<any>("") // cai nay la anh da cat

    const [showCrop, setShowCrop] = useState<boolean>(false)
    const [showTakePhoto, setShowTakePhoto] = useState<boolean>(false)

    const [caption,setCaption] =useState<string>("")

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
        setSrc("")
        setSrcRoot("")
    }

    const handlePost = async () => {
        startLoading()

        if (src != "") {
            const res = await UploadImages(src)
            // lưu thành công ảnh trên cloundy
            if (res.public_id) {
                const postRequest:PostRequest = {
                    url: res.public_id,
                    caption: caption
                }

                const resPost = await FetchClientPostApi(API.POST.POST, postRequest)
                if (resPost && resPost.status === 200) {
                    setShowPost(false)
                    setCaption("")
                    setSrc("")
                    setSrcRoot("")
                }
            }
        }


        stopLoading()
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
                            <Button
                                onClick={() => { setShowTakePhoto(true) }}

                                className="btn-screen-shot">
                                <i className="fa-solid fa-camera"></i>

                            </Button>

                            <Button onClick={() => { handleCaptureScreen() }} className="btn-screen-shot">
                                <i className="fa-regular fa-image"></i>

                            </Button>

                            {src != "" &&
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
                            src={src}
                            onError={(e) => {
                                e.currentTarget.src = "/images/unnamed.png";
                            }}
                            className="img-capture"
                        />
                    </div>

                    <div className="div-caption">
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="Nêu cảm nghĩ của bạn" 
                        onChange={(e) => {setCaption(e.target.value)}}
                        />
                        <Form.Control.Feedback type="invalid" className='mt-0'>
                            {"Vui lòng điền tài khoản."}
                        </Form.Control.Feedback>
                    </div>





                </Modal.Body>
                <Modal.Footer className="mdl-footer">
                    <Button className={`btn-post`}
                        disabled={src === ""}
                        onClick={() => { handlePost() }}
                    >Đăng</Button>
                </Modal.Footer>
            </Modal >

            <CropModal
                setShowCrop={setShowCrop}
                showCrop={showCrop}
                srcRoot={srcRoot}
                setSrc={setSrc}

            />

            <TakePhotoModal
                showTakePhoto={showTakePhoto}
                setShowTakePhoto={setShowTakePhoto}
                setSrc={setSrc}
                setSrcRoot={setSrcRoot}
            />





        </>
    );
};

export default PostModal;
