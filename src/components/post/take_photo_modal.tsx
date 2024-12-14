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

    const { showTakePhoto, setShowTakePhoto, setSrc, setSrcRoot } = props

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // 'user' is front camera, 'environment' is rear camera
    const [isFrontCamera, setIsFrontCamera] = useState<boolean> (true)

    useEffect(() => {
        if (showTakePhoto) {
            startCamera()
            console.log("mở camera")
        } else {
            stopCamera()
            console.log("tắt camera")
        }

    }, [showTakePhoto, facingMode])

    // Bắt đầu camera
    const startCamera = async () => {
        const constraints: MediaStreamConstraints = {
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                aspectRatio: 16 / 9, // Tỉ lệ khung hình góc rộng
                facingMode: facingMode
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
                // Lấy kích thước video thực tế
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                // Điều chỉnh kích thước canvas theo kích thước video
                canvas.width = videoWidth;
                canvas.height = videoHeight;

                // Lật canvas theo trục X
                if (isFrontCamera) {
                    context.translate(videoWidth, 0); // Di chuyển canvas
                    context.scale(-1, 1); // Lật ngược trên trục X
                }
              

                // Vẽ hình ảnh từ video vào canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Lấy dữ liệu ảnh dưới dạng Data URL
                const imageData = canvas.toDataURL("image/png");
                setSrc(imageData); // Lưu URL của ảnh vào state
                setSrcRoot(imageData);

                setShowTakePhoto(false);
                console.log("Chụp ảnh thành công")
            }
        }
    };

    // Hàm để đổi camera (xoay giữa camera trước và sau)
    const toggleCamera = () => {
        if (isFrontCamera){
            setIsFrontCamera(false)
        } else {
        setIsFrontCamera(true)
        }
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user')); // Đổi giữa camera trước và sau
      
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
                     style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }} 
                    
                    >
                    
                    </video>
                    <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

                </Modal.Body>
                <div className="div-btn-take-photo">
                    <div style={{width:"36px"}}>

                    </div>

                    <Button className="btn-take-photo"
                        onClick={() => { captureImage() }}
                    >
                        <i className="fa-solid fa-camera"></i>
                    </Button>

                    <Button className="btn-take-photo" style={{marginRight:"15px"}}
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