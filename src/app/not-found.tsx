"use client"

import Link from "next/link"

export default function NotFound () {
    
    return (
        <>
            <main className="text-center" >
                <h2 className="text-3xl">Trang không tồn tại</h2>
                <p>Quay về lại trang chủ <Link  href={"/"}> Quay về </Link>  </p>
            </main>
        </>
    )
}