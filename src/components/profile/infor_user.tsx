"use client";
import { GetImage } from "@/utils/handle_images";
import React, { use, useState } from "react";
import { Col, Container, Row, Button, Stack , Image} from "react-bootstrap";

interface Props {
  profileRespone: IProfileResponse;
  params:string;
}

const InforUser = (props: Props) => {


  // const { ProfileRespone } = props;
  const [profileRespone, setProfileRespone] = useState <IProfileResponse>(props.profileRespone);

  // console.log('this is prpfile' , profileRespone)
  
  return (
    <Row
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        margin:" 2% 0 "
      }}
    >
      <Col className="center_col" >
        <Stack gap={3} className="center_col " >
          <Image  src={GetImage(profileRespone.urlAvt )} style={{
            objectFit: "cover" ,
          }} height= "150px" width="150px"  roundedCircle />
          <div className="">
            {profileRespone.name + " " +  profileRespone.userName } 

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
            {profileRespone.quantityFriend}
          </div>
        </Stack>
      </Col>
    </Row>
  );
};

export default InforUser;
