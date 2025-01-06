import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import FriendList from "@/components/home/friend_list";
import VerticalSwiper from "@/components/home/swiper_vertical";
import "@/styles/home.css";
import "@/styles/post_modal.css";
import { getCurrentTime } from "@/utils/utils_time";
import { Col, Container, Row } from "react-bootstrap";
const HomePage = async () => {
  const time= getCurrentTime()
  const dataPhoto:IPhotoRequest = {
    pageCurrent: 0,
    time: time,
  };

  const resPhoto = await FetchServerPostApi(API.PHOTO.LIST, dataPhoto);
  return (
    <>
      <Container fluid className="container-home h-100">
        <Row>
          <Col md={5} lg={3}  className="d-block">
            <FriendList />
          </Col>
          <Col md={7} lg={6} className="h-100 p-0">
            <VerticalSwiper
              photoResponses={resPhoto.result}
              time={time}
            ></VerticalSwiper>
          </Col>
          <Col md={0} lg={3} className="d-none d-md-block">col 3</Col>
        </Row>
      </Container>
      
    </>
  );
};

export default HomePage;
