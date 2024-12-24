"use client"

import { useState } from "react"
import SpinnerAnimation from "../shared/spiner_animation"
import ItemNoti from "./item_noti"
import { Button } from "react-bootstrap"

interface Props {
    notiAll: INotiResponse[]
    fetchGetNotiAll: (value: number) => void
    lockViewMoreNotiAll: boolean
}



const AllNotiTab = (props: Props) => {
    const { notiAll, fetchGetNotiAll, lockViewMoreNotiAll } = props

    const [isLoading, setIsloading] = useState<boolean>(false)

    const [pageCurrent, setPageCurrent] = useState<number>(0)


    const handleViewMoreAll = async () => {
        setIsloading(true)

        const pc = pageCurrent + 1;
        setPageCurrent(pc)
        await fetchGetNotiAll(pc)

        setIsloading(false)
    }


    return (
        <>
            {notiAll?.map((noti, index) => (

                <ItemNoti key={index}
                    noti={noti}
                />

            ))}

            <div className="div-view-more">
                {isLoading ? (
                    <SpinnerAnimation />
                ) : (
                    !lockViewMoreNotiAll && (
                        <Button className="btn-view-more" variant="outline-dark"
                            onClick={() => { handleViewMoreAll() }}
                        >Xem thêm</Button>
                    )
                )}
            </div>
        </>
    )
}
export default AllNotiTab