"use server"
import SettingSidebar from '@/components/setting/setting_sidebar';
import Button from 'react-bootstrap/Button';
const SettingPage = () => {
    
    return (
        <>
            Đây là trang cài đặt
            <Button href="/" variant="secondary" size="lg">
                Link
            </Button>
            <SettingSidebar/>
            
        </>
    )
}
export default SettingPage