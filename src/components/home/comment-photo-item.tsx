"use client";

import API from "@/api/api";
import {
  FetchClientGetApi,
  FetchClientPostApi,
  FetchClientPutApi,
} from "@/api/fetch_client_api";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Image, InputGroup } from "react-bootstrap"; // Thêm Image, Form, InputGroup
import LoadingSpiner from "../shared/loading_spiner";
import { formatTimeShort } from "@/utils/utils_time";

interface CommentItemProps {
  comment: CommentClient;
  level?: number;
  photoId: number;
  currentAccount: IUserResponse | undefined;
}

export const CommentPhotoItem = ({
  comment,
  level = 0,
  photoId,
  currentAccount,
}: CommentItemProps) => {
  const [mainComment, setMainComment] = useState<CommentClient>(comment);
  const [replies, setReplies] = useState<CommentClient[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
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
    commentId: string,
    append = false
  ) => {
    setIsLoadingReplies(true);
    const data: CommentClientResponse = await FetchClientGetApi(
      `${API.COMMENT.PUBLIC_COMMENT_PHOTO_REPLY}?commentId=${commentId}&page=${page}`
    );

    setReplies((prev) => (append ? [...prev, ...data.result] : data.result));
    setCurrentPage(data.currentPage);
    setTotalItems(data.totalItems || 0);
    setShowReplies(true);
    setIsLoadingReplies(false);
  };

  // Bật/tắt hiển thị phản hồi
  const handleViewReplies = () => {
    if (showReplies) {
      setShowReplies(false);
    } else if (!replies.length && mainComment.replyCount > 0) {
      fetchReplies(0, mainComment.id);
    } else {
      setShowReplies(true);
    }
  };

  // Gửi phản hồi mới
  const handleSubmitNewReply = async () => {
    const content = newReplyContent.trim();
    if (!content) return;

    setIsSubmittingReply(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentClient = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      authorName: currentAccount?.name || "Bạn",
      authorAvatar: currentAccount?.urlPhoto || "",
      replyCount: 0,
      authorId: currentAccount?.id || "",
    };
    setMainComment((prev) => ({
      ...prev,
      replyCount: prev.replyCount + 1,
    }));

    setReplies((prev) => [optimisticComment, ...prev]);
    setNewReplyContent("");
    setShowReplies(true);

    const res = await FetchClientPostApi(API.COMMENT.COMMENT, {
      photoId,
      content,
      commentParentId: mainComment.id, // Sửa lỗi thiếu commentParentId
    });

    if (res.status === 200 && res.result) {
      const actualComment = res.result as CommentClient;
      setReplies((prev) =>
        prev.map((c) => (c.id === tempId ? actualComment : c))
      );
    } else {
      console.error("Gửi phản hồi thất bại:", res);
      setReplies((prev) => prev.filter((c) => c.id !== tempId));
      setMainComment((prev) => ({
        ...prev,
        replyCount: prev.replyCount - 1,
      }));
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
  const handleDeleteComment = async (commentId: string) => {
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
      setMainComment((prev) => ({
        ...prev,
        content: "Bình luận đã bị xóa",
        createdAt: "",
      }));
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
              src={mainComment.authorAvatar || "/images/avatar.jpg"}
              alt={mainComment.authorName}
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
                {mainComment.authorName}
              </span>
            </div>
            <p
              className={`mt-1 mb-2 text-${
                level > 0 ? "sm" : "base"
              } text-dark `}
            >
              {mainComment.content}
            </p>
            <div className="d-flex align-items-center gap-3 text-muted">
              {mainComment.createdAt != "" && (
                <>
                  <span className="font-sm">
                    {formatTimeShort(mainComment.createdAt)}
                  </span>

                  {currentAccount && mainComment.createdAt && (
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
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-danger  hover:text-danger-dark  font-sm"
                        onClick={() => handleDeleteComment(mainComment.id)}
                        disabled={isDeletingComment}
                      >
                        {isDeletingComment ? <LoadingSpiner /> : "Xóa"}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phần phản hồi */}
      {((mainComment.replyCount > 0 || showReplyInput) && mainComment.createdAt != "") && (
        <div className="ms-2 pt-2 ps-2 border-start border-2 border-secondary-subtle">
          {/* Nút xem phản hồi */}
          {!showReplies && mainComment.replyCount > 0 && (
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
                `Xem tất cả ${mainComment.replyCount} phản hồi`
              )}
            </Button>
          )}

          {/* Nút tải thêm phản hồi */}
          {(currentPage + 1) * 10 < totalItems && showReplies && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-primary hover:text-primary-dark font-sm ms-3"
              onClick={() =>
                fetchReplies(currentPage + 1, mainComment.id, true)
              }
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
              {isLoadingReplies && replies.length === 0 ? (
                <div className="d-flex justify-content-center">
                  <LoadingSpiner />
                </div>
              ) : (
                replies
                  .slice()
                  .reverse()
                  .map((reply) => (
                    <CommentPhotoItem
                      key={reply.id}
                      comment={reply}
                      level={level + 1}
                      photoId={photoId}
                      currentAccount={currentAccount}
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
