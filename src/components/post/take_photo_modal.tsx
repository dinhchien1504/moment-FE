"use client"
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "@/styles/take_photo_modal.css"
import React, { useEffect, useRef, useState } from "react";
interface IProps {
    showTakePhoto: boolean;
    setShowTakePhoto: (value: boolean) => void;

    setSrc: (value: any) => void;
    setSrcRoot: (value: any) => void;
}

const TakePhotoModal = (props: IProps) => {

    const { showTakePhoto, setShowTakePhoto,setSrc,setSrcRoot } = props

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (showTakePhoto) {
            startCamera()
            console.log("mở camera")
        } else {
            stopCamera()
            console.log("tắt camera")
        }

    }, [showTakePhoto])

    // Bắt đầu camera
    const startCamera = async () => {
        const constraints: MediaStreamConstraints = {
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              aspectRatio: 16 / 9, // Tỉ lệ khung hình góc rộng
            },
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
    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL("image/png");
                setSrc(imageData); // Lưu URL của ảnh vào state
                setSrcRoot(imageData)

                setShowTakePhoto(false)
                console.log("Chụp ")
            }
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
                    <video ref={videoRef} className="video" autoPlay></video>
                    <canvas ref={canvasRef} width="1920" height="1080" style={{ display: "none" }}></canvas>

                </Modal.Body>
                <div className="div-btn-take-photo">
                    <Button className="btn-take-photo"
                    onClick={() => {captureImage()}}
                    >
                        <i className="fa-solid fa-camera"></i>  Chụp ảnh</Button>

                </div>

            </Modal>

        </>
    )
}

export default TakePhotoModal