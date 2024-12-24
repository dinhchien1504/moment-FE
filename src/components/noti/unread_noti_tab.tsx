"use client"

import ItemNoti from "./item_noti"
import Stomp from "stompjs"
import SockJS from 'sockjs-client'
import { useEffect, useState } from "react"
import cookie from "js-cookie";
import { Button } from "react-bootstrap"
import SpinnerAnimation from "../shared/spiner_animation"

interface Props {
    notiUnread: INotiResponse[],
    fetchGetNotiUnread: (value: number) => void
    lockViewMoreNotiUnread: boolean
}

const UnReadNotiTab = (props: Props) => {

    const { notiUnread, fetchGetNotiUnread, lockViewMoreNotiUnread } = props

    const [isLoading, setIsloading] = useState<boolean>(false)

    const [pageCurrent, setPageCurrent] = useState<number>(0)


    const handleViewMoreUnread = async () => {
        setIsloading(true)

        const pc = pageCurrent + 1;
        setPageCurrent(pc)
        await fetchGetNotiUnread(pc)

        setIsloading(false)
    }


    return (
        <>
            {notiUnread?.map((noti, index) => (

                <ItemNoti key={index}
                    noti={noti}
                />

            ))}

            <div className="div-view-more">
                {isLoading ? (
                    <SpinnerAnimation />
                ) : (
                    !lockViewMoreNotiUnread && (
                        <Button className="btn-view-more" variant="outline-dark"
                            onClick={() => { handleViewMoreUnread() }}
                        >Xem thêm</Button>
                    )
                )}
            </div>


        </>
    )
}
export default UnReadNotiTab