"use client";
import { fetchGoogleToken } from "@/components/login/login_server_actions";
import RegisterForm from "@/components/register/register_form";
import SpinnerAnimation from "@/components/shared/spiner_animation";
import "@/styles/register.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOAuth = async () => {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        return;
      }

      try {
        const data = await fetchGoogleToken(code);
        if (data?.token) {
          if (window.opener) {
            window.opener.postMessage(
              { token: data.token },
              window.opener.location.origin
            );
          } else {
            router.push("/login"); // Không có popup, chuyển hướng về trang chính
          }
        } else {
          throw new Error("Không nhận được token");
        }
      } catch (error) {
        console.error("Lỗi khi lấy token:", error);
      } finally {
        window.close();
      }
      // setLoading(false);
    };

    handleOAuth();
  }, [router]);
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center bg-black-50 w-100 h-100">
          <SpinnerAnimation></SpinnerAnimation>
        </div>
      ) : (
        <div style={{ backgroundColor: "#f2f4f7" }}>
          <Container className="ctn-register">
            <div className="div-register">
              <RegisterForm />
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default RegisterPage