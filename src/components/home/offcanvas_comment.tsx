"use client";
import { useState } from "react";
import CommentPhotoSection from "./comment-photo-section";

interface OffcanvasCommentProps {
  photoId: number;
}
const OffcanvasComment = ({ photoId }: OffcanvasCommentProps) => {
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);

  return (
    <>
      <div className={`comment d-md-block ${show ? "d-block" : "d-none"}`}>
        <div
          className={`position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-25 z-2 ${
            show ? "d-block" : "d-none"
          }`}
          onClick={() => handleClose()}
        ></div>
        <div className="d-flex flex-column comment-position-sm-fixed rounded-top-5 p-2">
          <div className="height-list-comment">
            <div className="d-flex justify-content-between px-2 mt-2">
              <h3 className="offcanvas-title" id="offcanvasLabel">
                Bình luận
              </h3>
              <button
                onClick={handleClose}
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="height-list-comment-inner overflow-auto">
              {photoId != 0 && (
                <CommentPhotoSection
                  key={`photo-${photoId}-${show}`}
                  photoId={photoId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {photoId != 0 && (
        <div className="button-show-comment position-fixed z-1  d-flex d-md-none">
          <div
            className="bg-dark-subtle p-2 rounded-2 ms-1"
            onClick={() => {
              handleShow();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-chat-dots"
              viewBox="0 0 16 16"
            >
              <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};
export default OffcanvasComment;
