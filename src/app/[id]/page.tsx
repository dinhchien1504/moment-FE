'use server'
import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import ContentOfUser from "@/components/profile/content";
import InforUser from "@/components/profile/infor_user";
import "@/styles/profile_user.css";
import { getServerUTC } from "@/utils/utc_server_action";
import { Col, Container, Row } from "react-bootstrap";


const ProfileUser = async (props: any ) => {
  const { params } = props;
  // console.log ('para',params.id);
  const timestamp= await getServerUTC()

  const dataProfile: IProfileFillterRequest  = {
    pageCurrent: 0,
    time: timestamp,
    userName:params.id,
  }
  const resProfile = await FetchServerPostApi(API.PROFILE.PROFILE ,dataProfile);

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
