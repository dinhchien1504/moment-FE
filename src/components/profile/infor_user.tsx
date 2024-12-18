'use client'
import React from 'react'
import { Col, Container, Row,Button } from "react-bootstrap"


const InforUser = () => {
  return (
    <Row  >
        <Col>
        <Button variant="dark">Dark</Button>
          My AVT
        </Col>
        <Col>
          My Infor
        </Col>
    </Row>
  )
}

export default InforUser
