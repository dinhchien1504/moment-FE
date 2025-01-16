"use server"
import SettingSidebar from '@/components/setting/setting_sidebar';
import Button from 'react-bootstrap/Button';
import styles from '@/styles/setting.module.css';
const SettingPage = () => {

    return (
        <>
            <div className={styles.buttonContainer}>
                <Button href="/" variant="secondary" size="lg" className={styles.customButton}>
                    Home
                </Button>
                <SettingSidebar />
            </div>
            
        </>
    )
}
export default SettingPage