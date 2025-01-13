"use server"
import SettingSidebar from '@/components/setting/setting_sidebar';
import Button from 'react-bootstrap/Button';
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SettingPage = () => {

    return (
        <>
            Đây là trang cài đặt
            <Button href="/" variant="secondary" size="lg">
                Link
            </Button>
            <SettingSidebar />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

        </>
    )
}
export default SettingPage