"use client"
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import API from "@/api/api";
import { FetchServerGetApi } from "@/api/fetch_server_api";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ModalChangInfo from './modal_changeInfo';
import FormChangePassword from './modal_changPassword';
import ModelChangeUserName from './modal_changeUserName';

const SettingSidebar = () => {

    const [accountInfo, setAccountInfo] = useState<IAccountResponse | null>(null);
    
      const handleSaveUserName = (newUserName: string) => {
        setAccountInfo((prev) => prev ? { ...prev, userName: newUserName } : prev); // Cập nhật tên đăng nhập trên giao diện
      };
    //lấy các thông tin từ accoun
    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const data = await FetchServerGetApi(API.SETTING.SETTING); // Gọi API từ Server
                if (data && data.result) {
                    setAccountInfo(data.result); // Lưu thuộc tính `result` vào state
                }
            } catch (error) {
                console.error('Error fetching account info:', error);
            }
        };

        fetchAccountInfo();
    }, []); // Dependency array trống để gọi khi component mount


    if (!accountInfo) {
        return <p>Loading...</p>; // Hiển thị khi dữ liệu đang tải
    }
    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Mật khẩu và bảo mật</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Thông tin cá nhân</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                <h3> Mật khẩu và bảo mật</h3>
                                <FormChangePassword />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h3>Thông tin cá nhân</h3>
                                <Card style={{ width: '45rem' }}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Email: {accountInfo.email}</ListGroup.Item>
                                        <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Tên đăng nhập: {accountInfo.userName}</span>
                                            <ModelChangeUserName
                                                currentUserName={accountInfo.userName}
                                                onSave={handleSaveUserName}
                                            />
                                        </ListGroup.Item>

                                        <ListGroup.Item>Số điện thoại: {accountInfo.phoneNumber}</ListGroup.Item>

                                        <Card.Header as="h5">{accountInfo.name}</Card.Header>
                                        <Card.Body>
                                            <Card.Text>Ngày sinh: {accountInfo.birthday}</Card.Text>
                                            <Card.Text>Giới tính: {accountInfo.sex}</Card.Text>
                                            <Card.Text>Địa chỉ: {accountInfo.address}</Card.Text>
                                            <ModalChangInfo
                                                accountInfo={accountInfo}
                                                onSave={(updatedInfo: IAccountResponse | null) => setAccountInfo((prev) => updatedInfo ? { ...prev, ...updatedInfo } : prev)}
                                            />
                                        </Card.Body>
                                    </ListGroup>
                                </Card>

                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>


        </>)

}

export default SettingSidebar