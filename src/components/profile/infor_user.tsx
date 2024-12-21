"use client";
import React from "react";
import { Col, Container, Row, Button, Stack , Image} from "react-bootstrap";

interface Props {
  ProfileRespone: IProfileResponse;
}

const InforUser = (props: Props) => {
  const { ProfileRespone } = props;

  return (
    <Row
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center'
      }}
    >
      <Col className="center_col" >
        <Stack gap={3} className="center_col " >
          <Image  src={ProfileRespone.urlAvt} sizes="150px"  roundedCircle />
          <div className="">
            {ProfileRespone.name + " " +  ProfileRespone.userName } 

          </div>
          <div className="flex gap-2" >
            <Button variant="dark" size="sm" >Edit Profile </Button>
            <Button variant="dark" >Posting</Button>
            <Button variant="dark">  <i className="fa-solid fa-gear"></i></Button>
            <Button variant="dark"><i className="fa-solid fa-share"></i></Button>
          </div>
          <div className="boild">
           111 Friend 
          </div>
          <div className="">
            {ProfileRespone.description}
          </div>
        </Stack>
      </Col>
    </Row>
  );
};

export default InforUser;
