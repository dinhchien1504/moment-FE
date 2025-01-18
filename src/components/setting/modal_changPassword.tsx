import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { validPassword } from '@/validation/valid';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoadingContext } from '@/context/loading_context';

function FormChangePassword() {
    const [show, setShow] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { startLoadingSpiner, stopLoadingSpiner } = useLoadingContext();
    const [errors, setErrors] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
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
        setErrors({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setSuccessMessage("");
    };

    const handleSave = async () => {
        const newErrors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        if (!oldPassword.trim()) {
            newErrors.oldPassword = "Mật khẩu cũ không được để trống!";
        }
        if (!newPassword.trim()) {
            newErrors.newPassword = "Mật khẩu mới không được để trống!";
        } else if (!validPassword(newPassword)) {
            newErrors.newPassword = "Mật khẩu mới phải chứa ít nhất một chữ cái hoa, một chữ cái thường, một số và một ký tự đặc biệt!";
        }
        if (oldPassword === newPassword) {
            newErrors.newPassword = "Mật khẩu cũ và mật khẩu mới không được trùng nhau!";
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không khớp!";
        }

        setErrors(newErrors);

        // Kiểm tra nếu có lỗi thì không gửi yêu cầu
        if (Object.values(newErrors).some((error) => error !== "")) {
            return;
        }

        try {
            // Bắt đầu loading spinner
            startLoadingSpiner();
            const response = await FetchClientPutApi(API.SETTING.CHANGE_PASSWORD, {
                oldPassword,
                newPassword,
            });

            if (response.status === 200) {
                setSuccessMessage("Đổi mật khẩu thành công!");
                handleClose();
            } else {
                setErrors({
                    ...errors,
                    oldPassword: "Mật khẩu cũ không chính xác!",
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
        } finally {
            // Dừng loading spinner
            stopLoadingSpiner();
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
                                    {isHiddenOld ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                </span>

                            </div>
                            {errors.oldPassword && <p className="text-danger">{errors.oldPassword}</p>}
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
                                    {isHiddenNew ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                </span>

                            </div>
                            {errors.newPassword && <p className="text-danger">{errors.newPassword}</p>}
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
                            {errors.confirmPassword && (
                                <p className="text-danger">{errors.confirmPassword}</p>
                            )}
                        </Form.Group>

                        {successMessage && (
                            <p className="text-success">{successMessage}</p>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default FormChangePassword;