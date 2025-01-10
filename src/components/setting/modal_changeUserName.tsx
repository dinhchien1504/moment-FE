import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


function ModelChangeUserName({ currentUserName, onSave }: { currentUserName: string; onSave: (newUserName: string) => void }) {
  const [show, setShow] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNewUserName(""); // Reset tên đăng nhập mới mỗi khi mở modal
    setShow(true);
  };

  const handleSave = async () => {
    if (!newUserName.trim()) {
      alert("Tên đăng nhập mới không được để trống!");
      return;
    }
  
    try {
      setIsSaving(true);
      const response = await FetchClientPutApi(API.SETTING.CHANGE_USERNAME, { userName: newUserName });
  
      if (response.status === 200) {
        alert("Thay đổi tên đăng nhập thành công!");
        onSave(newUserName); // Cập nhật username mới lên giao diện cha
        handleClose(); // Đóng modal
      } else if (response.status === 400) {
        // Xử lý lỗi từ backend
        const error = response.errors?.find((err: any) => err.code === "ACCOUNT_2");
        if (error) {
          alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
        } else {
          alert("Đã xảy ra lỗi: " + response.message);
        }
      } else {
        alert("Thay đổi tên đăng nhập thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error changing username:", error);
      alert("Đã xảy ra lỗi trong quá trình thay đổi tên đăng nhập!");
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
    </>
  );
}

export default ModelChangeUserName;