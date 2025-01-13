import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import cookie from "js-cookie";
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateSuccessUserName from './update_success';
import { startLoading } from '../shared/nprogress';
import { useRouter } from 'next/navigation';


function ModelChangeUserName({ currentUserName, onSave }: { currentUserName: string; onSave: (newUserName: string) => void }) {
  const [show, setShow] = useState(false);
  const router = useRouter()
  const [newUserName, setNewUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewUserName(""); // Reset tên đăng nhập mới mỗi khi mở modal
    setShow(true);
  };

  const handleLogout = () => {
    startLoading()
        cookie.remove("session-id");
        router.push("/login")
  };

  const handleSave = async () => {
    if (!newUserName.trim()) {
        toast.error("Tên đăng nhập mới không được để trống!", { autoClose: 3000 });
        return;
    }

    try {
        setIsSaving(true);
        const response = await FetchClientPutApi(API.SETTING.CHANGE_USERNAME, { userName: newUserName });

        if (response.status === 200) {
          setShowSuccessModal(true);
            onSave(newUserName); // Cập nhật username mới lên giao diện cha
            handleClose(); // Đóng modal
        } else if (response.status === 400) {
            // Xử lý lỗi từ backend
            const error = response.errors?.find((err: any) => err.code === "ACCOUNT_2");
            if (error) {
                toast.error("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.", { autoClose: 3000 });
            } else {
                toast.error(`Đã xảy ra lỗi: ${response.message}`, { autoClose: 3000 });
            }
        } else {
            toast.error("Thay đổi tên đăng nhập thất bại! Vui lòng thử lại.", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("Error changing username:", error);
        toast.error("Đã xảy ra lỗi trong quá trình thay đổi tên đăng nhập!", { autoClose: 3000 });
    } finally {
        setIsSaving(false);
    }
};

  

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <i className="fa-regular fa-pen-to-square" style={{ cursor: "pointer" }}></i>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi tên đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập hiện tại</Form.Label>
              <Form.Control type="text" value={currentUserName} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập mới</Form.Label>
              <Form.Control
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>

      <UpdateSuccessUserName
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default ModelChangeUserName;