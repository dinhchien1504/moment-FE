'use client'
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Link from 'next/link'
const LoginForm = () => {



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
                    <Form.Control type="text" placeholder="Tài khoản" 
                    //  isInvalid={true}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Mật khẩu"
                    className="password"
                >
                    <Form.Control type="password" placeholder="Mật khẩu" 
                    // isInvalid={true}
                    />
                    <Form.Control.Feedback type="invalid">
                    {"Mật khẩu không chính xác"}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <div className='div-forgot mb-3' >
                   <Link className='link-forgot' href={"/forgot"}>Bạn quên mật khẩu ? </Link>
                </div>
                
                <Button className='btn-login' >Đăng nhập</Button>
            </Form>

            <Form className='form-login mt-2'>
                <Button className='btn-register' >Đăng ký</Button>
            </Form>
        </>
    )
}
export default LoginForm