"use client"

import ItemNoti from "./item_noti"
import { useState } from "react"
import { Button } from "react-bootstrap"
import SpinnerAnimation from "../shared/spiner_animation"

interface Props {
    notiUnread: INotiResponse[],
    fetchGetNotiUnread: (value: number) => void
    lockViewMoreNotiUnread: boolean
    isLoadingNotiUnread: boolean
    setNotiAll: (value: INotiResponse[]) => void
    notiAll: INotiResponse[]
    numberOfItemRemove:number;
    setNumberOfItemRemove: (value : number) => void
}

const UnReadNotiTab = (props: Props) => {


    const { notiUnread, 
        fetchGetNotiUnread, 
        lockViewMoreNotiUnread, 
        isLoadingNotiUnread,
         setNotiAll, notiAll, 
         numberOfItemRemove,
          setNumberOfItemRemove,} = props



    const [pageCurrent, setPageCurrent] = useState<number>(1)


    const handleViewMoreUnread = async () => {


        const pc = pageCurrent + 1;
        setPageCurrent(pc)
        await fetchGetNotiUnread(pc)
    }

    const handleChangeStatus = (notiRes: INotiResponse) => {
        if ( notiRes.status!= "read" ) {
            setNumberOfItemRemove(numberOfItemRemove + 1)
            notiRes.status = "read"

            const notiNew:INotiResponse[] =[]
            for (let i=0; i< notiAll.length ; i++)
            {
                if(notiAll[i].id == notiRes.id ) {
                    notiAll[i].status = "read"
                }
                notiNew.push(notiAll[i])
            }
            setNotiAll(notiNew)
        }
    }


    return (
        <>
            {notiUnread?.map((noti, index) => (

                <div key={index}
                    onClick={() => { handleChangeStatus(noti) }}
                >
                    <ItemNoti
                        noti={noti}
                    />
                </div>



            ))}

            <div className="div-view-more">
                {isLoadingNotiUnread ? (
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