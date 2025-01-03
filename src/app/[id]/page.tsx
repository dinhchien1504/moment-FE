'use server'
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ContentOfUser from "@/components/profile/content";
import InforUser from "@/components/profile/infor_user";
import "@/styles/profile_user.css";
import API from "@/api/api";
import { FetchServerGetApi, FetchServerPostApi } from "@/api/fetch_server_api";
import { getCurrentTime, getTimeZone } from "@/utils/utils_time";


const ProfileUser = async (props: any ) => {
  const { params } = props;
  // console.log ('para',params.id);
  const timestamp= getCurrentTime()

  const dataProfile: IProfileFillterRequest  = {
    pageCurrent: 0,
    time: timestamp,
    userName:params.id,
  }
  const resProfile = await FetchServerPostApi(API.PROFILE.PROFILE ,dataProfile);
  // console.log(resProfile.result);
  // const resProfile = await FetchServerGetApi(API.PROFILE.GETPROFILE , dataProfile);
  // const resProfile = await FetchServerGetApi(API.PHOTO.LIST , dataProfile);


  // console.log('this is',resProfile)

  // const res:IProfileResponse  = {
  //   id:11,
  //   listUrlPhoto:[
  //     "",
  //   ],
  //   name:"em Chien",
  //   urlAvt:"https://via.placeholder.com/150",
  //   userName:"DinhChien",
  // }; 


  return (
    <div style={{backgroundColor:"#f2f4f7"}}>

    <Container
      className="py-4 
      d-flex
      flex-column
      jusitify-content-center
      align-items-center 
      bg_color
    "
    >
      <Row className="w-100  center_col bg_white margin2px " >
        <Col md={4} className="mb-4 width90ps">
          <div className="mb-4  " >
            <InforUser profileRespone = {resProfile.result } 
              params = {params.id}
            />
          </div>
          <div>
            <ContentOfUser profileRespone={resProfile.result}
             time =  {timestamp}
              
              params = {params.id}

            />
          </div>
        </Col>
      </Row>
    </Container>
    </div>

  );
};

export default ProfileUser;
