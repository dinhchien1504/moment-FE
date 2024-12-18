"use client"
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { startLoading, stopLoading } from '../shared/nprogress';
import { useState } from 'react';
import InvalidErrorCode from '@/exception/invalid_error_code';
import InputGroup from 'react-bootstrap/InputGroup';
import { validBirthday, validName, validNoEmpty, validPassword, validUserName } from '@/validation/valid';
import { useUserContext } from '@/context/user_context';
import { RegisterServerActions } from './register_server_actions';
import AccountErrorCode from '@/exception/account_error_code';
const RegisterForm = () => {
    const [isvalidItem, setIsvalidItem] = useState<boolean[]>(Array(4).fill(false));
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(true)
    const { fetchGetUser } = useUserContext();
    const [messageUserName,setMessageUserName] = useState<string> (InvalidErrorCode.INVALID_1)


    // input
    const [name, setName] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [sex, setSex] = useState<string>("male");
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // end input

    const handlleHiddenPass = () => {
        if (isHidden) {
            setIsHidden(false)
        } else {
            setIsHidden(true)
        }
    }


    // router
    const router = useRouter()

    const handleRouterLogin = () => {
        startLoading()
        router.push("/login")
    }
    // end router

    // change input
    const handleName = (str: string) => {
        isvalidItem[0] = validName(str)
        setName(str)
    }

    const handleBirtday = (str: string) => {
        isvalidItem[1] = validBirthday(str)
        setBirthday(str)
    }

    const handleSex = (str: string) => {
        setSex(str)
    }

    const handleUserName = (str: string) => {
        isvalidItem[2] = validUserName(str)
        setMessageUserName(InvalidErrorCode.INVALID_1)
        
        setUserName(str)
    }

    const handlePassword = (str: string) => {
        isvalidItem[3] = validPassword(str)
        setPassword(str)
    }

    // end change input


    const onKeyDown = (e: any) => {
        if (e.key == "Enter") {
            handleRegister();
        }
    };

    const handleRegister = async () => {
        //bat dau validation
        setIsValid(true)

        // kiem tra validation
        if (isvalidItem.some(v => v === false)) {
            return;
        }

        // bat dau thanh tien trinh
        startLoading()

        const registerRequest:RegisterRequest  = {
            name:name,
            birthday:birthday,
            sex:sex,
            userName:userName,
            password:password,
        }

        console.log("request >>> ",registerRequest)

        const res = await RegisterServerActions(registerRequest);
        if (res && res.status === 200) {
            await  fetchGetUser()

            router.push("/")
        } 
        else {
            const newArray = [...isvalidItem]; 
            newArray[2] = false
            setIsvalidItem(newArray)

            setMessageUserName(AccountErrorCode.ACCOUNT_2)
            stopLoading()
        }

    }


    return (
        <>
            <div className='div-img mb-4'>
                <Image
                    src="/images/logo-login-removebg.png"
                    width={130}
                    height={130}
                    alt="Picture of the author"
                    priority
                />
            </div>
            <Form className='form-register' >
                <div className='text-center' >
                    <p className='fs-4 fw-bold mb-2'>Tạo tài khoản mới</p>
                    {/* <p className='fs-6'>Đăng ký để theo dõi và xem ảnh từ bạn bè của bạn</p> */}
                </div>

                <FloatingLabel
                    label="Họ và tên"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Họ và tên" className='input-name' 
                        onChange={(e) => { handleName(e.target.value) }}
                        isInvalid={isValid && !isvalidItem[0]}
                        onKeyDown={(e) => onKeyDown(e)}
                    />

                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {InvalidErrorCode.INVALID_6}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className='div-birthday-sex w-100' >
                    <FloatingLabel
                        label="Ngày sinh"
                        className="fl-val-inp w-50 "
                    >
                        <Form.Control type="date" placeholder="Ngày sinh" className='input-birthday'
                            onChange={(e) => { handleBirtday(e.target.value) }}
                            onKeyDown={(e) => onKeyDown(e)}
                            isInvalid={isValid && !isvalidItem[1]}
                        />
                        <Form.Control.Feedback type="invalid" className='mt-0'>
                            {InvalidErrorCode.INVALID_5}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel
                        label="Giới tính"
                        className="fl-val-inp w-50 fl-sex"
                    >
                        <Form.Select aria-label="Default select example" className='select-sex'

                            onChange={(e) => { handleSex(e.target.value) }}
                        >
                            <option value="male" >Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </Form.Select>
                    </FloatingLabel>
                </div>

                <FloatingLabel
                    label="Tài khoản"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Tài khoản" className='input-user-name-new'
                        autoComplete="username"  
                        onChange={(e) => { handleUserName(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                        isInvalid={isValid && !isvalidItem[2]}
                    />
                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {messageUserName}
                    </Form.Control.Feedback>
                </FloatingLabel>



                <InputGroup className="fl-val-inp mb-4">

                    <FloatingLabel
                        label="Mật khẩu"
                    >
                        <Form.Control type={isHidden ? "password" : "text"} placeholder="Mật khẩu" className='input-password-new' 
                            onChange={(e) => { handlePassword(e.target.value) }}
                            isInvalid={isValid && !isvalidItem[3]}
                            onKeyDown={(e) => onKeyDown(e)}
                            autoComplete="current-password" 
                        />
                        <Form.Control.Feedback type="invalid" className='mt-0 pass-error'>
                            {InvalidErrorCode.INVALID_2}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <InputGroup.Text id="basic-addon2" className='hidden-pass'>
                        <button className='btn-eye' type='button'
                            onClick={() => { handlleHiddenPass() }}
                        >
                            {isHidden ?  <i className="fa-regular fa-eye-slash"></i>
                                : <i className="fa-regular fa-eye"> </i> }
                        </button>
                    </InputGroup.Text>
                </InputGroup>




                <Button className='btn-register-new'
                    onClick={() => { handleRegister() }}
                >Đăng ký</Button>
            </Form>

            <Form className='form-register mt-2'>
                <Button className='btn-login-new'
                    onClick={() => { handleRouterLogin() }}
                >Đăng nhập</Button>
            </Form>
        </>
    )
}

export default RegisterForm