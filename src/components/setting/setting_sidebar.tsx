"use client"
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Example from './modal_changeInfo';
import FormChangePassword from './modal_changPassword';

const SettingSidebar = () => {
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
                                <FormChangePassword/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <h3>Thông tin cá nhân </h3>
                                <Card style={{ width: '45rem' }}>
                                    <Card.Header>Lê Ngọc Dương</Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>Email: </ListGroup.Item>
                                        <ListGroup.Item>Ngày sinh: </ListGroup.Item>
                                        <ListGroup.Item>Giới tính: </ListGroup.Item>
                                        <ListGroup.Item>Số điện thoại: </ListGroup.Item>
                                        <ListGroup.Item>Địa chỉ: </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Example/>
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