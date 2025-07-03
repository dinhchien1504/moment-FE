"use client";

import API from "@/api/api";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/user_context";
import { FetchClientGetApi, FetchClientPostApi } from "@/api/fetch_client_api";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { CommentPhotoItem } from "./comment-photo-item";
import SpinnerAnimation from "../shared/spiner_animation";
import { useSocketContext } from "@/context/socket_context";

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
  const [userCurrent, setUserCurrent] = useState<IUserResponse|null>(null);
  const { subscribe } = useSocketContext();

  // Tải bình luận từ server
  const fetchComments = async (
    beforeCreatedAt: string | null = null,
    append = false
  ) => {
    setIsLoadingMore(true);

    const params = new URLSearchParams({ photoId: photoId.toString() });
    if (beforeCreatedAt) params.append("createdAt", beforeCreatedAt);

    const data: CommentClientResponse = await FetchClientGetApi(
      `${API.COMMENT.COMMENT_PHOTO}?${params.toString()}`
    );

    const newComments = (data.result ?? []).map((comment) => ({
      ...comment,
      replies: [], // Khởi tạo replies
    }));

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
    if (photoId !== 0) fetchComments();
  }, [photoId]);

  useEffect(() => {
    if (user == undefined) return;
    setUserCurrent(user);
  }, [user]);

  // Gửi bình luận mới
  const handleSubmitNewComment = async () => {
    const content = newCommentContent.trim();
    if (!content) return;

    setIsSubmitting(true);

    const tempId = Date.now();
    const optimisticComment: CommentClient = {
      id: tempId,
      content,
      createdAt: "",
      authorName: user?.name || "Bạn",
      authorAvatar: user?.urlPhoto || "",
      replyCount: 0,
      authorId: user?.id || "",
      replies: [], // Khởi tạo replies
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setNewCommentContent("");

    const res = await FetchClientPostApi(API.COMMENT.COMMENT, {
      photoId,
      content,
    });

    if (res.status === 200 && res.result) {
      const actualComment = { ...res.result, replies: [] } as CommentClient;
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? actualComment : c))
      );
    } else {
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

  // Hàm đệ quy để tìm và chèn bình luận
  const insertCommentByPath = (
    comments: CommentClient[],
    newComment: CommentClient
  ): CommentClient[] => {
    if (!newComment.path || newComment.path.length === 0) {
      return [{ ...newComment, replies: [] }, ...comments];
    }

    const convertIdsToNumber = (comments: any[]): CommentClient[] => {
      return comments.map((c) => ({
        ...c,
        id: Number(c.id),
        replies: c.replies ? convertIdsToNumber(c.replies) : [],
      }));
    };

    const updatedComments = convertIdsToNumber(comments);

    const insertRecursively = (
      currentList: CommentClient[],
      path: number[],
      level: number
    ): boolean => {
      const currentId = path[level];

      const currentComment = currentList.find((c) => c.id === currentId);

      if (!currentComment) {
        return false;
      }

      // Đảm bảo replies là mảng
      currentComment.replies = currentComment.replies || [];

      if (level === path.length - 1) {
        currentComment.replies.unshift({ ...newComment, replies: [] });
        currentComment.replyCount = (currentComment.replyCount || 0) + 1;
        return true;
      }

      return insertRecursively(currentComment.replies, path, level + 1);
    };

    const inserted = insertRecursively(updatedComments, newComment.path, 0);

    if (!inserted) {
      return comments;
    }

    return updatedComments;
  };

  // WebSocket subscription cho bình luận mới
  useEffect(() => {
    if (!photoId || !user?.id) return;

    const destination = `/topic/photo/${photoId}/comment`;

    const handleMessage = (message: any) => {
      const newComment: CommentClient = JSON.parse(message.body);
      if (newComment.authorId === user?.id) return;

      setComments((prev) => {
        const exists = prev.some((c) => c.id === newComment.id);
        if (exists) return prev;
        return insertCommentByPath(prev, { ...newComment, replies: [] });
      });
    };

    const subscription = subscribe(destination, handleMessage);

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
        console.log("Unsubscribed khỏi:", destination);
      }
    };
  }, [photoId]);

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
                <SpinnerAnimation />
              </div>
            ) : (
              "Xem thêm bình luận cũ hơn"
            )}
          </Button>
        </div>
      )}

      {/* Danh sách bình luận */}
      <div className="space-y-3">
        {comments.length > 0 && userCurrent!=null ? (
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
                      currentAccount={userCurrent}
                      setComments={setComments} // Truyền setComments
                    />
                  </Card.Body>
              </Card>
            ))
        ) : (
          <Card className="border-0 shadow-sm bg-light rounded-3">
            <Card.Body
              className="text-center text-muted"
              style={{ height: 60 }}
            >
              {isLoadingMore && comments.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center">
                  <SpinnerAnimation />
                </div>
              ) : (
                "Chưa có bình luận nào."
              )}
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Giao diện nhập bình luận mới */}
      {user && (
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
                    <SpinnerAnimation />
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
