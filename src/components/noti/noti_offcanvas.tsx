"use client"
import Offcanvas from 'react-bootstrap/Offcanvas';
import "@/styles/noti_offcanvas.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnReadNotiTab from './unread_noti_tab';
import AllNotiTab from './all_noti_tab';
import { useEffect, useState } from "react"
import { getCurrentTime } from '@/utils/utils_time';
import API from '@/api/api';
import { FetchClientPostApi } from '@/api/fetch_client_api';
import Badge from 'react-bootstrap/Badge';
import { useSocketContext } from '@/context/socket_context';
import { getServerUTC } from '@/utils/utc_server_action';
interface IProps {
    showNoti: boolean
    numberOfNoti: number
    setShowNoti: (value: boolean) => void
    setNumberOfNoti: (value: number) => void
}

const NotiOffCanvas = (props: IProps) => {

    const { showNoti, setShowNoti, setNumberOfNoti, numberOfNoti } = props

    const [notiUnread, setNotiUnread] = useState<INotiResponse[]>([])
    const [notiAll, setNotiAll] = useState<INotiResponse[]>([])

    const [timeCurrent, setTimeCurrent] = useState<string>("")

    const [lockViewMoreNotiUnread, setLockViewMoreNotiUnread] = useState<boolean>(false)
    const [lockViewMoreNotiAll, setLockViewMoreNotiAll] = useState<boolean>(false)

    const [isLoadingNotiUnread, setIsloadingNotiUnread] = useState<boolean>(false)
    const [isLoadingNotiAll, setIsloadingNotiAll] = useState<boolean>(false)


    const [notiNew, setNotiNew] = useState<any>("unknow")

    const { subscribe } = useSocketContext();



    useEffect(() => {

        subscribe('/user/queue/noti', (message) => {
            const receivedMessage = JSON.parse(message.body);
            setNotiNew(receivedMessage)
            console.log('Notification received:', receivedMessage);
        });

    }, [])

    useEffect(() => {
        if (notiNew != "unknow") {
            const notiNewConvert: INotiResponse = notiNew
            setNumberOfNoti(numberOfNoti + 1)
            setNotiUnread((prevMessages) => [notiNewConvert, ...prevMessages]);
            setNotiAll((prevMessages) => [notiNewConvert, ...prevMessages]);
        }


    }, [notiNew])

    const fetchGetNotiUnread = async (pageCurrent: number) => {
      
        setIsloadingNotiUnread(true)
        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "unread",
        }

        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)

        if (res && res.status === 200) {

            const notis: INotiResponse[] = res.result


            if (notiUnread.length === 0) {
                setNumberOfNoti(res.totalItems)

            }


            // Tính toán updatedNotis trước khi cập nhật state
            const updatedNotis = [
                ...notiUnread,
                ...notis.filter((newNoti) => !notiUnread.some((existingNoti) => existingNoti.id === newNoti.id))
            ];

            // Kiểm tra điều kiện và cập nhật state nếu cần
            if (updatedNotis.length >= res.totalItems) {
                setLockViewMoreNotiUnread(true);
            }

            // Cập nhật notiUnread sau khi kiểm tra
            setNotiUnread(updatedNotis);

        }
        setIsloadingNotiUnread(false)
    }

    

    const fetchGetNotiAll = async (pageCurrent: number) => {
        setIsloadingNotiAll(true)
        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "all",
        }
        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)
        if (res && res.status === 200) {


            const notis: INotiResponse[] = res.result

            // Tính toán updatedNotis trước khi cập nhật state
            const updatedNotis = [
                ...notiAll,
                ...notis.filter((newNoti) => !notiAll.some((existingNoti) => existingNoti.id === newNoti.id))
            ];

            // Kiểm tra điều kiện và cập nhật state nếu cần
            if (updatedNotis.length >= res.totalItems) {
                setLockViewMoreNotiAll(true);
            }

            // Cập nhật notiUnread sau khi kiểm tra
            setNotiAll(updatedNotis);
        }
        setIsloadingNotiAll(false)
    }


    useEffect ( () => {
        const getTimeUTC = async () => {
            const time = await getServerUTC()
            setTimeCurrent(time)
        }
        getTimeUTC ()
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            setIsloadingNotiAll(true)
            setIsloadingNotiUnread(true)

            await fetchGetNotiAll(0)
            await fetchGetNotiUnread(0)

            setIsloadingNotiAll(false)
            setIsloadingNotiUnread(false)

        }

        if (timeCurrent != "") {
            fetchData()
        }

    }, [timeCurrent])




    return (
        <>
            <Offcanvas show={showNoti} onHide={() => setShowNoti(false)}
                scroll={true}
                backdrop={false}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <i className="fa-solid fa-bell"></i> Thông báo
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    <Tabs
                        defaultActiveKey="all"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="all" title="Tất cả">
                            <AllNotiTab
                                notiAll={notiAll}
                                fetchGetNotiAll={fetchGetNotiAll}
                                lockViewMoreNotiAll={lockViewMoreNotiAll}
                                isLoadingNotiAll={isLoadingNotiAll}
                            />
                        </Tab>

                        <Tab eventKey="unread" title={

                            <div className="d-flex align-items-center">
                                <span>Chưa đọc</span>
                                {numberOfNoti > 0 && <Badge bg="secondary" className="bg-noti ms-2">{numberOfNoti}</Badge>}
                            </div>

                        }>
                            <UnReadNotiTab
                                notiUnread={notiUnread}
                                fetchGetNotiUnread={fetchGetNotiUnread}
                                lockViewMoreNotiUnread={lockViewMoreNotiUnread}
                                isLoadingNotiUnread={isLoadingNotiUnread}

                            />
                        </Tab>


                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NotiOffCanvas
