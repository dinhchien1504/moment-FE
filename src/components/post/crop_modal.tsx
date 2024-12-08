"use client"
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import getCroppedImg from "@/components/post/crop_image.js"
import Cropper from 'react-easy-crop'
import { useState } from "react";
import { Slider, Typography } from "@mui/material";
import "@/styles/crop_modal.css"

interface IProps {
    showCrop: boolean;
    setShowCrop: (value: boolean) => void;
    setSrc: (value: string) => void;
    srcRoot: any

}
const CropModal = (props: IProps) => {
    const { showCrop, setShowCrop, srcRoot, setSrc } = props


    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const showCroppedImage = async () => {

        try {
            const croppedImage = await getCroppedImg(
                srcRoot,
                croppedAreaPixels,
                rotation
            )
            console.log('donee >>>> ', { croppedImage })
            setSrc(croppedImage)
            setShowCrop(false)
        } catch (e) {
            console.error(e)
        }
    }


    return (
        <>
            <Modal
                show={showCrop}
                size={"xl"}
                onHide={() => {
                    setShowCrop(false);
                }}
                aria-labelledby="contained-modal-title-vcenter"
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cắt ảnh</Modal.Title>

                </Modal.Header>
                <Modal.Body className="md-bd-crop">
                    <div>
                        <Cropper
                            image={srcRoot}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                </Modal.Body>

                <Modal.Footer className="mdl-footer">

                    <Typography
                        variant="overline"
                    >
                        Phóng to thu nhỏ
                    </Typography>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => setZoom(Number(zoom))}
                        style={{color:"black"}}
                    />

                    <Typography
                        variant="overline"
                    >
                        Xoay
                    </Typography>
                    <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={(e, rotation) => setRotation(Number(rotation))}
                        style={{color:"black"}}
                    />
                    <Button className="btn-crop"
                        onClick={() => { showCroppedImage() }}
                    >Cắt ảnh</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default CropModal