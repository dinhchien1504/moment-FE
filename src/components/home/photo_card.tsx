"use client";
import { GetImage } from "@/utils/handle_images";
import { formatDate } from "@/utils/utils_time";

interface IProps {
  photoResponse: IPhotoResponse;
  openModal: (src: string) => void;
}
const PhotoCard = (props: IProps) => {
  const id = props.photoResponse.id;
  const urlPhoto = props.photoResponse.urlPhoto;
  const caption = props.photoResponse.caption;
  const createdAt = props.photoResponse.createdAt;
  const name = props.photoResponse.name;
  const urlAvt = props.photoResponse.urlAvt;
  const userName = props.photoResponse.userName;
  const openModal = props.openModal;
  return (
    <>
      <div className="d-flex h-100 flex-column w-100 border border-2 shadow-sm rounded-2 m-2 p-2 bg-light">
        <div className="pt-2 px-2 post-info d-flex">
          <div className="img-avt mx-2">
            <img className="rounded-circle border border-1" src={urlAvt ? urlAvt : "/images/avatar.jpg"} alt={userName} />
          </div>
          <div className="d-block">
            <a className="text-black" href={`/${userName}`}>{name}</a>
            <p className="m-0 fs-6">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="post-caption">
          <p className="m-0 text-align-start">{caption}</p>
        </div>
        <div className="post-img">
          <img src={GetImage(urlPhoto)}
            onClick={() => { openModal(GetImage(urlPhoto)) }}
            alt="Không có ảnh"
          />

        </div>
      </div>
    </>
  );
};
export default PhotoCard;
