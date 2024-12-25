"use client"
import "@/styles/item_noti.css"
import { GetImage } from "@/utils/handle_images"
import { formatDate } from "@/utils/utils_time"
import Image from "next/image"

interface Props {
    noti:INotiResponse
}

const ItemNoti = ( props:Props) => {
    const {noti} = props
    return (
        <>
            <div className="div-item mb-1">
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
                  {noti.status === "unread" &&  <i className="fa-solid fa-rss"></i> } 
                </div>

            </div>
        </>
    )
}

export default ItemNoti