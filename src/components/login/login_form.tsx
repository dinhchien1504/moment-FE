'use client'
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Link from 'next/link'
import { useState } from 'react';
import { LoginServerActions } from './login_server_actions';
import {  useRouter } from 'next/navigation'
import GlobalErrorCode from '@/exception/global_error_code';
import { startLoading, stopLoading } from '../shared/nprogress';
const LoginForm = () => {
    const [userName,setUserName] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [isInvalid,setIsInvalid] = useState<boolean>(false)
    const router = useRouter()

    const handleLogin = async () => {
        startLoading()
        const authenticationRequest:AuthenticationRequest = {
            userName:userName,
            password:password
        }

        const res = await LoginServerActions(authenticationRequest)
        if (res.status === 200) {
            setIsInvalid(false)
            router.push(`/`)
            
        } else {
            setIsInvalid(true)
        }
        stopLoading()
    }

    // change input
    const handleUserName = (e:string) => {
        setUserName(e)
        setIsInvalid(false)
    }
    const handlePassword = (e:string) => {
        setPassword(e)
        setIsInvalid(false)
    }

    // end change input



    return (
        <>
            <Form className='form-login' >
                <div  className='div-img mb-4'>
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
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="Tài khoản"  className='input-user-name'
                    //  isInvalid={true}
                    onChange={(e) => {handleUserName(e.target.value)}}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Mật khẩu"
                    className="password"
                >
                    <Form.Control type="password" placeholder="Mật khẩu"  className='input-password'
                    isInvalid={isInvalid}
                    onChange={(e) => {handlePassword(e.target.value)}}
                    />
                    <Form.Control.Feedback type="invalid">
                    {GlobalErrorCode.GLOBAL_2}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <div className='div-forgot mb-3' >
                   <Link className='link-forgot' href={"/"}>Bạn quên mật khẩu ? </Link>
                </div>
                
                <Button className='btn-login' 
                onClick={() => {handleLogin()}}
                >Đăng nhập</Button>
            </Form>

            <Form className='form-login mt-2'>
                <Button className='btn-register' >Đăng ký</Button>
            </Form>
        </>
    )
}
export default LoginForm