import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import RequestFriend from "@/components/friend/request_friend";
import FriendList from "@/components/home/friend_list";
import VerticalSwiper from "@/components/home/swiper_vertical";
import "@/styles/home.css";
import "@/styles/post_modal.css";
import { getServerUTC } from "@/utils/utc_server_action";
import { getCurrentTime } from "@/utils/utils_time";
import { Col, Container, Row } from "react-bootstrap";
const HomePage = async () => {
  const time= await getServerUTC()
  const dataPhoto:IPhotoFilterRequest = {
    pageCurrent: 0,
    time: time,
  };

  const resPhoto = await FetchServerPostApi(API.PHOTO.LIST, dataPhoto);
  return (
    <>
      <Container fluid className="container-home h-100">
        <Row>
          <Col md={5} lg={3}  className="d-block p-0">
            <FriendList />
          </Col>
          <Col md={7} lg={6} className="h-100 p-0">
            <VerticalSwiper
              photoResponses={resPhoto.result}
              time={time}
            ></VerticalSwiper>
          </Col>
          <Col md={0} lg={3} className="d-none d-md-block"><RequestFriend/></Col>
        </Row>
      </Container>
      
    </>
  );
};

export default HomePage;
