'use client'
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Link from 'next/link'
import { useState } from 'react';
import { LoginServerActions } from './login_server_actions';
import GlobalErrorCode from '@/exception/global_error_code';
import { startLoading, stopLoading } from '../shared/nprogress';
import { useUserContext } from '@/context/user_context';
import { FetchServerGetApi } from '@/api/fetch_server_api';
import API from '@/api/api';
import { useRouter } from 'next/navigation';


const LoginForm = () => {
    const [userName, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(true)
    const [isInvalidUserName, setIsInvalidUserName] = useState<boolean>(true)
    
    const { setUser } = useUserContext();
    const router = useRouter()


    const handleLogin = async () => {
        startLoading()
      
        if (userName === "") {
            setIsInvalidUserName(false)
            stopLoading()
            return;
        }

        const authenticationRequest: AuthenticationRequest = {
            userName: userName,
            password: password
        }
        const res = await LoginServerActions(authenticationRequest)

        // login  thanh cong
        if (res.status === 200) {

            const res = await FetchServerGetApi(API.AUTH.MY_INFO)
            if (res.status === 200) {
                const user: UserResponse = res.result
                console.log("user >>> ", user)
                setUser(user)
            }

            router.push("/")

        }
        // login khong thanh cong
        else {
            setIsInvalidPassword(false)
            stopLoading()
        }
    }

    const handleRouterRegister = () => {
        startLoading()
        router.push("/register")
    }

    // change input
    const handleUserName = (e: string) => {
        setUserName(e)
        setIsInvalidUserName(true)
        setIsInvalidPassword(true)
    }
    const handlePassword = (e: string) => {
        setPassword(e)
        setIsInvalidPassword(true)
    }

    const onKeyDown = (e: any) => {
        if (e.key == "Enter") {
            handleLogin();
        }
    };

    // end change input



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
                         isInvalid={ !isInvalidUserName}
                        onChange={(e) => { handleUserName(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"Vui lòng điền tài khoản"}
                    </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Mật khẩu"
                    className="fl-val-inp"
                >
                    <Form.Control type="password" placeholder="Mật khẩu" className='input-password'
                        isInvalid={ !isInvalidPassword}
                        onChange={(e) => { handlePassword(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {GlobalErrorCode.GLOBAL_2}
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