"use client";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { GetImage } from "@/utils/handle_images";
import { getCurrentTime } from "@/utils/utils_time";
import React, { useRef,useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Container, Image } from "react-bootstrap";
import API from "@/api/api";

interface Props {
  profileRespone: IProfileResponse;
  params:string
}

const ContentOfUser = (props: Props) => {
  const [profileRespone, setProfileRespone] = useState<IProfileResponse>(
    props.profileRespone
  );
  const [pageCurrent ,setPageCurrent ]= useState(1)
  const {params} = props;
  const listImgRef = useRef<HTMLDivElement>(null);
  
  // console.log('this is page cur',pageCurrent)

const handleLazyLoading = async () => {
  const dataProfile: IProfileFillterRequest  = {
    pageCurrent: pageCurrent,
    time: getCurrentTime(),
    userName:params,
  }
  const resPro = await FetchClientPostApi(API.PROFILE.PROFILE ,dataProfile)
// console.log('this test resPro',resPro.result)


// console.log ('profilerespone',profileRespone )
 // Append new photos to the list
 setProfileRespone((prev) => ({
  ...prev,
  listPhotoProfile: [...prev.listPhotoProfile, ...resPro.result.listPhotoProfile],
}));

}

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setPageCurrent((prev) => prev + 1);
      }
    },
    { root: null, rootMargin: "100px", threshold: 0 }
  );

  const element = listImgRef.current;
  if (element) {
    observer.observe(element);
  }

  return () => {
    if (element) observer.unobserve(element);
  };
}, []);

useEffect(() => {
  handleLazyLoading();
}, [pageCurrent]);






  return (
    <>
      <Tabs
        defaultActiveKey="YourPost"
        id="uncontrolled-tab-example"
        className="mb-3 color_black"
        // style={{
        //   color: "rgba(0, 0, 0, 0.75)",
        // }}
      >
        <Tab eventKey="YourPost" title="Your Post">
          <Container ref={listImgRef} className="ListImg">
            <Row className="g-4" >
              {profileRespone.listPhotoProfile.map((photo, index) => (
                <Col key={photo.id} className="col-12 gap-3 col-sm-6 col-md-4">
                  <Image
                    src={GetImage(photo.urlPhoto)}
                    style={{
                      backgroundColor: "#f2f4f7",
                      maxWidth: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "contain",
                    }}
                    rounded
                  />
                </Col>
              ))}
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
