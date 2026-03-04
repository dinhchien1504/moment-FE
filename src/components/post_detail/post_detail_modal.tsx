"use client"
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { usePathname, useSearchParams } from 'next/navigation';
import { FetchClientGetApi } from '@/api/fetch_client_api';
import API from '@/api/api';
import "@/styles/post_detail_modal.css"
import { GetImage } from '@/utils/handle_images';
import Image from "next/image";
import SpinnerAnimation from '../shared/spiner_animation';
import Link from 'next/link';
import CommentPhotoSection from '../home/comment-photo-section';

const PostDetailModal = () => {

    const [showPostDetail, setShowPostDetail] = useState<boolean>(false)

    const [photoResponse, setPhotoResponse] = useState<IPhotoResponse>()
    const [postIsExist, setPostIsExist] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const searchParams = useSearchParams();
    const pathName = usePathname()

      // useState cho modal ảnh
  const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getPhoto = async () => {
            setIsLoading(true)
            setShowPostDetail(true)
            const newPost = searchParams.get('post');
            const res = await FetchClientGetApi(`${API.PHOTO.LIST}?post=${newPost}`)
            if (res && res.status === 200) {

                const photo: IPhotoResponse = res.result
                setPhotoResponse(photo)
                setPostIsExist(true)
            } else {
                setPostIsExist(false)
            }
            setIsLoading(false)
        }

        if (searchParams.size > 0) {
            getPhoto()
        } else {
            setShowPostDetail(false)
        }

    }, [searchParams])

    const handleClosePostDetail = () => {
        window.history.pushState({}, '', `${pathName}`);
    }

    const openModal = () => {
        setIsModalOpen(true);
      };
      const closeModal = () => {
        setIsModalOpen(false);
      };
    return (
        <>
            <Modal
                show={showPostDetail} onHide={() => { handleClosePostDetail() }}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isModalOpen && (
                        <div
                            className="modal-custom-overlay-detail position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center"
                            onClick={closeModal}
                        >
                            <div
                                className="modal-custom-content-detail position-relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img src={GetImage(photoResponse?.urlPhoto)} alt="" className="zoomed-image-detail" />
                                <div className="modal-close-detail" onClick={closeModal}>
                                    X
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading ? (<>
                        <div className='div-post-spiner' >
                            <SpinnerAnimation />
                        </div>
                    </>) : (
                        postIsExist ? (<>
                        
                            <div
                            >
                                <img
                                    src={GetImage(photoResponse?.urlAvt)}
                                    width={50}
                                    height={50}
                                    alt="Dropdown Trigger"
                                    className="img-avatar-item-detail"
                                />
                            <Link className="text-black hover-text-decoration-underline" href={`/${photoResponse?.userName}`}>{photoResponse?.name}</Link>
                            </div>
                            <div className="post-caption-detail px-2 py-1">
                                <p className="m-0 text-align-start">{photoResponse?.caption}</p>
                            </div>
                            <div className="div-img-capture-detail">
                                <img
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                    }}
                                    src={GetImage(photoResponse?.urlPhoto)}
                                    className="img-capture-detail"
                                    onClick={() => {
                                        openModal();
                                    }}
                                />
                            </div>
                            <div>
                                <div className="d-flex justify-content-between px-2 mt-2">
                                    <h3 className="offcanvas-title" id="offcanvasLabel">
                                        Bình luận
                                    </h3>
                                </div>
                                    <CommentPhotoSection photoId={Number(photoResponse?.id)}/>
                            </div>
                          
                        </>) : (<>
                            <div className='div-post-not-exist'>
                                <Image src={"/images/error.jpg"}
                                    width={300}
                                    height={300}
                                    alt="error"
                                />
                                <h5 className="mb-4" >Rất tiếc, bài viết này không tồn tại hoặc bạn không có quyền xem.</h5>
                            </div>

                        </>)

                    )}

                </Modal.Body>

            </Modal>
        </>
    )
}

export default PostDetailModal
