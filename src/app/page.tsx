import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import OffcanvasFriend from "@/components/home/offcanvas_friend";
import VerticalSwiper from "@/components/home/swiper_vertical";
import "@/styles/home.css";
import "@/styles/post_modal.css";
import { getServerUTC } from "@/utils/utc_server_action";
import { Col, Container, Row } from "react-bootstrap";
const HomePage = async () => {
  const time= await getServerUTC()
  const dataPhoto:IPhotoFilterRequest = {
    pageCurrent: 0,
    time: time,
  };

  const resPhoto = await FetchServerPostApi(API.PHOTO.LIST, dataPhoto);
  console.log("photo ne >>> ", resPhoto)
  return (
    <>
      <Container fluid className="container-home">
        <Row className="h-100">
          <Col md={5} lg={3}  className="d-block p-0">
            <OffcanvasFriend />
          </Col>
          <Col md={7} lg={6} className="h-100 p-0">
            <VerticalSwiper
              photoResponses={resPhoto.result}
              time={time}
            ></VerticalSwiper>
          </Col>
          <Col md={0} lg={3} className="d-none d-lg-block">col-3</Col>
        </Row>
      </Container>
      
    </>
  );
};

export default HomePage;
