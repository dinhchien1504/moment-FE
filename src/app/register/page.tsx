"use client";
import RegisterForm from "@/components/register/register_form";
import "@/styles/register.css";
import { Container } from "react-bootstrap";
const RegisterPage = () => {
  return (
    <>
      <div style={{ backgroundColor: "#f2f4f7" }}>
        <Container className="ctn-register">
          <div className="div-register">
            <RegisterForm />
          </div>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;