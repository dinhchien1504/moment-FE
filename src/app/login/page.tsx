'use server'
import LoginForm from "@/components/login/login_form"
import { Col, Container, Row } from "react-bootstrap"
import '@/styles/login.css'
import Caurousels from "@/components/login/carousels"


const LoginPage = () => {
    return (
        <>
            <Container className="ctn-login">
          
                    <Row>
                        <Col className="col-12 col-sm-6 col-md-8 col-caurousels" >
                            <Caurousels />
                        </Col>
                        <Col className="col-12 col-sm-6 col-md-4 col-login-form">
                            <LoginForm />
                        </Col>
                    </Row>
          
            </Container>
        </>
    )
}

export default LoginPage