'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from '@/context/user_context';
import { useEffect, useState } from 'react';
import { startLoading, stopLoading } from './nprogress';
import "@/styles/header.css"
import Image from 'next/image';
import { Button, Form } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import cookie from "js-cookie";
import NotiOffCanvas from '../noti/noti_offcanvas';
import Badge from 'react-bootstrap/Badge';
import PostModal from '../post/post_modal';
import LiveSearch from '../home/search';
import { GetImage } from '@/utils/handle_images';
const Header = () => {
    const pathname = usePathname();
    const { user, fetchGetUser } = useUserContext();
    const router = useRouter()
    const [showNoti,setShowNoti] = useState<boolean>(false)
    const [showPost,setShowPost] = useState<boolean>(false)

    const [numberOfNoti, setNumberOfNoti] = useState<number> (0)
    
  



    useEffect(() => {
        const fetchUser = async () => {
            
            await fetchGetUser()
         
        }

        if (pathname != "/login" && pathname != "/register") {
            startLoading()
            fetchUser()
            stopLoading()
 
        }

    }, [])

    const handleLogout = () => {
        startLoading()
        cookie.remove("session-id");
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
                        <Navbar.Brand type='button'>
                            <Image
                                src={"/images/logo-removebg.png"}
                                width={50}
                                height={50}
                                alt='error'
                                onClick={()=>{setShowPost(true)}}
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        
                        <Navbar.Collapse id="basic-navbar-nav">

                            <Nav className="mx-auto">
                            <LiveSearch></LiveSearch>

                            </Nav>

                            <Nav>
                                <Nav.Link type='div' className='d-flex align-items-center nav-noti'>
                                    <Button className='btn-noti'
                                    onClick={()=>{hanlleShowNoti()}}
                                    >
                                        <i className="fa-solid fa-bell icon-bell"></i>
                                     {numberOfNoti > 0 && <Badge bg="secondary" className='badge-custom bg-noti'>{numberOfNoti}</Badge> }  
                                   </Button>
                                </Nav.Link>

                                <Nav.Link type='div' className='nav-profile'>

                                    <Dropdown
                                        drop='down'
                                    >
                                        <Dropdown.Toggle as="div" id="dropdown-custom-components"
                                        >
                                            <img 
                                                src={GetImage(user?.urlPhoto)}
                                                alt="Không có ảnh"
                                                className='img-avatar'
                                                onClick={()=>{setShowNoti(false)}}
                                            
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu  align="end">
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
                                                <i className="fa-solid "></i> Cài đặt
                                            </Dropdown.Item>
                                            <Dropdown.Item eventKey="3" className='font-item' as='div'
                                                onClick={() => { handleLogout() }}
                                            >
                                                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                </Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <NotiOffCanvas
                showNoti = {showNoti}
                setShowNoti={setShowNoti}
                setNumberOfNoti = {setNumberOfNoti}
                numberOfNoti = {numberOfNoti}
                />
                <PostModal
                showPost = {showPost}
                setShowPost= {setShowPost}
                />
            </>
        )
    }

}
export default Header