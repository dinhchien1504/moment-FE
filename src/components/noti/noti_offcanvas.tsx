"use client"
import Offcanvas from 'react-bootstrap/Offcanvas';
import "@/styles/noti_offcanvas.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnReadNotiTab from './unread_noti_tab';
import AllNotiTab from './all_noti_tab';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Stomp from "stompjs"
import SockJS from 'sockjs-client'
import { useEffect, useRef, useState } from "react"
import { useUserContext } from '@/context/user_context';
import cookie from "js-cookie";
import { getCurrentTime } from '@/utils/utils_time';
import API from '@/api/api';
import { FetchClientGetApi, FetchClientPostApi } from '@/api/fetch_client_api';
import { startLoading, stopLoading } from '../shared/nprogress';
import Badge from 'react-bootstrap/Badge';
import { dividerClasses } from '@mui/material';
interface IProps {
    showNoti: boolean
    numberOfNoti: number
    setShowNoti: (value: boolean) => void
    setNumberOfNoti: (value: number) => void
}

const NotiOffCanvas = (props: IProps) => {

    const { showNoti, setShowNoti, setNumberOfNoti } = props
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

    const [handleNumberNoti, setHandleNumberNoti] = useState<number>(0)



    useEffect(() => {

        if (!user || isConnectedRef.current) return;

        const socket = new SockJS(API.NOTI.NOTI_SOCKET)
        const client = Stomp.over(socket)
        console.log("client >>> ", client)

        client.connect({
        }, () => {
            isConnectedRef.current = true;
            // ket noi toi controller de nhan message
            client.subscribe(`/user/${user?.userName}/topic/noti`, (message) => {
                // nhan message
                const receivedMessage: INotiResponse = JSON.parse(message.body);

                setNotiUnread((prevMessages) => [receivedMessage, ...prevMessages]);
                setNotiAll((prevMessages) => [receivedMessage, ...prevMessages]);



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
        console.log("set 2 >>> ", handleNumberNoti)
        if (notiUnread.length != 0) {
            setNumberOfNoti(handleNumberNoti + 1)
            setHandleNumberNoti(handleNumberNoti + 1)
        }
   
    }, [notiUnread])

    const fetchGetNotiUnread = async (pageCurrent: number) => {

        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "unread",
        }

        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)

        console.log("fetchGetNotiUnread >>> ", timeCurrent)
        if (res && res.status === 200) {

            const notis: INotiResponse[] = res.result

            if (notiUnread.length === 0) {
                console.log("set 1 >>> ", res.totalItems)
                setNumberOfNoti(res.totalItems)
                setHandleNumberNoti(res.totalItems)
            }

            // Kiểm tra dữ liệu đã có trong notiUnread trước khi cập nhật
            setNotiUnread((prev) => {
                const newNotis = notis.filter((newNoti) => !prev.some((existingNoti) => existingNoti.id === newNoti.id));
                return [...prev, ...newNotis];
            });

            if (notis.length === 0) {
                setLockViewMoreNotiUnread(true)
            }



        }

    }

    const fetchGetNotiAll = async (pageCurrent: number) => {
        const req: NotiFilterRequest = {
            pageCurrent: pageCurrent,
            time: timeCurrent,
            status: "all",
        }
        const res = await FetchClientPostApi(API.NOTI.NOTI_GET, req)
        console.log("fetchGetNotiAll >>> ", res)
        if (res && res.status === 200) {


            const notis: INotiResponse[] = res.result
            // Kiểm tra dữ liệu đã có trong notiUnread trước khi cập nhật
            setNotiAll((prev) => {
                const newNotis = notis.filter((newNoti) => !prev.some((existingNoti) => existingNoti.id === newNoti.id));
                return [...prev, ...newNotis];
            });

            if (notis.length < 6) {
                setLockViewMoreNotiAll(true)
            }
        }

    }



    useEffect(() => {
        const fetchData = async () => {
            startLoading()
            await fetchGetNotiUnread(0)
            await fetchGetNotiAll(0)
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
                            />
                        </Tab>

                        <Tab eventKey="unread" title={

                            <div className="d-flex align-items-center">
                                <span>Chưa đọc</span>
                                <Badge bg="secondary" className="bg-noti ms-2">{handleNumberNoti}</Badge>
                            </div>

                        }>
                            <UnReadNotiTab
                                notiUnread={notiUnread}
                                fetchGetNotiUnread={fetchGetNotiUnread}
                                lockViewMoreNotiUnread={lockViewMoreNotiUnread}
                            />
                        </Tab>


                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NotiOffCanvas