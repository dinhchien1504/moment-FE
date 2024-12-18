"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ContentOfUser from "@/components/profile/content";
import InforUser from "@/components/profile/infor_user";
import "@/styles/ProfileUser.css";

const ProfileUser = () => {
  const images = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150",
  ];

  return (
    <Container
      className="py-4 
      d-flex
      flex-column
      jusitify-content-center
      align-items-center 
      vh-100 
    "
    >
   

      <Row className="w-100">
        <Col md={4} className="mb-4">
          <div className="mb-4">
            <InforUser />
          </div>
          <div>
            <ContentOfUser data={images} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileUser;
