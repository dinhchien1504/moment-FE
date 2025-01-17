"use client"
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { usePathname, useSearchParams } from 'next/navigation';
import { FetchClientGetApi } from '@/api/fetch_client_api';
import API from '@/api/api';
import "@/styles/post_detail_modal.css"
import { useRouter } from 'next/navigation';
import { GetImage } from '@/utils/handle_images';
import Image from "next/image";
import SpinnerAnimation from '../shared/spiner_animation';
import { useLoadingContext } from '@/context/loading_context';

interface IProps {
    setShowPostDetail : (value :boolean) => void
    showPostDetail :boolean
}

const PostDetailModal = (props : IProps) => {
    const {setShowPostDetail, showPostDetail} = props
    
    // const [showPostDetail, setShowPostDetail] = useState<boolean>(false)

    const [photoResponse, setPhotoResponse] = useState<IPhotoResponse>()
    const [postIsExist, setPostIsExist] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const searchParams = useSearchParams();
    const post = searchParams.get('post')
    const router = useRouter()
    const pathName = usePathname()
    const {startLoadingSpiner, stopLoadingSpiner} = useLoadingContext()

    useEffect(() => {

        const getPhoto = async () => {
            // stopLoadingSpiner()
            setIsLoading(true)
            setShowPostDetail(true)
            const res = await FetchClientGetApi(`${API.PHOTO.LIST}?post=${post}`)
            if (res && res.status === 200) {
               
                const photo: IPhotoResponse = res.result
                setPhotoResponse(photo)
                console.log("post >>> ", photo)
                setPostIsExist(true)

            } else {
                setPostIsExist(false)
            }
            setIsLoading(false)
        }

        if (post != null) {
            getPhoto()
        }
    }, [showPostDetail])

    const handleClosePostDetail = () => {
        setShowPostDetail(false)
        router.push(pathName)
    }



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
                    {isLoading ? (<>
                        <div className='div-post-spiner' >
                            <SpinnerAnimation />
                        </div>
                    </>) : (
                        postIsExist ? (<>
                            <div>
                                <img
                                    src={GetImage(photoResponse?.urlAvt)}
                                    width={50}
                                    height={50}
                                    alt="Dropdown Trigger"
                                    className="img-avatar-item-detail"
                                />
                                {photoResponse?.name}
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
                                />
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
