"use client";
import React from "react";
import { Row, Col, Tabs, Tab, Container, Image } from "react-bootstrap";

interface Props {
  ProfileRespone: IProfileResponse;
}

const ContentOfUser = (
  //  data
  props: Props
) => {
  const { ProfileRespone } = props;

  // // Tách dữ liệu thành nhóm 2 phần tử
  // const rows = [];
  // for (let i = 0; i < data.length; i += 2) {
  //   rows.push(data.slice(i, i + 2));
  // }

  return (
    <>
      {
        /* {rows.map((row, rowIndex) => (
        <Row key={rowIndex} className="mb-3">
          {row.map((item, colIndex) => (
            <Col key={colIndex} xs={12} sm={6}>
              <img src={item} alt={`image-${rowIndex}-${colIndex}`} className="img-fluid rounded" />
            </Col>
          ))}
        </Row>
        
      ))} */
        // ProfileRespone.name
      }

      <Tabs
        defaultActiveKey="YourPost"
        id="uncontrolled-tab-example"
        className="mb-3 color_black"
        // style={{
        //   color: "rgba(0, 0, 0, 0.75)",
        // }}
      >
        <Tab eventKey="YourPost" title="Your Post">
          <Container>
            <Row>
              <Col>
                <Image
                  src={ProfileRespone.urlPhoto}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                  }}
                  rounded
                />

              </Col>
              <Col>
                <Image
                  src="https://res.cloudinary.com/moment-images/image/upload/moment-folder/pv9gc4heuan1pvgcjvi8"
                  style={{
                    backgroundColor : '#f2f4f7',
                    maxWidth: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                  }}
                  rounded
                />

              </Col>
              <Col>
                <Image
                  src={ProfileRespone.urlPhoto}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                  }}
                  rounded
                />

              </Col>
              
            </Row>
          </Container>
        </Tab>
        <Tab eventKey="profile" title="Favorite">
          Tab content for Profile
        </Tab>
        <Tab eventKey="contact" title="Liked">
          Tab content for Contact
        </Tab>
      </Tabs>
    </>
  );
};

export default ContentOfUser;
