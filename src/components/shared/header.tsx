'use client'
import { useLoadingContext } from '@/context/loading_context';
import { useSocketContext } from '@/context/socket_context';
import { useUserContext } from '@/context/user_context';
import "@/styles/header.css";
import { GetImage } from '@/utils/handle_images';
import cookie from "js-cookie";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LiveSearch from '../home/search';
import NotiOffCanvas from '../noti/noti_offcanvas';
import PostDetailModal from '../post_detail/post_detail_modal';
const Header = () => {
    const pathname = usePathname();
    const { user, fetchGetUser } = useUserContext();
    const router = useRouter()
    const [showNoti, setShowNoti] = useState<boolean>(false)
    const [showPost, setShowPost] = useState<boolean>(false)
    const { startLoadingSpiner, stopLoadingSpiner } = useLoadingContext()
    const [numberOfNoti, setNumberOfNoti] = useState<number>(0)
    const { disconnect } = useSocketContext()


    useEffect(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('Service Worker đã đăng ký', registration);
            })
            .catch((error) => {
              console.log('Đăng ký Service Worker thất bại:', error);
            });
        }

        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                console.log('Quyền nhận thông báo đã được cấp!');
              } else {
                console.log('Quyền nhận thông báo bị từ chối');
              }
            });
          }
      }, []);


    useEffect(() => {
        const fetchUser = async () => {

            await fetchGetUser()

        }

        if (pathname != "/login" && pathname != "/register") {
            startLoadingSpiner()
            fetchUser()
            stopLoadingSpiner()

        }

    }, [])

    const handleLogout = () => {
        startLoadingSpiner()
        cookie.remove("session-id");
        disconnect()
        setNumberOfNoti(0)
        router.push("/login")

    }

    const hanlleShowNoti = () => {
        if (showNoti) {
            setShowNoti(false)
        } else {
            setShowNoti(true)
        }
    }



    if (pathname === "/login" || pathname === "/register") {
        return (<></>);
    }
    else {

        return (
            <>
                <Navbar className="bg-body-tertiary ctn-header">

                    <Container fluid>

                        <Link href={"/"}>
                            <Navbar.Brand type='button'>
                                <Image
                                    src={"/images/logo-removebg.png"}
                                    width={50}
                                    height={50}
                                    alt='error'

                                />
                            </Navbar.Brand>
                        </Link>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav">

                            <Nav className="mx-auto">
                                <LiveSearch></LiveSearch>

                            </Nav>

                            <Nav>
                                <Nav className='d-flex align-items-center nav-noti'>
                                    <Button className='btn-noti'
                                        onClick={() => { hanlleShowNoti() }}
                                    >
                                        <i className="fa-solid fa-bell icon-bell"></i>
                                        {numberOfNoti > 0 && <Badge bg="secondary" className='badge-custom bg-noti'>{numberOfNoti}</Badge>}
                                    </Button>
                                </Nav>

                                <Nav className='nav-profile'>

                                    <Dropdown
                                        drop='down'
                                    >
                                        <Dropdown.Toggle as="div" id="dropdown-custom-components"
                                        >
                                            <img
                                                src={GetImage(user?.urlPhoto)}
                                                alt="Không có ảnh"
                                                className='img-avatar'
                                                onClick={() => { setShowNoti(false) }}

                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item eventKey="1" as='div'>
                                                <div className='text-center font-item'>
                                                    <img
                                                        src={GetImage(user?.urlPhoto)}

                                                        alt="Dropdown Trigger"
                                                        className='img-avatar-item'
                                                    />
                                                    {user?.name}
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item eventKey="2" className='font-item' as='div'>
                                                <Link href={user?.userName+''} className=' text-dark hover-text-decoration-underline'>
                                                    <i className="fa-solid fa-user"></i> <span>Trang cá nhân</span>
                                                </Link>
                                            </Dropdown.Item>
                                                <Dropdown.Item eventKey="3" className='font-item' as='div'>
                                                <Link href="/setting" passHref legacyBehavior>
                                                    <div>
                                                        <i className="fa-solid fa-gear"></i> Cài đặt
                                                    </div>
                                                </Link>
                                                </Dropdown.Item>
                                            <Dropdown.Item eventKey="4" className='font-item' as='div'
                                                onClick={() => { handleLogout() }}
                                            >
                                                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </Nav>

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <NotiOffCanvas
                    showNoti={showNoti}
                    setShowNoti={setShowNoti}
                    setNumberOfNoti={setNumberOfNoti}
                    numberOfNoti={numberOfNoti}
                />
                <PostDetailModal/>
            </>
        )
    }

}
export default Header