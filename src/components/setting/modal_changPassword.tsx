import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormChangePassword() {
    const [show, setShow] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isHiddenOld, setIsHiddenOld] = useState(true);
    const [isHiddenNew, setIsHiddenNew] = useState(true);
    const [isHiddenConfirm, setIsHiddenConfirm] = useState(true);

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    const handleShow = () => setShow(true);

    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        setSuccessMessage("");
    };


    const handleSave = async () => {
        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!", { autoClose: 3000 });
            return;
        }
    
        // Kiểm tra mật khẩu mới có hợp lệ không (có thể thêm vào các quy tắc kiểm tra)
        if (!newPassword.trim()) {
            toast.error("Mật khẩu không được để trống!", { autoClose: 3000 });
            return;
        }
        if (!oldPassword.trim()) {
            toast.error("Mật khẩu không được để trống!", { autoClose: 3000 });
            return;
        }
        if (oldPassword === newPassword) {
            toast.error("Mật khẩu cũ và mật khẩu mới không được trùng nhau!", { autoClose: 3000 });
            return;
        }
    
        try {
            setIsSaving(true);
            const response = await FetchClientPutApi(API.SETTING.CHANGE_PASSWORD, {
                oldPassword,
                newPassword,
            });
    
            if (response.status === 200) {
                toast.success("Đổi mật khẩu thành công!", { autoClose: 3000 });
                handleClose(); // Đóng modal
            } else if (response.status === 400) {
                // Xử lý lỗi từ backend, ví dụ như mật khẩu cũ không chính xác
                const error = response.errors?.find((err: any) => err.code === "OLD_PASSWORD_INCORRECT");
                if (!error) {
                    toast.error("Mật khẩu cũ không chính xác! Vui lòng kiểm tra lại.", { autoClose: 3000 });
                } else {
                    toast.error(`Đã xảy ra lỗi: ${response.message}`, { autoClose: 3000 });
                }
            } else {
                toast.error("Thay đổi mật khẩu thất bại! Vui lòng thử lại.", { autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Đã xảy ra lỗi trong quá trình thay đổi mật khẩu!", { autoClose: 3000 });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleVisibilityOld = () => setIsHiddenOld(!isHiddenOld);
    const toggleVisibilityNew = () => setIsHiddenNew(!isHiddenNew);
    const toggleVisibilityConfirm = () => setIsHiddenConfirm(!isHiddenConfirm);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Thay đổi mật khẩu
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Old Password Field */}
                        <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Nhập mật khẩu cũ</Form.Label>
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type={isHiddenOld ? "password" : "text"}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    autoFocus
                                />
                                <span
                                    onClick={toggleVisibilityOld}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {isHiddenOld ? (
                                        <i className="fa fa-eye-slash"></i>
                                    ) : (
                                        <i className="fa fa-eye"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>

                        {/* New Password Field */}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Nhập mật khẩu mới</Form.Label>
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type={isHiddenNew ? "password" : "text"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <span
                                    onClick={toggleVisibilityNew}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {isHiddenNew ? (
                                        <i className="fa fa-eye-slash"></i>
                                    ) : (
                                        <i className="fa fa-eye"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>

                        {/* Confirm Password Field */}
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type={isHiddenConfirm ? "password" : "text"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span
                                    onClick={toggleVisibilityConfirm}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {isHiddenConfirm ? (
                                        <i className="fa fa-eye-slash"></i>
                                    ) : (
                                        <i className="fa fa-eye"></i>
                                    )}
                                </span>
                            </div>
                        </Form.Group>

                        {errorMessage && (
                            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FormChangePassword;