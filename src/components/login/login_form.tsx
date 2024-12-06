'use client'
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Link from 'next/link'
import { useState } from 'react';
import { LoginServerActions } from './login_server_actions';
import GlobalErrorCode from '@/exception/invalid_error_code';
import { startLoading, stopLoading } from '../shared/nprogress';
import { useUserContext } from '@/context/user_context';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import API from '@/api/api';
import { useRouter } from 'next/navigation';
import { validNoEmpty } from '@/validation/valid';
import AuthErrorCode from '@/exception/auth_error_code';


const LoginForm = () => {
    const [userName, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isvalid, setIsValid] = useState<boolean>(false) // luc dau tat valid
    const [isvalidItem, setIsvalidItem] = useState<boolean[]>(Array(2).fill(false));
    const [messagePassword, setMessagePassword] = useState<string>("Vui lòng điền mật khẩu")

    const { setUser } = useUserContext();
    const router = useRouter()


    const handleLogin = async () => {
        //bat dau validation
        setIsValid(true)

        // kiem tra validation
        if (isvalidItem.some(v => v === false)) {
            stopLoading()
            return;
        }

        // bat dau thanh tien trinh
        startLoading()

        // khoi tao du lieu
        const authenticationRequest: AuthenticationRequest = {
            userName: userName,
            password: password
        }
        const res = await LoginServerActions(authenticationRequest)

        // login  thanh cong
        if (res.status === 200) {

            // lay thong tin user
            const res = await FetchServerGetApi(API.AUTH.MY_INFO)
            if (res.status === 200) {
                const user: UserResponse = res.result
                setUser(user)
            }

            router.push("/")
        }

        // login khong thanh cong
        else {
            isvalidItem[1] = false
            setMessagePassword(AuthErrorCode.AUTH_1)
            stopLoading()
        }

    }

    // router
    const handleRouterRegister = () => {
        startLoading()
        router.push("/register")
    }
    
    const onKeyDown = (e: any) => {
        if (e.key == "Enter") {
            handleLogin();
        }
    };

    // router


    // validation
    const handleUserName = (e: string) => {
        isvalidItem[0] = validNoEmpty(e)
        setUserName(e);
    }

    const handlePassword = (e: string) => {
        isvalidItem[1]  = validNoEmpty(e)
        setMessagePassword("Vui lòng điền mật khẩu")
        setPassword(e);
    }
    // validation



    return (
        <>
            <Form className='form-login' >
                <div className='div-img mb-4'>
                    <Image
                        src="/images/logo-login.jpg"
                        width={130}
                        height={130}
                        alt="Picture of the author"
                    />
                </div>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Tài khoản"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Tài khoản" className='input-user-name'
                        isInvalid={isvalid && ! isvalidItem[0]}
                        onChange={(e) => { handleUserName(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"Vui lòng điền tài khoản."}
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Mật khẩu"
                    className="fl-val-inp"
                >
                    <Form.Control type="password" placeholder="Mật khẩu" className='input-password'
                        isInvalid={isvalid && ! isvalidItem[1]}
                        onChange={(e) => { handlePassword(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {messagePassword}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className='div-forgot mb-3' >
                    <Link className='link-forgot' href={"/"}>Bạn quên mật khẩu ? </Link>
                </div>

                <Button className='btn-login'
                    onClick={() => { handleLogin() }}
                >Đăng nhập</Button>
            </Form>

            <Form className='form-login mt-2'>
                <Button className='btn-register'
                    onClick={() => { handleRouterRegister() }}
                >Đăng ký</Button>
            </Form>
        </>
    )
}
export default LoginForm