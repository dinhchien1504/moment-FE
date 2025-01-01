import API from "@/api/api";
import { FetchServerGetApi, FetchServerPostApi } from "@/api/fetch_server_api";
import FriendList from "@/components/home/friend_list";
import VerticalSwiper from "@/components/home/swiper_vertical";
import "@/styles/home.css";
import { getCurrentTime, getTimeZone } from "@/utils/utils_time";
import { Col, Container, Row } from "react-bootstrap";
const HomePage = async () => {
  const timestamp= getCurrentTime()
  const dataPhoto = {
    pageCurrent: 0,
    time: timestamp,
    
  };

  const resPhoto = await FetchServerPostApi(API.PHOTO.LIST, dataPhoto);
  //const resAccountFriend= await FetchServerGetApi(API.ACCOUNT.LIST);
  return (
    <>
      <Container fluid className="container-home h-100">
        <Row>
          <Col md={3} className="d-block">
{/*             <FriendList accountResponses={resAccountFriend.result}></FriendList> */}
          </Col>
          <Col md={6} className="h-100 p-0">
            <VerticalSwiper
              photoResponses={resPhoto.result}
              timestamp={timestamp}
            ></VerticalSwiper>
          </Col>
          <Col md={3} className="d-none d-md-block">col 3</Col>
        </Row>
      </Container>
      
    </>
  );
};

export default HomePage;
