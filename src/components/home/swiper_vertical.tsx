"use client";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoCard from "./photo_card";
import { useEffect, useState } from "react";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import API from "@/api/api";
import { Navigation } from "swiper/modules";

interface Props {
  photoResponses: IPhotoResponse[];
  time: string;
}

const VerticalSwiper = (props: Props) => {
  const [photoResponses, setPhotoResponses] = useState<IPhotoResponse[]>(
    props.photoResponses
  );
  const time = props.time;

  const [valueLimit, setValueLimit] = useState<number>(3);
  const [pageCurrent, setPageCurrent] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (src: string) => {
    setImageSrc(src);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageSrc("");
  };
  useEffect(() => {
    console.log(imageSrc);
  }, [imageSrc]);

  const fetchAdditionalImages = async () => {
    setIsLoading(true);
    let data = {
      pageCurrent: pageCurrent + 1,
      time: time,
    };
    setPageCurrent(pageCurrent + 1);
    setValueLimit(valueLimit + 3);
    setTimeout(async () => {
      try {
        const res = await FetchClientPostApi(API.HOME.PHOTO, data);

        const newPhotoResponses = res.result;
        setPhotoResponses((prevPhotoResponses) => [
          ...prevPhotoResponses,
          ...newPhotoResponses, // Thêm ảnh mới vào danh sách ảnh hiện tại
        ]);
      } catch (error) {
        console.error("Error fetching additional images:", error);
      } finally {
        setIsLoading(false); // Đảm bảo set loading là false sau khi tải ảnh xong
      }
    }, 0);
  };
  return (
    <>
      <Swiper
        direction={"vertical"}
        className="mySwiper h-100"
        spaceBetween={10}
        navigation={{
          nextEl: ".swiper-button-down", // Target down button
          prevEl: ".swiper-button-up", // Target up button
        }}
        modules={[Navigation]}
        onReachBeginning={() => {
          console.log("hi");
        }}
        onSlideChange={(swiper) => {
          if (swiper.activeIndex === valueLimit && !isLoading) {
            fetchAdditionalImages();
          }
        }}
      >
        {photoResponses.map((photoResponse, index) => (
          <SwiperSlide key={index}>
            <PhotoCard
              photoResponse={photoResponse}
              openModal={openModal}
            ></PhotoCard>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* popup image */}
      {isModalOpen && (
        <div className="modal-custom-overlay" onClick={closeModal}>
          <div
            className="modal-custom-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imageSrc} alt="Zoomed" className="zoomed-image" />
            <div className="modal-close" onClick={closeModal}>
              X
            </div>
          </div>
        </div>
      )}

      {/* navigation swiper */}
      <div className=" container-navigation align-content-center d-none d-sm-block">
        <div className="swiper-button-up  p-2 rounded-5 bg-opacity-50 bg-danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="#ffffff"
            className="bi bi-arrow-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
            />
          </svg>
        </div>
        <div className="swiper-button-down p-2 rounded-5 bg-opacity-50 bg-danger mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="#ffffff"
            className="bi bi-arrow-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default VerticalSwiper;
