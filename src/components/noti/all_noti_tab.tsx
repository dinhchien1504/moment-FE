"use client"

import { useState } from "react"
import SpinnerAnimation from "../shared/spiner_animation"
import ItemNoti from "./item_noti"
import { Button } from "react-bootstrap"

interface Props {
    notiAll: INotiResponse[]
    fetchGetNotiAll: (value: number) => void
    lockViewMoreNotiAll: boolean
    isLoadingNotiAll: boolean
    setNotiUnread: (value: INotiResponse[]) => void
    notiUnread: INotiResponse[]

    numberOfItemRemove:number;
    setNumberOfItemRemove: (value : number) => void
}



const AllNotiTab = (props: Props) => {
    const { notiAll, 
        fetchGetNotiAll, 
        lockViewMoreNotiAll, 
        isLoadingNotiAll, 
        setNotiUnread, 
        notiUnread, 
        numberOfItemRemove, 
        setNumberOfItemRemove
     } = props


    const [pageCurrent, setPageCurrent] = useState<number>(1)


    const handleViewMoreAll = async () => {

        const pc = pageCurrent + 1;
        setPageCurrent(pc)
        await fetchGetNotiAll(pc)


    }

    const handleChangeStatus = (notiRes: INotiResponse) => {
        if (notiRes.status != "read") {
            setNumberOfItemRemove(numberOfItemRemove + 1)
            notiRes.status = "read"

            const notiNew:INotiResponse[] =[]
            for (let i=0; i< notiUnread.length ; i++)
            {
                if(notiUnread[i].id != notiRes.id ) {
                    notiNew.push(notiUnread[i])
                }
            }
            setNotiUnread(notiNew)
        }

    
    }


    return (
        <>
            {notiAll?.map((noti, index) => (
                <div  key={index}
                    onClick={() => { handleChangeStatus(noti) }}
                >
                    <ItemNoti
                        noti={noti}
                    />
                </div>


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