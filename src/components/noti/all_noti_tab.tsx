"use client"

import { useState } from "react"
import SpinnerAnimation from "../shared/spiner_animation"
import ItemNoti from "./item_noti"
import { Button } from "react-bootstrap"

interface Props {
    notiAll: INotiResponse[]
    fetchGetNotiAll: (value: number) => void
    lockViewMoreNotiAll: boolean
    isLoadingNotiAll:boolean
}



const AllNotiTab = (props: Props) => {
    const { notiAll, fetchGetNotiAll, lockViewMoreNotiAll, isLoadingNotiAll } = props



    const [pageCurrent, setPageCurrent] = useState<number>(0)


    const handleViewMoreAll = async () => {
 
        const pc = pageCurrent + 1;
        setPageCurrent(pc)
        await fetchGetNotiAll(pc)


    }


    return (
        <>
            {notiAll?.map((noti, index) => (

                <ItemNoti key={index}
                    noti={noti}
                />

            ))}

            <div className="div-view-more">
                {isLoadingNotiAll ? (
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