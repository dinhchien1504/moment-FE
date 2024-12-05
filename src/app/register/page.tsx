import RegisterForm from "@/components/register/register_form"
import { Col, Container, Row } from "react-bootstrap"
import "@/styles/register.css"
const RegisterPage = () => {
    return (
        <>
            <Container className="ctn-register">
                <div className="div-register">
                    <RegisterForm
                    />
                </div>

            </Container>
        </>
    )
}

export default RegisterPage