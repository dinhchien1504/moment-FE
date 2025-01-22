import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface UpdateSuccessUserNameProps {
  show: boolean;
  handleClose: () => void;
  handleLogout: () => void;
}

function UpdateSuccessUserName({ show, handleClose, handleLogout }: UpdateSuccessUserNameProps) {
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn đã thay đổi tên đăng nhập thành công! Vui lòng đăng nhập lại!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default UpdateSuccessUserName;