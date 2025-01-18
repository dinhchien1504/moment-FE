import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import cookie from "js-cookie";
import Modal from 'react-bootstrap/Modal';
import "react-toastify/dist/ReactToastify.css";
import UpdateSuccessUserName from './update_success';
import { useRouter } from 'next/navigation';
import { useLoadingContext } from '@/context/loading_context';
import { validUserName } from '@/validation/valid';


function ModelChangeUserName({ currentUserName, onSave }: { currentUserName: string; onSave: (newUserName: string) => void }) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [newUserName, setNewUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {startLoadingSpiner, stopLoadingSpiner  } = useLoadingContext();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewUserName(""); // Reset tên đăng nhập mới mỗi khi mở modal
    setIsInvalid(false);
    setErrorMessage("");
    setShow(true);
  };

  const handleLogout = () => {
    startLoadingSpiner();
    cookie.remove("session-id");
    router.push("/login");
  };

  const validateNewUserName = (username: string): boolean => {
    if (!validUserName(username)) {
      setIsInvalid(true);
      setErrorMessage("Tên đăng nhập không hợp lệ!");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateNewUserName(newUserName)) return;

    try {
      startLoadingSpiner();
      const response = await FetchClientPutApi(API.SETTING.CHANGE_USERNAME, { userName: newUserName });

      if (response.status === 200) {
        setShowSuccessModal(true);
        onSave(newUserName); // Cập nhật username mới lên giao diện cha
        handleClose(); // Đóng modal
      } else if (response.status === 400) {
        const error = response.errors?.find((err: any) => err.code === "ACCOUNT_2");
        if (error) {
          setIsInvalid(true);
          setErrorMessage("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
        } else {
          setIsInvalid(true);
          setErrorMessage(`Đã xảy ra lỗi: ${response.message}`);
        }
      } else {
        setIsInvalid(true);
        setErrorMessage("Thay đổi tên đăng nhập thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error changing username:", error);
      setIsInvalid(true);
      setErrorMessage("Đã xảy ra lỗi trong quá trình thay đổi tên đăng nhập!");
    } finally {
      stopLoadingSpiner();
    }
  };

  return (
    <>
      
        <i className="fa-regular fa-pen-to-square" style={{ cursor: "pointer" }} onClick={handleShow}></i>
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
                onChange={(e) => {
                  setNewUserName(e.target.value);
                  setIsInvalid(false); // Reset trạng thái lỗi khi người dùng nhập
                  setErrorMessage("");
                }}
                isInvalid={isInvalid}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
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