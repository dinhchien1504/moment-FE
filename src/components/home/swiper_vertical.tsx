"use client";
import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { useEffect, useState } from "react";
import "swiper/css";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoCard from "./photo_card";

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
    const data = {
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
      <div className="wrapper-swiper position-relative h-100">
        <Swiper
          direction={"vertical"}
          className="h-100"
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-down",
            prevEl: ".swiper-button-up",
          }}
          mousewheel={true}
          modules={[Navigation, Mousewheel]}
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
        <div className="container-navigation d-flex flex-column z-1">
          <div className="d-none flex-column m-auto d-sm-flex justify-content-center flex-grow-1">
            <div className="swiper-button-up p-2 rounded-5 bg-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                className="bi bi-arrow-up text-primary"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                />
              </svg>
            </div>
            <div className="swiper-button-down p-2 rounded-5 bg-secondary mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                className="bi bi-arrow-down text-primary"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
                />
              </svg>
            </div>
          </div>
          <div
            className="bg-primary ms-auto p-2 rounded-2 mt-auto"
            onClick={() => window.location.reload()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              className="text-secondary bi bi-caret-up-fill"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerticalSwiper;
