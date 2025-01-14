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



const PostDetailModal = () => {
    const [showPostDetail, setShowPostDetail] = useState<boolean>(false)

    const [photoResponse, setPhotoResponse] = useState<IPhotoResponse>()

    const searchParams = useSearchParams();
    const post = searchParams.get('post')
    const router = useRouter()
    const pathName  = usePathname()

    useEffect(() => {

        const getPhoto = async () => {
            const res = await FetchClientGetApi(`${API.PHOTO.LIST}?post=${post}`)
            if (res && res.status === 200) {
                setShowPostDetail(true)

                const photo: IPhotoResponse = res.result
                setPhotoResponse(photo)
                console.log("post >>> ", photo)

            } else {

            }

        }

        if (post != null) {
            getPhoto()
        }
    }, [post])

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


                </Modal.Body>

            </Modal>
        </>
    )
}

export default PostDetailModal