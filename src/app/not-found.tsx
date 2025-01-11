"use client"

import { useRouter } from 'next/navigation';
import { Button } from "react-bootstrap";
import "@/styles/not_found.css"
import Image from "next/image";
import Link from "next/link";
export default function NotFound() {

    const router = useRouter()

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
                    <Link href={"/"} className="btn-back-home"

                    >Quay về trang chủ</Link>
                </div>
            </div>
        </>
    )
}