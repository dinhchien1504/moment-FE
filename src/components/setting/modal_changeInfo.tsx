import API from '@/api/api';
import { FetchClientPutApi } from '@/api/fetch_client_api';
import { useLoadingContext } from '@/context/loading_context';
import { useUserContext } from '@/context/user_context';
import { validBirthday, validName, validNoEmpty } from '@/validation/valid';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalChangInfoProps {
  accountInfo: IAccountResponse;
  onSave: (info: IAccountResponse) => void;
}

function ModalChangInfo({ accountInfo, onSave }: ModalChangInfoProps) {
  const [show, setShow] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(accountInfo);
  const {startLoadingSpiner, stopLoadingSpiner  } = useLoadingContext() ;
  const [isInvalid, setIsInvalid] = useState({
    name: false,
    birthday: false,
    sex: false,
    address: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    birthday: "",
    sex: "",
    address: "",
  });
  const { fetchGetUser } = useUserContext();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = { name: false, birthday: false, sex: false, address: false };
    const messages = { name: "", birthday: "", sex: "", address: "" };

    // Validate Name
    if (!validName(updatedInfo.name)) {
      errors.name = true;
      messages.name = "Họ tên không hợp lệ!";
    }

    // Validate Birthday
    if (!validBirthday(updatedInfo.birthday)) {
      errors.birthday = true;
      messages.birthday = "Ngày sinh không hợp lệ!";
    }

    // Validate Sex
    if (!updatedInfo.sex) {
      errors.sex = true;
      messages.sex = "Vui lòng chọn giới tính!";
    }

    // Validate Address
    if (!validNoEmpty(updatedInfo.address)) {
      errors.address = true;
      messages.address = "Địa chỉ không hợp lệ!";
    }

    setIsInvalid(errors);
    setErrorMessage(messages);

    return !Object.values(errors).some((err) => err); // Return true if all valid
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    
    try {
      startLoadingSpiner(); // Bắt đầu hiển thị spinner
      const response = await FetchClientPutApi(API.SETTING.SETTING, updatedInfo);
      if (response.status === 200) {
        onSave(updatedInfo);
        await fetchGetUser()
        handleClose();
      } else {
        alert("Cập nhật thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin!");
    } finally {
      stopLoadingSpiner(); // Dừng hiển thị spinner
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{backgroundColor:"black", borderColor:"black"}}>
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
                isInvalid={isInvalid.name}
              />
              <Form.Control.Feedback type="invalid">
                {errorMessage.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={updatedInfo.birthday}
                onChange={handleChange}
                isInvalid={isInvalid.birthday}
              />
              <Form.Control.Feedback type="invalid">
                {errorMessage.birthday}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Form.Check
                  type="radio"
                  id="gender-male"
                  name="sex"
                  label="Nam"
                  value="male"
                  checked={updatedInfo.sex === "male"}
                  onChange={handleChange}
                  isInvalid={isInvalid.sex}
                />
                <Form.Check
                  type="radio"
                  id="gender-female"
                  name="sex"
                  label="Nữ"
                  value="female"
                  checked={updatedInfo.sex === "female"}
                  onChange={handleChange}
                  isInvalid={isInvalid.sex}
                />
              </div>
              {isInvalid.sex && <p className="text-danger">{errorMessage.sex}</p>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={updatedInfo.address}
                onChange={handleChange}
                isInvalid={isInvalid.address}
              />
              <Form.Control.Feedback type="invalid">
                {errorMessage.address}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{backgroundColor:"white", color:"black"}}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave} style={{backgroundColor:"black",  borderColor:"black"}}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default ModalChangInfo;