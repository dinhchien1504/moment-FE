"use client"
import Offcanvas from 'react-bootstrap/Offcanvas';
import "@/styles/noti_offcanvas.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnReadNotiTab from './unread_noti_tab';
import AllNotiTab from './all_noti_tab';
import { useEffect, useRef, useState } from "react"
import API from '@/api/api';
import { FetchClientGetApi, FetchClientPostApi } from '@/api/fetch_client_api';
import { useSocketContext } from '@/context/socket_context';
import "@/styles/noti_offcanvas.css";
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

    const [numberOfItemRemove, setNumberOfItemRemove] = useState <number> (0)

    const numberOfNotiUnread = useRef<number>(0);
    const numberOfNotiAll = useRef<number>(0);



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
        if (notiNew != "unknow" && (JSON.stringify(notiNew) != JSON.stringify(notiUnread[0]))) {
            const notiNewConvert: INotiResponse = notiNew
            setNumberOfNoti(numberOfNoti + 1)
            setNotiUnread((prevMessages) => [notiNewConvert, ...prevMessages]);
            setNotiAll((prevMessages) => [notiNewConvert, ...prevMessages]);
        }


    }, [notiNew])


    const handleOffset = (pageCurrent:number, itemRemove :number) => {
        const fromIndex: number = (pageCurrent - 1) * 6 - itemRemove;
        return fromIndex > 0 ? fromIndex : 0; // Offset không được âm
    }

    const fetchGetNotiUnread = async (pageCurrent: number) => {

        setIsloadingNotiUnread(true)

        const adjustedLimit = 6 + numberOfItemRemove;
    
        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "unread",
            limit : adjustedLimit,
            offset: handleOffset(pageCurrent, numberOfItemRemove)
        }

        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)

        if (res && res.status === 200) {

            const notis: INotiResponse[] = res.result


            // Tính toán updatedNotis trước khi cập nhật state
            const updatedNotis = [
                ...notiUnread,
                ...notis.filter((newNoti) => !notiUnread.some((existingNoti) => existingNoti.id === newNoti.id))
            ];



            // Cập nhật notiUnread sau khi kiểm tra
            setNotiUnread(updatedNotis);
            setNumberOfItemRemove(0)
          
            numberOfNotiUnread.current =  numberOfNotiUnread.current - notis.length
            console.log("numberOfNotiUnread trong fetch >>> ", numberOfNotiUnread.current)
        }
        setIsloadingNotiUnread(false)
    }



    const fetchGetNotiAll = async (pageCurrent: number) => {
        setIsloadingNotiAll(true)
        const adjustedLimit = 6
        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "all",
            limit : adjustedLimit,
            offset: handleOffset(pageCurrent, 0)
        }
        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)
        if (res && res.status === 200) {


            const notis: INotiResponse[] = res.result

            // Tính toán updatedNotis trước khi cập nhật state
            const updatedNotis = [
                ...notiAll,
                ...notis.filter((newNoti) => !notiAll.some((existingNoti) => existingNoti.id === newNoti.id))
            ];



            // Cập nhật notiUnread sau khi kiểm tra
            setNotiAll(updatedNotis);
            numberOfNotiAll.current =  numberOfNotiAll.current - notis.length
        }
        setIsloadingNotiAll(false)
    }


    const fetchCountNoti = async () => {

        const res = await FetchClientGetApi(`${API.NOTI.COUNT_NOTI}?time=${timeCurrent}`)
        if (res && res.status === 200) {
           const numberOfNotiRes:INumberOfNotiResponse = res.result;
           setNumberOfNoti(numberOfNotiRes.numberOfNotiNew)
          numberOfNotiAll.current = numberOfNotiRes.numberOfNotiAll
          numberOfNotiUnread.current = numberOfNotiRes.numberOfNotiUnread
        }
    }

    useEffect(() => {
        const getTimeUTC = async () => {
            const time = await getServerUTC()
            setTimeCurrent(time)
        }
        getTimeUTC()
    }, [])

    useEffect(() => {
        console.log("numberOfNotiUnread.current trong useEffect >>> ", numberOfNotiUnread.current)
        if (   numberOfNotiUnread.current   === 0) {
            setLockViewMoreNotiUnread(true);
        } else {
            setLockViewMoreNotiUnread(false);
        }

    }, [notiUnread.length])

    useEffect(() => {


        if (numberOfNotiAll.current === 0) {
            setLockViewMoreNotiAll(true);
        } else {
            setLockViewMoreNotiAll(false);
        }

    }, [notiAll.length])

    // ---------------------------------

    useEffect(() => {


        const fetchSaveNotiView = async () => {

            const ids: number[] = []
            for (let i = 0; i < notiAll.length; i++) {
                if (notiAll[i].status === "new" && !ids.includes(notiAll[i].id)) {
                    ids.push(notiAll[i].id)

                }
            }

            for (let j = 0; j < notiUnread.length; j++) {
                if (notiUnread[j].status === "new" && !ids.includes(notiUnread[j].id)) {
                    ids.push(notiUnread[j].id)

                }
            }

            if (ids.length > 0) {
                // fetch api gửi ids để lưu 
                const notiViewReq: INotiViewRequest = {
                    notiIds: ids
                }
                console.log("notiViewReq >>> ", notiViewReq)
                setNumberOfNoti(numberOfNoti - ids.length)

                const res = await FetchClientPostApi(API.NOTI_VIEW.NOTI_VIEW, notiViewReq)

                if (res && res.status === 200) {
                    // set lai du lieu sau khi lưu
                    setNotiAll(prevNotiAll =>
                        prevNotiAll.map(noti =>
                            ids.includes(noti.id) ? { ...noti, status: 'unread' } : noti
                        )
                    );

                    setNotiUnread(prevNotiUnread =>
                        prevNotiUnread.map(noti =>
                            ids.includes(noti.id) ? { ...noti, status: 'unread' } : noti
                        )
                    );

                    console.log("ids >>> ", ids)
                }
            }


        }

        if (showNoti) {
            fetchSaveNotiView()
        }

    }, [showNoti, notiAll.length, notiUnread.length])

    // ---------------------------------





    useEffect(() => {
        const fetchData = async () => {
            setIsloadingNotiAll(true)
            setIsloadingNotiUnread(true)

            await fetchCountNoti()
            await fetchGetNotiAll(0)
            await fetchGetNotiUnread(0)

            setIsloadingNotiAll(false)
            setIsloadingNotiUnread(false)

        }

        if (timeCurrent != "") {
            fetchData()
        }

    }, [timeCurrent])

    const handleDeteleUnread = () => {
        setNotiUnread(prevNotiUnread => {
            // Kiểm tra xem có phần tử nào có status là 'read' không
            const hasReadStatus = prevNotiUnread.some(noti => noti.status === 'read');
        
            if (hasReadStatus) {
                // Nếu có phần tử có status 'read', tiến hành lọc
                return prevNotiUnread.filter(noti => noti.status !== 'read');
            }
        
            // Nếu không có phần tử có status 'read', giữ nguyên prevNotiUnread
            return prevNotiUnread;
        });
    }

    useEffect(() => {
        if (showNoti === false) { 
            handleDeteleUnread ()
        }
    }, [showNoti])


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
                        onSelect={(key) => {
                            if (key === "all") {
                                handleDeteleUnread(); // Xử lý khi tab "Tất cả" được chọn
                            } 
                        }}
                    >
                        <Tab eventKey="all" title="Tất cả"
                           
                        >
                            <AllNotiTab
                                notiAll={notiAll}
                                fetchGetNotiAll={fetchGetNotiAll}
                                lockViewMoreNotiAll={lockViewMoreNotiAll}
                                isLoadingNotiAll={isLoadingNotiAll}
                                setNotiUnread = {setNotiUnread}
                                notiUnread={notiUnread}
                                numberOfItemRemove = {numberOfItemRemove}
                                setNumberOfItemRemove = {setNumberOfItemRemove}
                            />
                        </Tab>

                        <Tab eventKey="unread" title={

                            <div className="d-flex align-items-center">
                                <span>Chưa đọc</span>
                                {/* {numberOfNoti > 0 && <Badge bg="secondary" className="bg-noti ms-2">{numberOfNoti}</Badge>} */}
                            </div>

                        }
                           
                        >
                            <UnReadNotiTab
                                notiUnread={notiUnread}
                                fetchGetNotiUnread={fetchGetNotiUnread}
                                lockViewMoreNotiUnread={lockViewMoreNotiUnread}
                                isLoadingNotiUnread={isLoadingNotiUnread}
                                setNotiAll = {setNotiAll}
                                notiAll={notiAll}
                                numberOfItemRemove = {numberOfItemRemove}
                                setNumberOfItemRemove = {setNumberOfItemRemove}

                            />
                        </Tab>


                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NotiOffCanvas
