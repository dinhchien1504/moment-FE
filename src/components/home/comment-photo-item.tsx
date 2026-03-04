"use client";

import API from "@/api/api";
import {
  FetchClientGetApi,
  FetchClientPostApi,
  FetchClientPutApi,
} from "@/api/fetch_client_api";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Image, InputGroup } from "react-bootstrap";
import LoadingSpiner from "../shared/loading_spiner";
import { formatTimeShort } from "@/utils/utils_time";
import { GetImage } from "@/utils/handle_images";

interface CommentItemProps {
  comment: CommentClient;
  level?: number;
  photoId: number;
  currentAccount: IUserResponse ;
  setComments: React.Dispatch<React.SetStateAction<CommentClient[]>>; // Kiểu đúng cho setter
}

export const CommentPhotoItem = ({
  comment,
  level = 0,
  photoId,
  currentAccount,
  setComments,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const replyTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động focus vào textarea khi hiển thị form trả lời
  useEffect(() => {
    if (showReplyInput && replyTextAreaRef.current) {
      replyTextAreaRef.current.focus();
    }
  }, [showReplyInput]);

  // Gọi API để lấy danh sách phản hồi của 1 bình luận
  const fetchReplies = async (
    page: number,
    commentId: number,
    append = false
  ) => {
    setIsLoadingReplies(true);
    const data: CommentClientResponse = await FetchClientGetApi(
      `${API.COMMENT.COMMENT_PHOTO_REPLY}?commentId=${commentId}&page=${page}`
    );

    const newReplies = (data.result || []).map((reply) => ({
      ...reply,
      replies: [],
    }));

    setComments((prev: CommentClient[]) => {
      const updatedComments = JSON.parse(
        JSON.stringify(prev)
      ) as CommentClient[];
      const updateRecursively = (commentsArray: CommentClient[]): boolean => {
        for (const c of commentsArray) {
          if (c.id === commentId) {
            c.replies = append
              ? [...(c.replies || []), ...newReplies]
              : newReplies;
            c.replyCount = data.totalItems || newReplies.length;
            return true;
          }
          if (c.replies && updateRecursively(c.replies)) {
            return true;
          }
        }
        return false;
      };
      updateRecursively(updatedComments);
      return updatedComments;
    });

    setCurrentPage(data.currentPage);
    setTotalItems(data.totalItems || 0);
    setShowReplies(true);
    setIsLoadingReplies(false);
  };

  // Bật/tắt hiển thị phản hồi
  // Bật/tắt hiển thị phản hồi
  const handleViewReplies = () => {
    if (showReplies) {
      setShowReplies(false);
    } else if (!comment.replies?.length && comment.replyCount > 0) {
      fetchReplies(0, comment.id);
    } else {
      setShowReplies(true);
    }
  };

  // Gửi phản hồi mới
  const handleSubmitNewReply = async () => {
    const content = newReplyContent.trim();
    if (!content) return;

    setIsSubmittingReply(true);

    const optimisticComment: CommentClient = {
      id: 0,
      content,
      createdAt: new Date().toISOString(),
      authorName: currentAccount?.name || "Bạn",
      authorAvatar: currentAccount?.urlPhoto || "",
      replyCount: 0,
      authorId: currentAccount?.id || "",
      replies: [],
    };

    setComments((prev: CommentClient[]) => {
      const updatedComments = JSON.parse(
        JSON.stringify(prev)
      ) as CommentClient[];
      const updateRecursively = (commentsArray: CommentClient[]): boolean => {
        for (const c of commentsArray) {
          if (c.id === comment.id) {
            c.replyCount = (c.replyCount || 0) + 1;
            c.replies = c.replies || [];
            c.replies.unshift(optimisticComment);
            return true;
          }
          if (c.replies && updateRecursively(c.replies)) {
            return true;
          }
        }
        return false;
      };
      updateRecursively(updatedComments);
      return updatedComments;
    });

    setNewReplyContent("");
    setShowReplies(true);

    const res = await FetchClientPostApi(API.COMMENT.COMMENT, {
      photoId,
      content,
      commentParentId: comment.id,
    });

    if (res.status === 200 && res.result) {
      const actualComment = { ...res.result, replies: [] } as CommentClient;
      setComments((prev: CommentClient[]) => {
        const updatedComments = JSON.parse(
          JSON.stringify(prev)
        ) as CommentClient[];
        const updateRecursively = (commentsArray: CommentClient[]): boolean => {
          for (const c of commentsArray) {
            if (c.id === comment.id) {
              c.replies = c.replies?.map((r) =>
                r.id === 0 ? actualComment : r
              );
              return true;
            }
            if (c.replies && updateRecursively(c.replies)) {
              return true;
            }
          }
          return false;
        };
        updateRecursively(updatedComments);
        return updatedComments;
      });
    } else {
      console.error("Gửi phản hồi thất bại:", res);
      setComments((prev: CommentClient[]) => {
        const updatedComments = JSON.parse(
          JSON.stringify(prev)
        ) as CommentClient[];
        const removeRecursively = (commentsArray: CommentClient[]): boolean => {
          for (const c of commentsArray) {
            if (c.id === comment.id) {
              c.replyCount = (c.replyCount || 1) - 1;
              c.replies = c.replies?.filter((r) => r.id !== 0);
              return true;
            }
            if (c.replies && removeRecursively(c.replies)) {
              return true;
            }
          }
          return false;
        };
        removeRecursively(updatedComments);
        return updatedComments;
      });
    }

    setIsSubmittingReply(false);
  };

  // Gửi phản hồi bằng Enter, Shift+Enter để xuống dòng
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitNewReply();
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa bình luận này?"
    );
    if (!confirmed) return;

    setIsDeletingComment(true);
    const res = await FetchClientPutApi(API.COMMENT.ADMIN_DELETE_COMMENT, {
      commentId,
      status: "inactive",
    });

    if (res.status === 200) {
      setComments((prev: CommentClient[]) => {
        const updatedComments = JSON.parse(
          JSON.stringify(prev)
        ) as CommentClient[];
        const updateRecursively = (commentsArray: CommentClient[]): boolean => {
          for (let i = 0; i < commentsArray.length; i++) {
            if (commentsArray[i].id === commentId) {
              commentsArray[i] = {
                ...commentsArray[i],
                content: "Bình luận đã bị xóa",
                createdAt: "",
              };
              return true;
            }
            if (
              commentsArray[i].replies &&
              updateRecursively(commentsArray[i].replies as CommentClient[])
            ) {
              return true;
            }
          }
          return false;
        };
        updateRecursively(updatedComments);
        return updatedComments;
      });
    } else {
      console.error("Failed to delete comment:", res);
    }

    setIsDeletingComment(false);
  };

  return (
    <div className={`mb-2 ${level > 0 ? "ms-2" : ""}`}>
      <div className="p-2 bg-light  rounded-3 shadow-sm hover:shadow transition">
        {/* Comment chính */}
        <div className="d-flex align-items-start gap-3">
          {/* Avatar */}
          <div className="avatar-wrapper">
            <Image
              src={GetImage(comment.authorAvatar) || "/images/avatar.jpg"}
              alt={comment.authorName}
              roundedCircle
              width={level > 0 ? 32 : 40}
              height={level > 0 ? 32 : 40}
              className=""
              onError={(e) => (e.currentTarget.src = "/images/avatar.jpg")}
            />
          </div>

          {/* Nội dung comment */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark ">
                {comment.authorName}
              </span>
            </div>
            <p
              className={`mt-1 mb-2 text-${
                level > 0 ? "sm" : "base"
              } text-dark `}
            >
              {comment.content}
            </p>
            <div className="d-flex align-items-center gap-3 text-muted">
              {comment.createdAt != "" && (
                <>
                  <span className="font-sm">
                    {formatTimeShort(comment.createdAt)}
                  </span>

                  {currentAccount && comment.createdAt && (
                    <>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-primary hover:text-primary-dark font-sm"
                        onClick={() => setShowReplyInput(true)}
                        disabled={showReplyInput}
                      >
                        Trả lời
                      </Button>
                      {currentAccount?.id == comment.authorId && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-danger  hover:text-danger-dark  font-sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isDeletingComment}
                        >
                          {isDeletingComment ? <LoadingSpiner /> : "Xóa"}
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phần phản hồi */}
      {(comment.replyCount > 0 || showReplyInput) &&
        comment.createdAt != "" && (
          <div className="ms-2 pt-2 ps-2 border-start border-2 border-secondary-subtle">
            {/* Nút xem phản hồi */}
            {!showReplies && comment.replyCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 text-primary hover:text-primary-dark font-sm"
                onClick={handleViewReplies}
                disabled={isLoadingReplies}
              >
                {isLoadingReplies ? (
                  <LoadingSpiner />
                ) : (
                  `Xem tất cả ${comment.replyCount} phản hồi`
                )}
              </Button>
            )}

            {/* Nút tải thêm phản hồi */}
            {(currentPage + 1) * 10 < totalItems && showReplies && (
              <Button
                variant="link"
                size="sm"
                className="p-0 text-primary hover:text-primary-dark font-sm ms-3"
                onClick={() => fetchReplies(currentPage + 1, comment.id, true)}
                disabled={isLoadingReplies}
              >
                {isLoadingReplies ? (
                  <LoadingSpiner />
                ) : (
                  `Xem ${totalItems - (currentPage + 1) * 10} phản hồi cũ hơn`
                )}
              </Button>
            )}

            {/* Danh sách phản hồi */}
            {showReplies && (
              <div className="mt-2">
                {isLoadingReplies &&
                (!comment.replies || comment.replies.length === 0) ? (
                  <div className="d-flex justify-content-center">
                    <LoadingSpiner />
                  </div>
                ) : (
                  comment.replies
                    ?.slice()
                    .reverse()
                    .map((reply) => (
                      <CommentPhotoItem
                        key={reply.id}
                        comment={reply}
                        level={level + 1}
                        photoId={photoId}
                        currentAccount={currentAccount}
                        setComments={setComments}
                      />
                    ))
                )}
              </div>
            )}

            {/* Form nhập phản hồi */}
            {showReplyInput && (
              <div className="mt-3">
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newReplyContent}
                    onChange={(e) => setNewReplyContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Viết phản hồi..."
                    ref={replyTextAreaRef}
                    className="border rounded rounded-3 "
                    style={{
                      resize: "vertical",
                      minHeight: "50px",
                      maxHeight: "120px",
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitNewReply}
                    disabled={isSubmittingReply || !newReplyContent.trim()}
                    className="ms-2 align-self-end"
                  >
                    {isSubmittingReply ? <LoadingSpiner /> : "Gửi"}
                  </Button>
                </InputGroup>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
