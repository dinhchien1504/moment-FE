"use client"
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "@/styles/take_photo_modal.css"
import React, { useEffect, useRef, useState } from "react";
interface IProps {
    showTakePhoto: boolean;
    setShowTakePhoto: (value: boolean) => void;
    setFilePreview: (value: File) => void;
    setFileRoot: (value: File) => void;


}

const TakePhotoModal = (props: IProps) => {

    const { showTakePhoto, setShowTakePhoto, setFilePreview, setFileRoot } = props

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    // const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // 'user' is front camera, 'environment' is rear camera
    const [turnOver, setTurnOver] = useState<boolean>(false)


    useEffect(() => {
        if (showTakePhoto) {
            startCamera()
            console.log("mở camera")
        } else {
            stopCamera()
            console.log("tắt camera")
        }
        setTurnOver(false)
    }, [showTakePhoto])

    // Bắt đầu camera
    const startCamera = async () => {
        const constraints: MediaStreamConstraints = {
            video:true
        };

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Lỗi khi truy cập camera:", error);
        }
    };

    // Tắt camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };


    // Chụp ảnh
    const captureImage = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");

            if (context) {
                // Lấy kích thước video
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                canvas.width = videoWidth;
                canvas.height = videoHeight;

                // Lật canvas nếu cần
                if (!turnOver) {
                    context.translate(videoWidth, 0);
                    context.scale(-1, 1);
                }

                // Vẽ video vào canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Chuyển đổi canvas thành Blob
                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((fileBlob) => {
                        resolve(fileBlob);
                    }, "image/png");
                });

                if (blob) {
                    // Tạo file từ Blob
                    const imageFile = new File([blob], "captured_image.png", { type: "image/png" });


                    setFileRoot(imageFile)
                    setFilePreview(imageFile)

                    setShowTakePhoto(false);
                    console.log("Chụp ảnh thành công");
                } else {
                    console.error("Không thể tạo Blob từ canvas");
                }
            }
        }
    };



    // Hàm để đổi camera (xoay giữa camera trước và sau)
    const toggleCamera = () => {

        if (turnOver) {
            setTurnOver(false)
        } else {
            setTurnOver(true)
        }

    };

    return (
        <>
            <Modal
                show={showTakePhoto}
                size={"xl"}
                onHide={() => {
                    setShowTakePhoto(false);
                }}
                aria-labelledby="contained-modal-title-vcenter"
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chụp ảnh</Modal.Title>

                </Modal.Header>
                <Modal.Body className="md-bd-take-photo" >
                    <video ref={videoRef} className="video" autoPlay
                        style={{ transform: !turnOver ? 'scaleX(-1)' : 'none' }}

                    >

                    </video>
                    <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

                </Modal.Body>
                <div className="div-btn-take-photo">
                    <div style={{ width: "36px" }}>

                    </div>

                    <Button className="btn-take-photo"
                        onClick={() => { captureImage() }}
                    >
                        <i className="fa-solid fa-camera"></i>
                    </Button>

                    <Button className="btn-take-photo" style={{ marginRight: "15px" }}
                        onClick={() => { toggleCamera() }}
                    >
                        <i className="fa-solid fa-repeat"></i>
                    </Button>
                </div>


            </Modal>

        </>
    )
}

export default TakePhotoModal