"use client";
import React, { useRef, useEffect, useState } from "react";
import { Row, Col, Tabs, Tab, Container, Image } from "react-bootstrap";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { GetImage } from "@/utils/handle_images";
import API from "@/api/api";
import "@/styles/profile_user.css";
import SpinnerAnimation from "../shared/spiner_animation";

interface Props {
  profileRespone: IProfileResponse;
  params: string;
  time: string;
}

const ContentOfUser = (props: Props) => {
  const [profileRespone, setProfileRespone] = useState<IProfileResponse>(
    props.profileRespone
  );
  const [pageCurrent, setPageCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { params, time } = props;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPhotoRef = useRef<HTMLDivElement | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState<Record<string, boolean>>({});

  // Hàm tải thêm dữ liệu
  // const handleLazyLoading = async () => {
  //   if (isLoading ||
  //      !hasMore) return; // Dừng nếu đang tải hoặc không còn dữ liệu
  //   setIsLoading(true); // Bắt đầu tải
  //   const dataProfile: IProfileFillterRequest = {
  //     pageCurrent: pageCurrent,
  //     time: time,
  //     userName: params,
  //   };

  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   const resPro = await FetchClientPostApi(API.PROFILE.PROFILE, dataProfile);
    

  //   if (!resPro.result.listPhotoProfile || resPro.result.listPhotoProfile.length === 0) {
  //     setHasMore(false); // Không còn dữ liệu
  //     setIsLoading(false); // Kết thúc tải
  //     return; // Dừng lại
  //   }

  //   // Append thêm ảnh mới vào danh sách
  //   setProfileRespone((prev) => {
  //     const newPhotos = resPro.result.listPhotoProfile.filter(
  //       (newPhoto: IPhotoResponse) =>
  //         !prev.listPhotoProfile.some(
  //           (existingPhoto: IPhotoResponse) => existingPhoto.id === newPhoto.id
  //         )
  //     );

  //     const newLoadingState = newPhotos.reduce((acc, photo) => {
  //       acc[photo.id] = true; // Đặt trạng thái loading ban đầu là true
  //       return acc;
  //     }, {} as Record<string, boolean>);
    
  //     setLoadingPhotos((prevLoading) => ({
  //       ...prevLoading,
  //       ...newLoadingState,
  //     }));

  //     return {
  //       ...prev,
  //       listPhotoProfile: [...prev.listPhotoProfile, ...newPhotos],
  //     };
  //   });
  //   // console.log("profile photo 2 ", profileRespone);
  //   setIsLoading(false); // Kết thúc tải

  // };

  
  const handleLazyLoading = async () => {
    if (isLoading || !hasMore) return; // Dừng nếu đang tải hoặc không còn dữ liệu
    setIsLoading(true); // Bắt đầu tải
    const dataProfile: IProfileFillterRequest = {
      pageCurrent: pageCurrent,
      time: time,
      userName: params,
    };

    const resPro = await FetchClientPostApi(API.PROFILE.PROFILE, dataProfile);
    

    if (!resPro.result.listPhotoProfile || resPro.result.listPhotoProfile.length === 0) {
      setHasMore(false); // Không còn dữ liệu
      setIsLoading(false); // Kết thúc tải
      return; // Dừng lại
    }

    // Append thêm ảnh mới vào danh sách
    setProfileRespone((prev) => {
      const newPhotos = resPro.result.listPhotoProfile.filter(
        (newPhoto: IPhotoResponse) =>
          !prev.listPhotoProfile.some(
            (existingPhoto: IPhotoResponse) => existingPhoto.id === newPhoto.id
          )
      );

      return {
        ...prev,
        listPhotoProfile: [...prev.listPhotoProfile, ...newPhotos],
      };
    });
    // console.log("profile photo 2 ", profileRespone);
    setIsLoading(false); // Kết thúc tải

  }; 



  // Tăng `pageCurrent` khi phần tử cuối được cuộn vào vùng nhìn thấy
  useEffect(() => {
    // console.log ( "PAge cur first",pageCurrent)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        // if (lastEntry.isIntersecting && hasMore) {
          if (lastEntry.isIntersecting && hasMore && !isLoading){
          setPageCurrent((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const element = lastPhotoRef.current;
    if (element) {
      observerRef.current.observe(element);
    }

    return () => {
      if (element) observerRef.current?.unobserve(element);
    };
  }, [profileRespone.listPhotoProfile, hasMore,isLoading]);

  // Gọi API khi `pageCurrent` thay đổi
  useEffect(() => {
    if (hasMore) {
      handleLazyLoading();
    }
  }, [pageCurrent, hasMore]);
  
  return (
    <Tabs
      defaultActiveKey="YourPost"
      id="uncontrolled-tab-example"
      className="mb-3 color_black"
    >
      <Tab eventKey="YourPost" title="Your Post">
        <Container className="ListImg">
          <Row className="g-4">
            {profileRespone.listPhotoProfile.map((photo, index) => {
              // Đặt ref cho phần tử cuối cùng
              const isLastPhoto =
                index === profileRespone.listPhotoProfile.length - 1;
              return (

                <Col
                  clas
                  key={photo.id}
                  ref={isLastPhoto ? lastPhotoRef : null}
                  className="col-12 gap-3 col-sm-6 col-md-4"
                >
                  <Image
                    className="ImgBlock"
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
          {isLoading && hasMore && (
            <div className="loading-spinner d-flex justify-content-center align-items-center mt-3">
              <SpinnerAnimation/>
            </div>
          )}
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
