import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


interface ModalChangInfoProps {
  accountInfo: IAccountResponse;
  onSave: (info: IAccountResponse) => void;
}

function ModalChangInfo({ accountInfo, onSave }: ModalChangInfoProps) {
  const [show, setShow] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(accountInfo);
  const [isSaving, setIsSaving] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true); // Bật trạng thái đang lưu
      const response = await FetchClientPutApi(API.SETTING.SETTING, updatedInfo); // Gọi API PUT
      if (response.status === 200) {
        // Nếu thành công, cập nhật giao diện
        onSave(updatedInfo); // Gửi dữ liệu đã chỉnh sửa về file chính
        handleClose(); // Đóng modal
      } else {
        console.error('Failed to save changes:', response.message);
        alert('Cập nhật thất bại. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Đã xảy ra lỗi khi cập nhật thông tin!');
    } finally {
      setIsSaving(false); // Tắt trạng thái đang lưu
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Thay đổi thông tin cá nhân
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={updatedInfo.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={updatedInfo.birthday}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Form.Check
                  type="radio"
                  id="gender-male"
                  name="sex"
                  label="Nam"
                  value="male"
                  checked={updatedInfo.sex === 'male'}
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  id="gender-female"
                  name="sex"
                  label="Nữ"
                  value="female"
                  checked={updatedInfo.sex === 'female'}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={updatedInfo.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalChangInfo;