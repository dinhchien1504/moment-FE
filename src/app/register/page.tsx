import RegisterForm from "@/components/register/register_form"
import { Col, Container, Row } from "react-bootstrap"
import "@/styles/register.css"
const RegisterPage = () => {
    return (
        <>
            <div style={{backgroundColor:"#f2f4f7"}}>
                <Container className="ctn-register">
                    <div className="div-register">
                        <RegisterForm
                        />
                    </div>

                </Container>
            </div>

        </>
    )
}

export default RegisterPage