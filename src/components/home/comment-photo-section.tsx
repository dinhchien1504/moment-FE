"use client";

import API from "@/api/api";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/user_context";
import { FetchClientGetApi, FetchClientPostApi } from "@/api/fetch_client_api";
import { Button, Card, Form, InputGroup } from "react-bootstrap"; // Thay CardContent bằng Form, InputGroup
import { CommentPhotoItem } from "./comment-photo-item";
import SpinnerAnimation from "../shared/spiner_animation";

interface CommentPhotoSectionProps {
  photoId: number;
}

const CommentPhotoSection = ({ photoId }: CommentPhotoSectionProps) => {
  const [comments, setComments] = useState<CommentClient[]>([]);
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUserContext();

  // Tải bình luận từ server
  const fetchComments = async (
    beforeCreatedAt: string | null = null,
    append = false
  ) => {
    setIsLoadingMore(true);

    const params = new URLSearchParams({ photoId: photoId.toString() });
    if (beforeCreatedAt) params.append("createdAt", beforeCreatedAt);

    const data: CommentClientResponse = await FetchClientGetApi(
      `${API.COMMENT.PUBLIC_COMMENT_PHOTO}?${params.toString()}`
    );

    const newComments = data.result ?? [];

    setComments((prev) => (append ? [...prev, ...newComments] : newComments));
    setLastCreatedAt(
      newComments.length > 0
        ? newComments[newComments.length - 1].createdAt
        : null
    );
    setHasMore(data.currentPage < data.totalPages - 1);
    setIsLoadingMore(false);
  };
  useEffect(() => {
    console.log(photoId);
    if (photoId != 0) fetchComments();
  }, [photoId]);

  // Gửi bình luận mới
  const handleSubmitNewComment = async () => {
    const content = newCommentContent.trim();
    if (!content) return;

    setIsSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentClient = {
      id: tempId,
      content,
      createdAt: "",
      authorName: user?.name || "Bạn",
      authorAvatar: user?.urlPhoto || "",
      replyCount: 0,
      authorId: user?.id || "",
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewCommentContent("");

    const res = await FetchClientPostApi(API.COMMENT.COMMENT, {
      photoId,
      content,
    });

    if (res.status === 200 && res.result) {
      const actualComment = res.result as CommentClient;
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? actualComment : c))
      );
    } else {
      console.error("Gửi bình luận thất bại:", res);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }

    setIsSubmitting(false);
  };

  // Nhấn Enter để gửi, Shift + Enter để xuống dòng
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitNewComment();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Nút xem thêm bình luận */}
      {hasMore && (
        <div className="mb-3">
          <Button
            variant="link"
            className="text-primary hover:text-primary-dark p-0"
            onClick={() => fetchComments(lastCreatedAt, true)}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <div className="d-flex justify-content-center align-items-center">
                <SpinnerAnimation></SpinnerAnimation>
              </div>
            ) : (
              "Xem thêm bình luận cũ hơn"
            )}
          </Button>
        </div>
      )}

      {/* Danh sách bình luận */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments
            .slice()
            .reverse()
            .map((comment: CommentClient) => (
              <Card
                key={`comment-card-${comment.id}`}
                className="border-0 bg-light rounded-3"
              >
                <Card.Body className="p-0">
                  <CommentPhotoItem
                    comment={comment}
                    photoId={photoId}
                    currentAccount={user ?? undefined}
                  />
                </Card.Body>
              </Card>
            ))
        ) : (
          <Card className="border-0 shadow-sm bg-light rounded-3">
            <Card.Body className="text-center text-muted" style={{height:60}}>
              {isLoadingMore && comments.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center">
                  <SpinnerAnimation></SpinnerAnimation>
                </div>
              ) : (
                "Chưa có bình luận nào."
              )}
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Giao diện nhập bình luận mới */}
      {user  && (
        <Card className="border-0 bg-light rounded-3 mt-4 mb-5">
          <Card.Body className="">
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Viết bình luận..."
                className="border rounded-3"
                style={{
                  resize: "vertical",
                  minHeight: "60px",
                  maxHeight: "150px",
                }}
              />
              <Button
                variant="primary"
                onClick={handleSubmitNewComment}
                disabled={isSubmitting || !newCommentContent.trim()}
                className="ms-2 align-self-end"
              >
                {isSubmitting ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <SpinnerAnimation></SpinnerAnimation>
                  </div>
                ) : (
                  "Gửi"
                )}
              </Button>
            </InputGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CommentPhotoSection;
