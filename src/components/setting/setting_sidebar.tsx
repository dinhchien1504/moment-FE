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
import styles from '@/styles/setting.module.css';
import SpinnerAnimation from '../shared/spiner_animation';

const SettingSidebar = () => {

    const [accountInfo, setAccountInfo] = useState<IAccountResponse | null>(null);
    const [activeTab, setActiveTab] = useState("first");

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
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <SpinnerAnimation></SpinnerAnimation>
            </div> // Hiển thị khi dữ liệu đang tải
        )
    }
    return (
        <>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <div className={styles.tabContainer}>
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" activeKey={activeTab}
                                onSelect={(selectedKey) => selectedKey && setActiveTab(selectedKey)} className={`flex-column ${styles.navPills}`}>
                                <div className={styles.rowNav}>

                                    <Nav.Item>
                                        <Nav.Link
                                            as="div"
                                            eventKey="first"
                                            style={{
                                                backgroundColor: activeTab === "first" ? "black" : "transparent",
                                                color: activeTab === "first" ? "white" : "black",
                                                padding: "10px 15px",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                transition: "0.3s",
                                            }}
                                            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = activeTab === "first" ? "black" : "#ddd"}
                                            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = activeTab === "first" ? "black" : "transparent"}
                                        >
                                            Mật khẩu & bảo mật
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link
                                            as="div"
                                            eventKey="second"
                                            style={{
                                                backgroundColor: activeTab === "second" ? "black" : "transparent",
                                                color: activeTab === "second" ? "white" : "black",
                                                padding: "10px 15px",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Thông tin cá nhân
                                        </Nav.Link>
                                    </Nav.Item>

                                </div>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first" className='mt-3'>
                                    <h3 className={styles.title}>Mật khẩu và bảo mật</h3>
                                    <FormChangePassword />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second" className='mt-3'>
                                    <h3  >Thông tin cá nhân</h3>
                                    <Card className={styles.card}>
                                        <Card.Header as="h5" className={styles.cardHeader}>
                                            {accountInfo.name}
                                        </Card.Header>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className={styles.listGroupItemEmail}>
                                                Email: {accountInfo.email}
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.listGroupItem}>
                                                <span className={styles.listGroupItemUserName}>Tên đăng nhập: {accountInfo.userName}</span>
                                                <ModelChangeUserName
                                                    currentUserName={accountInfo.userName}
                                                    onSave={handleSaveUserName}
                                                />
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.listGroupItemEmail}>
                                                Số điện thoại: {accountInfo.phoneNumber}
                                            </ListGroup.Item>
                                            <Card.Body className={styles.cardBody}>
                                                <Card.Text>Ngày sinh: {accountInfo.birthday}</Card.Text>
                                                <Card.Text>Giới tính: {accountInfo.sex === "male" ? "Nam" : "Nữ"}</Card.Text>
                                                <Card.Text>Địa chỉ: {accountInfo.address}</Card.Text>
                                                <ModalChangInfo
                                                    accountInfo={accountInfo}
                                                    onSave={(updatedInfo) =>
                                                        setAccountInfo((prev) =>
                                                            updatedInfo ? { ...prev, ...updatedInfo } : prev
                                                        )
                                                    }
                                                />
                                            </Card.Body>
                                        </ListGroup>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </div>
            </Tab.Container>


        </>)

}

export default SettingSidebar