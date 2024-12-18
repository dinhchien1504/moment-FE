"use client"

import { startLoading } from "@/components/shared/nprogress";
import { useRouter } from 'next/navigation';
import { Button } from "react-bootstrap";
import "@/styles/not_found.css"
import Image from "next/image";
export default function NotFound() {

    const router = useRouter()
    const handleBackHome = () => {
        startLoading()
        router.push("/")
    }


    return (
        <>
            <div className="div-error" >
                <div className="text-center" >
                <Image src={"/images/error.jpg"}
                    width={300}
                    height={300}
                    alt="error"
                    />
                    <h2 className="mb-4" >Rất tiếc, trang này không tồn tại</h2>
                    <h5 className="mb-4">Liên kết bạn đã nhấp vào có thể bị hỏng, hoặc trang này có thể đã được gỡ bỏ</h5>
                    <Button className="btn-back-home"
                        onClick={() => { handleBackHome() }}
                    >Quay về trang chủ</Button>
                </div>
            </div>
        </>
    )
}