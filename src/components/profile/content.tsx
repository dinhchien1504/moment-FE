"use client";
import React, { useRef, useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Container, Image } from "react-bootstrap";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { GetImage } from "@/utils/handle_images";
import API from "@/api/api";
import "@/styles/profile_user.css";

interface Props {
  profileRespone: IProfileResponse;
  params: string;
  time: string;
}

const ContentOfUser = (props: Props) => {
  const [profileRespone, setProfileRespone] = useState<IProfileResponse>(props.profileRespone);
  const [pageCurrent, setPageCurrent] = useState(0);
  const { params, time } = props;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPhotoRef = useRef<HTMLDivElement | null>(null);

  // Hàm tải thêm dữ liệu
  const handleLazyLoading = async () => {
    const dataProfile: IProfileFillterRequest = {
      pageCurrent: pageCurrent,
      time: time,
      userName: params,
    };

    const resPro = await FetchClientPostApi(API.PROFILE.PROFILE, dataProfile);

    
    if (resPro.result.listPhotoProfile.length === 0) {
      setHasMore(false);
      return;
    }
    // Append thêm ảnh mới vào danh sách
    setProfileRespone((prev) => ({
      ...prev,
      listPhotoProfile: [...prev.listPhotoProfile, ...resPro.result.listPhotoProfile],
    }));
  };

  // Tăng `pageCurrent` khi phần tử cuối được cuộn vào vùng nhìn thấy
  useEffect(() => {
    console.log ( "PAge cur first",pageCurrent)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting && hasMore) {
          setPageCurrent((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    console.log ( "PAge cur  second",pageCurrent)

    const element = lastPhotoRef.current;
    if (element) {
      observerRef.current.observe(element);
    }

    return () => {
      if (element) observerRef.current?.unobserve(element);
    };
  }, [profileRespone.listPhotoProfile, hasMore]);

  // Gọi API khi `pageCurrent` thay đổi
  useEffect(() => {
    handleLazyLoading();
  }, [pageCurrent]);

  return (
    <Tabs defaultActiveKey="YourPost" id="uncontrolled-tab-example" className="mb-3 color_black">
      <Tab eventKey="YourPost" title="Your Post">
        <Container className="ListImg">
          <Row className="g-4">
            {profileRespone.listPhotoProfile.map((photo, index) => {
              // Đặt ref cho phần tử cuối cùng
              const isLastPhoto = index === profileRespone.listPhotoProfile.length - 1;
              return (
                <Col
                  key={photo.id}
                  ref={isLastPhoto ? lastPhotoRef : null}
                  className="col-12 gap-3 col-sm-6 col-md-4"
                >
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
              );
            })}
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
  );
};

export default ContentOfUser;
