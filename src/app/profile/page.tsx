"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ContentOfUser from "@/components/profile/content";
import InforUser from "@/components/profile/infor_user";
import "@/styles/profile_user.css";
import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";



const ProfileUser = async () => {

  const data {
    
    // pageCurrent: 0,

  }
  const result = await FetchClientPostApi(API.PROFILE.GETPROFILE , data)

  const res:IProfileResponse  = {
    id:11,
    listUrlPhoto:[
      "",
      ""
    ],
    urlPhoto:"https://via.placeholder.com/150",
    description:"em chien ban do ",
    name:"em Chien",
    urlAvt:"https://via.placeholder.com/150",
    userName:"DinhChien",
  }; 


  return (
    <Container
      className="py-4 
      d-flex
      flex-column
      jusitify-content-center
      align-items-center 
      bg_color
    "
    >
   

      <Row className="w-100  center_col bg_white " >
        <Col md={4} className="mb-4 width80ps">
          <div className="mb-4  " >
            <InforUser ProfileRespone = {res}  />
          </div>
          <div>
            <ContentOfUser ProfileRespone={res} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileUser;
