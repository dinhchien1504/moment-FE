'use client'
import Image from 'next/image'
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button } from 'react-bootstrap';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { fetchGoogleToken, LoginServerActions } from './login_server_actions';
import { useUserContext } from '@/context/user_context';
import { useRouter } from 'next/navigation';
import { validNoEmpty } from '@/validation/valid';
import AuthErrorCode from '@/exception/auth_error_code';
import InputGroup from 'react-bootstrap/InputGroup';
import { useLoadingContext } from '@/context/loading_context';
import SpinnerAnimation from '../shared/spiner_animation';

const LoginForm = () => {
    const [userName, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isvalid, setIsValid] = useState<boolean>(false) // luc dau tat valid

    const [isvalidItem, setIsvalidItem] = useState<boolean[]>(Array(2).fill(false));


    const [messagePassword, setMessagePassword] = useState<string>("Vui lòng điền mật khẩu")
    const [isHidden, setIsHidden] = useState<boolean>(true)

    const { setUser, fetchGetUser } = useUserContext();

    const [isLoading,setIsLoading]=useState<boolean>(false)
    const router = useRouter()

      useEffect(() => {
    const handleOAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        return;
      }
      setIsLoading(true);

      try {
        const data = await fetchGoogleToken(code);
        console.log(code,data)
        if (data?.token) {
          await fetchGetUser();
          router.push("/");
        } else {
          console.error("Token không hợp lệ");
          router.push("/login");
        }
      } catch (error) {
        console.error("Lỗi xác thực Google:", error);
        router.push("/login");
      }
    };

    handleOAuth();
  }, [router]);

  

    const { startLoadingSpiner, stopLoadingSpiner } = useLoadingContext()

    const handleLogin = async () => {
        //bat dau validation
        setIsValid(true)

        // kiem tra validation
        if (isvalidItem.some(v => v === false)) {
            return;
        }

        // bat dau thanh tien trinh
        startLoadingSpiner()

        // khoi tao du lieu
        const authenticationRequest: AuthenticationRequest = {
            userName: userName,
            password: password
        }
        const res = await LoginServerActions(authenticationRequest)

        // login  thanh cong
        if (res && res.status === 200) {

            // lay thong tin user
            await fetchGetUser()

            router.push("/")
        }

        // login khong thanh cong
        else {

            const newArray = [...isvalidItem];
            newArray[1] = false
            setIsvalidItem(newArray)

            setMessagePassword(AuthErrorCode.AUTH_1)
            stopLoadingSpiner()
        }

    }

    const handlleHiddenPass = () => {
        if (isHidden) {
            setIsHidden(false)
        } else {
            setIsHidden(true)
        }
    }

    // router


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

        if (validNoEmpty(password)) {
            isvalidItem[1] = true
        }
    }

    const handlePassword = (e: string) => {
        isvalidItem[1] = validNoEmpty(e)
        setMessagePassword("Vui lòng điền mật khẩu")
        setPassword(e);
    }
    // validation
    const loginWithGoogle = () => {
        const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URL;
        const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;

        const auth_url = `https://accounts.google.com/o/oauth2/v2/auth` +
            `?client_id=${client_id}` +
            `&redirect_uri=${redirect_uri}` +
            `&response_type=code` +
            `&scope=openid%20email%20profile` +
            `&prompt=select_account`;
console.log(auth_url)
        window.location.href = auth_url;
};
    return (
        <>
        {isLoading ? (
        <div className="d-flex justify-content-center align-items-center bg-black-50 w-100 h-100">
          <SpinnerAnimation></SpinnerAnimation>
        </div>
      ) : (

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

                    label="Tài khoản"
                    className="fl-val-inp"
                >
                    <Form.Control type="text" placeholder="Tài khoản" className='input-user-name'
                        autoComplete="username"
                        isInvalid={isvalid && !isvalidItem[0]}
                        onChange={(e) => { handleUserName(e.target.value) }}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                    <Form.Control.Feedback type="invalid" className='mt-0'>
                        {"Vui lòng điền tài khoản."}
                    </Form.Control.Feedback>
                </FloatingLabel>


                <InputGroup className="fl-val-inp">

                    <FloatingLabel
                        label="Mật khẩu"
                    >
                        <Form.Control type={isHidden ? "password" : "text"} placeholder="Mật khẩu" className='input-password'
                            autoComplete="current-password"
                            isInvalid={isvalid && !isvalidItem[1]}
                            onChange={(e) => { handlePassword(e.target.value) }}
                            onKeyDown={(e) => onKeyDown(e)}

                        />
                        <Form.Control.Feedback type="invalid">
                            {messagePassword}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <InputGroup.Text id="basic-addon2" className='hidden-pass'>
                        <button className='btn-eye' type='button'
                            onClick={() => { handlleHiddenPass() }}
                        >
                            {isHidden ? <i className="fa-regular fa-eye-slash"></i>
                                : <i className="fa-regular fa-eye"> </i>}
                        </button>
                    </InputGroup.Text>
                </InputGroup>




                <div className='div-forgot mb-3' >
                    <Link className='link-forgot' href={"/"}>Bạn quên mật khẩu ? </Link>
                </div>

                <Button className='btn-login'
                    onClick={() => { handleLogin() }}
                >Đăng nhập</Button>
            </Form>

      <Form className="form-login mt-2">
        <Link className="btn-register" href={"/register"}>
          <Button className="btn-register">Đăng ký</Button>
        </Link>

        <Button variant="outline" className="border border-black mt-2 w-100" onClick={() => loginWithGoogle()}>
          <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          className="bi bi-arrow-up text-primary me-1"
          viewBox="0 0 488 512"
          fill="currentColor"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          <span>Đăng nhập với Google</span>
        </Button>
      </Form>
    </>
      )}
        </>
  );
};
export default LoginForm;
