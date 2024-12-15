import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import PhotoCard from "@/components/home/photo_card";
import VerticalSwiper from "@/components/home/swiper_vertical";
import "@/styles/home.css";
import { getCurrentTime, getTimeZone } from "@/utils/utils_time";
import { Col, Container, Row } from "react-bootstrap";
const HomePage = async () => {
  const timestamp= getCurrentTime()
  const timezone = getTimeZone()
  const data = {
    pageCurrent: 0,
    time: timestamp,
    timezone:timezone
  };
  const res = await FetchServerPostApi(API.HOME.PHOTO, data);
  return (
    <>
      <Container fluid className="container-home h-100">
        <Row>
          <Col sm={3} className="d-none d-sm-block">
            col 1
          </Col>
          <Col sm={6} className="h-100 p-0">
            <VerticalSwiper
              photoResponses={res.result}
              timezone={timezone}
              timestamp={timestamp}
            ></VerticalSwiper>
          </Col>
          <Col sm={3} className="d-none d-sm-block">col 3</Col>
        </Row>
      </Container>
      
    </>
  );
};

export default HomePage;
