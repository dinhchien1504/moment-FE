"use client";
import { GetImage } from "@/utils/handle_images";
import { formatDate } from "@/utils/utils_time";

interface IProps {
  photoResponse: IPhotoResponse;
  setUrlImageModal: (src: string) => void;
}
const PhotoCard = (props: IProps) => {
  const id = props.photoResponse.id;
  const urlPhoto = props.photoResponse.urlPhoto;
  const caption = props.photoResponse.caption;
  const createdAt = props.photoResponse.createdAt;
  const name = props.photoResponse.name;
  const urlAvt = props.photoResponse.urlAvt;
  const userName = props.photoResponse.userName;
  const setUrlImageModal = props.setUrlImageModal;
  return (
    <>
      <div className="d-flex h-100 flex-column w-100 border border-2 shadow-sm rounded-2 m-2 bg-light">
        <div className="pt-2 px-2 pb-1 post-info d-flex border-bottom mb-2">
          <div className="img-avt mx-2">
            <img className="rounded-circle border border-1" src={GetImage(urlAvt)} alt={userName} loading="lazy"/>
            <div className="swiper-lazy-preloader"></div>
          </div>
          <div className="d-block">
            <a className="text-black" href={`/${userName}`}>{name}</a>
            <p className="m-0 fs-6">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="post-caption px-2 py-1">
          <p className="m-0 text-align-start">{caption}</p>
        </div>
        <div className="post-img d-flex flex-grow-1 pb-2 px-2 pt-1">
          <img src={GetImage(urlPhoto)}
            onClick={() => { setUrlImageModal(GetImage(urlPhoto)) }}
            alt=""
          />

        </div>
      </div>
    </>
  );
};
export default PhotoCard;
