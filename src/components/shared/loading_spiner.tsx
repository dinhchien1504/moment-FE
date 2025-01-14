"use client"
import { useLoadingContext } from '@/context/loading_context';
import Spinner from 'react-bootstrap/Spinner';
import "@/styles/loading_spiner.css"
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
const LoadingSpiner = () => {

    const pathName = usePathname ()

    const { isLoading, stopLoadingSpiner } = useLoadingContext()

    useEffect ( () => {
        stopLoadingSpiner()
    }, [pathName])

    return (
        <>
            {isLoading &&
                (
                    <>
                        <div id='loading-overlay'  >
                            <Spinner  id='loading-spiner' animation="border" variant="danger" />
                        </div>
                    </>
                )
            }
        </>
    )
}

export default LoadingSpiner