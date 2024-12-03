'use client'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { usePathname } from "next/navigation";
import { useUserContext } from '@/context/user_context';
import API from '@/api/api';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import { Button } from 'react-bootstrap';
const Header = () => {
    const pathname = usePathname();
    const { user, setUser } = useUserContext();

    // useEffect(()=>{
    //     const fetch = async  () => {
    //         const res = await FetchServerGetApi(API.AUTH.MY_INFO)
    //         console.log("res >>> ",res)
    //     }
    //     fetch()

    // },[])



    const handletest = async  () => {
        const res = await FetchServerGetApi(API.AUTH.MY_INFO)
        console.log("res >>> ",res)
    }

    if (pathname === "/login") {
        return (<></>);
    }
    else {
        return (
            <>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Button  
                    onClick={() => {handletest()}}
                    >bhj</Button>
                    <Container>
                        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#home">Home</Nav.Link>
                                <Nav.Link href="#link">Link</Nav.Link>
                                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">
                                        Separated link
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        )
    }

}
export default Header