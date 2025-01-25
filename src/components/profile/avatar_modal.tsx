"use client"
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "@/styles/avt_modal.css"
import { handlePreviewImg, handleUploadImg } from '@/utils/handle_images';
import { useLoadingContext } from '@/context/loading_context';
import { FetchClientPostApi } from '@/api/fetch_client_api';
import API from '@/api/api';
import { useUserContext } from '@/context/user_context';
interface IProps {
    showAvtModal: boolean,
    setShowAvtModal: (value: boolean) => void
    profileRespone:IProfileResponse
}

const AvatarModal = (props: IProps) => {

    const { showAvtModal, setShowAvtModal,profileRespone } = props
    const [file, setFile] = useState<File | null>(null);
    const {startLoadingSpiner, stopLoadingSpiner} = useLoadingContext()
    const {fetchGetUser} = useUserContext()

    const handleFileChange = async (event: any) => {
        const file = event.target.files?.[0];
        setFile(file)
    }
    const handleDeleteAvt = () => {
        setFile(null)
    }

    const handleChangeAvatar = async () => {
        startLoadingSpiner()
        if (file) {
            const res = await handleUploadImg(file)
            // lưu thành công ảnh trên cloundy
            if (res.public_id) {
              const postRequest: PostRequest = {
                url: res.public_id,
                caption: ""
              }
              const resPost = await FetchClientPostApi(API.PROFILE.CHANGE_AVT, postRequest)
              if (resPost && resPost.status === 200) { 
                profileRespone.urlAvt = res.public_id
                await fetchGetUser()
                setShowAvtModal(false)
                setFile(null)
              }
           
            }
      
        }
        stopLoadingSpiner()
    }

    const handleCloseChangeAvt = () => {
        setFile(null)
        setShowAvtModal(false)
    }

    return (
        <>


            <Modal
                show={showAvtModal}
                onHide={() => { handleCloseChangeAvt() }}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật ảnh đại diện</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='div-img-btn'>
                        <img
                            style={{
                                display: "block",
                                maxWidth: "100%",
                            }}
                            src={handlePreviewImg(file)}
                            className="img-change-avatar"
                        />
                        <div className='div-add-delete'>
                            <input
                                type="file"
                                accept="image/*"
                                id="fileInputAvt"
                                hidden
                                onChange={(e) => {
                                    handleFileChange(e);
                                }}
                            />

                            <label
                                htmlFor="fileInputAvt"
                                typeof="button"
                                className="label-img-avt"
                            >
                                {/* <Button variant='dark'> */}
                                    <i className="fa-solid fa-plus"></i> Thêm ảnh
                                {/* </Button> */}
                            </label>
                             {file &&   <Button  variant='light' className='delete-img-avt'
                             onClick={() => {handleDeleteAvt()}}
                             >Xóa ảnh</Button>}
                
                          
                        </div>
                    </div>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => { handleCloseChangeAvt() }} className='btn-close-avt-modal'>
                        Đóng
                    </Button>
                    {file && <Button variant="dark"
                    onClick={() => {handleChangeAvatar()}}
                    >Lưu</Button> }
                   
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AvatarModal