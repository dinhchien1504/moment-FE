"use client"
import Offcanvas from 'react-bootstrap/Offcanvas';
import "@/styles/noti_offcanvas.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnReadNotiTab from './unread_noti_tab';
import AllNotiTab from './all_noti_tab';
import { useRouter } from 'next/navigation';
import Stomp from "stompjs"
import SockJS from 'sockjs-client'
import { useEffect, useRef, useState } from "react"
import { useUserContext } from '@/context/user_context';
import { getCurrentTime } from '@/utils/utils_time';
import API from '@/api/api';
import { FetchClientPostApi } from '@/api/fetch_client_api';
import { startLoading, stopLoading } from '../shared/nprogress';
import Badge from 'react-bootstrap/Badge';
interface IProps {
    showNoti: boolean
    numberOfNoti: number
    setShowNoti: (value: boolean) => void
    setNumberOfNoti: (value: number) => void
}

const NotiOffCanvas = (props: IProps) => {

    const { showNoti, setShowNoti, setNumberOfNoti, numberOfNoti } = props
    const router = useRouter();


    const [input, setInput] = useState<string>("")

    const [stompClient, setStompClient] = useState<any>(null)
    const { user } = useUserContext();

    const isConnectedRef = useRef<any>(false); // Dùng để lưu trạng thái kết nối

    const [notiUnread, setNotiUnread] = useState<INotiResponse[]>([])
    const [notiAll, setNotiAll] = useState<INotiResponse[]>([])

    const [timeCurrent, setTimeCurrent] = useState<string>(getCurrentTime())

    const [lockViewMoreNotiUnread, setLockViewMoreNotiUnread] = useState<boolean>(false)
    const [lockViewMoreNotiAll, setLockViewMoreNotiAll] = useState<boolean>(false)

    const [isLoadingNotiUnread, setIsloadingNotiUnread] = useState<boolean>(false)
    const [isLoadingNotiAll, setIsloadingNotiAll] = useState<boolean>(false)
    

    const [notiNew, setNotiNew] = useState<any>("unknow")


    useEffect(() => {

        if (!user || isConnectedRef.current) return;

        const socket = new SockJS(API.NOTI.NOTI_SOCKET)
        const client = Stomp.over(socket)
        console.log("client >>> ", client)

        client.connect({
        }, () => {
            isConnectedRef.current = true;
            client.subscribe(`/user/${user?.userName}/topic/noti`, (message) => {
                // nhan message
                const receivedMessage = JSON.parse(message.body);
                setNotiNew(receivedMessage)
                console.log("receivedMessage >>> ", receivedMessage)
            })
        })
        setStompClient(client);


        return () => {
            if (stompClient) {
                client.disconnect(() => {
                    isConnectedRef.current = false;
                    console.log('Disconnected');
                });
            }
        };
    }, [user])

    useEffect(() => {
        console.log("set 2 >>> ", numberOfNoti)
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

            // Kiểm tra dữ liệu đã có trong notiUnread trước khi cập nhật
            setNotiUnread((prev) => {
                const newNotis = notis.filter((newNoti) => !prev.some((existingNoti) => existingNoti.id === newNoti.id));
                const updatedNotis = [...prev, ...newNotis];

                if (updatedNotis.length === res.totalItems) {
                    setLockViewMoreNotiUnread(true)
                }

                return updatedNotis;
            });

           



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
            // Kiểm tra dữ liệu đã có trong notiUnread trước khi cập nhật
            setNotiAll((prev) => {
                const newNotis = notis.filter((newNoti) => !prev.some((existingNoti) => existingNoti.id === newNoti.id));
                const updatedNotis  = [...prev, ...newNotis]
                
                if (updatedNotis.length === res.totalItems) {
                    setLockViewMoreNotiAll(true)
                }

                return updatedNotis;
            });

           
        }
        setIsloadingNotiAll(false)
    }



    useEffect(() => {
        const fetchData = async () => {
            startLoading()
            await fetchGetNotiAll(0)
            await fetchGetNotiUnread(0)
            stopLoading()
        }

        fetchData()
    }, [])

    const sendMessage = () => {
        stompClient.send('/app/noti', {}, JSON.stringify(input.trim()))
    }


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
                                isLoadingNotiAll = {isLoadingNotiAll}
                            />
                        </Tab>

                        <Tab eventKey="unread" title={

                            <div className="d-flex align-items-center">
                                <span>Chưa đọc</span>
                                <Badge bg="secondary" className="bg-noti ms-2">{numberOfNoti}</Badge>
                            </div>

                        }>
                            <UnReadNotiTab
                                notiUnread={notiUnread}
                                fetchGetNotiUnread={fetchGetNotiUnread}
                                lockViewMoreNotiUnread={lockViewMoreNotiUnread}
                                isLoadingNotiUnread = {isLoadingNotiUnread}
                        
                            />
                        </Tab>


                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NotiOffCanvas