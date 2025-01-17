"use client"
import "@/styles/item_noti.css"
import { GetImage } from "@/utils/handle_images"
import { formatDate } from "@/utils/utils_time"
import Image from "next/image"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
interface Props {
    noti:INotiResponse
}

const ItemNoti = ( props:Props) => {
    const {noti} = props

    const router = useRouter()
    const pathName  = usePathname()

    const searchParams = useSearchParams();
    const post = searchParams.get('post')

    const handleShowPostDetail = (slug:string) => {
        router.push(`${pathName}?post=${slug}`)
    }

    return (
        <>
            <div className="div-item mb-1"
            onClick={ ()  => {handleShowPostDetail (noti.slug)}}
            >
                <img
                    src={GetImage(noti.urlAvt)}
                    width={70}
                    height={70}
                    alt='error'
                    className="img-custom"
                />

                <div className="div-caption-createat">
                    <div className="caption">
                       {noti.message}

                    </div>
                    <div className="createat fw-bold fst-italic">
                      {formatDate(noti.createdAt)}
                    </div>
                </div>
                <div className="icon-unread">
                  {noti.status === "read" ? "" : <i className="fa-solid fa-rss"></i> } 
                </div>

            </div>
        </>
    )
}

export default ItemNoti