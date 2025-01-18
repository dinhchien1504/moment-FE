"use server"
import SettingSidebar from '@/components/setting/setting_sidebar';
import Button from 'react-bootstrap/Button';
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '@/styles/setting.module.css';
const SettingPage = () => {

    return (
        <>
            <div className={styles.buttonContainer + " container mt-2"}>
                {/* <Button href="/" variant="secondary" size="lg" className={styles.customButton}>
                    Home
                </Button> */}
                <div className={styles.settingSidebar}>
                    <SettingSidebar/>
                </div>
                
            </div>
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