"use client"
import "@/styles/item_noti.css"
import Image from "next/image"



const ItemNoti = () => {
    return (
        <>
            <div className="div-item">
                <Image
                    src={"/images/avatar.jpg"}
                    width={70}
                    height={70}
                    alt='error'
                    className="img-custom"
                />

                <div className="div-caption-createat">
                    <div className="caption">
                        Lê Ngọc Dương đã thêm một ảnh mới.

                    </div>
                    <div className="createat fw-bold">
                        11:20 22-06-2003
                    </div>
                </div>
                <div className="icon-unread">
                    <i className="fa-solid fa-rss"></i>
                </div>

            </div>
        </>
    )
}

export default ItemNoti