"use client"
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { startLoading } from '../shared/nprogress';
const RegisterForm = () => {

    const router = useRouter()

    const handleRouterLogin = () =>{
        startLoading()
        router.push("/login")
    }

    return (
        <>
            <div className='div-img mb-4'>
                <Image
                    src="/images/logo-login.jpg"
                    width={130}
                    height={130}
                    alt="Picture of the author"
                />
            </div>
            <Form className='form-register' >
                <div className='text-center' >
                    <p className='fs-4 fw-bold'>Tạo tài khoản mới</p>
                    <p className='fs-6'>Đăng ký để theo dõi và xem ảnh từ bạn bè của bạn</p>
                </div>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Họ và tên"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Họ và tên" className='input-name'
                        // isInvalid={true}
                    />

                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"vui lòng điền tên"}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className='div-birthday-sex w-100' >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Ngày sinh"
                        className="fl-val-inp w-50 "
                    >
                        <Form.Control type="date" placeholder="Ngày sinh" className='input-birthday'
                        //   isInvalid={true}
                        />
                          <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"vui lòng điền tên"}
                    </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="Giới tính"
                        className="fl-val-inp w-50 fl-sex"
                    >
                        <Form.Select aria-label="Default select example" className='select-sex'>
                            <option value="male" selected>Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Tài khoản"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Tài khoản" className='input-user-name-new'
                    //   isInvalid={true}
                    />
                      <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"vui lòng điền tên"}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Mật khẩu"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Mật khẩu" className='input-password-new'
                    //   isInvalid={true}
                    />
                      <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"vui lòng điền tên"}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <Button className='btn-register-new'
                >Đăng ký</Button>
            </Form>

            <Form className='form-register mt-2'>
                <Button className='btn-login-new'
                onClick={()=>{handleRouterLogin()}}
                >Đăng nhập</Button>
            </Form>
        </>
    )
}

export default RegisterForm