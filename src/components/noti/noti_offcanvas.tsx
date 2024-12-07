"use client"
import Offcanvas from 'react-bootstrap/Offcanvas';
import "@/styles/noti_offcanvas.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UnReadNotiTab from './unread_noti_tab';
import AllNotiTab from './all_noti_tab';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
interface IProps {
    showNoti: boolean
    setShowNoti: (value: boolean) => void
}

const NotiOffCanvas = (props: IProps) => {

    const { showNoti, setShowNoti } = props
    const router = useRouter();


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
                        defaultActiveKey="unread"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="unread" title="Chưa đọc">
                            <UnReadNotiTab/>
                        </Tab>
                        <Tab eventKey="all" title="Tất cả">
                            <AllNotiTab/>
                        </Tab>
                    </Tabs>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NotiOffCanvas