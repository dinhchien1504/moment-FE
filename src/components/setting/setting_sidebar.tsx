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

const SettingSidebar = () => {

    const [accountInfo, setAccountInfo] = useState<IAccountResponse | null>(null);

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const data = await FetchServerGetApi(API.SETTING.SETTING); // Gọi API từ Server
                if (data) {
                    setAccountInfo(data); // Lưu dữ liệu vào state
                }
            } catch (error) {
                console.error('Error fetching account info:', error);
            }
        };

        fetchAccountInfo(); // Gọi hàm bất đồng bộ trong useEffect
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
                                    <Card.Header>{accountInfo.name}</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Email: {accountInfo.email}</ListGroup.Item>
                                        <ListGroup.Item>Tên đăng nhập: {accountInfo.userName}</ListGroup.Item>
                                        <ListGroup.Item>Ngày sinh: {accountInfo.birthday}</ListGroup.Item>
                                        <ListGroup.Item>Giới tính: {accountInfo.sex}</ListGroup.Item>
                                        <ListGroup.Item>Số điện thoại: {accountInfo.phoneNumber}</ListGroup.Item>
                                        <ListGroup.Item>Địa chỉ: {accountInfo.address}</ListGroup.Item>
                                        <ListGroup.Item>
                                            <ModalChangInfo/>
                                        </ListGroup.Item>
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